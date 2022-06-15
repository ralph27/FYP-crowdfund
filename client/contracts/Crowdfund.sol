// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./ERC20.sol";
import "hardhat/console.sol";

contract Crowdfund is ERC20 {

    event Launch(
        uint id,
        address indexed creator,
        uint goal,
        uint32 startAt,
        uint32 endAt
    );

    event Cancel(uint id);
    event Pledge(uint indexed id, address indexed caller, uint amount);
    event Unpledge(uint indexed id, address indexed caller, uint amount);
    event Claim(uint id);
    event Refund(uint indexed id, address indexed caller, uint amount);
    event Log(uint amount, uint gas);

    struct Campaign {
        address creator;
        uint numberOfInvestors;
        uint goal;
        uint pledged;
        uint32 startAt;
        uint32 endAt;
        bool claimed;
    }

    IERC20 public immutable token;
    address public immutable tokenAddress;
    uint public count = 0;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public pledgedAmount;
    mapping(address => uint[]) public investors;

    constructor(address _token) {
        token = IERC20(_token);
        tokenAddress = _token;
    }

    receive() external payable {
        emit Log(msg.value, gasleft());
    }

    function launch(
        uint _goal,
        uint32 _startAt,
        uint32 _endAt
    ) external returns (uint) {
        require(_startAt >= block.timestamp, "Start at < now");
        require(_endAt >= _startAt, "end at < start at");
        require(_endAt <= block.timestamp + 90 days, "end at > max duration");
        Campaign storage c = campaigns[count];
        c.creator = msg.sender;
        c.numberOfInvestors = 0;
        c.goal = _goal;
        c.pledged = 0;
        c.startAt = _startAt;
        c.endAt = _endAt;
        c.claimed = false;
        count += 1;
        emit Launch(count, msg.sender, _goal, _startAt, _endAt);
        return count;
    }

    function cancel(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(msg.sender == campaign.creator, "Not creator");
        require(block.timestamp < campaign.startAt, "started");
        delete campaigns[_id];
        emit Cancel(_id);
    }

    function pledge(uint _id, uint _amount, address adr) external payable {
        Campaign storage campaign = campaigns[_id];
        require(_amount > 0, "Amount should be bigger than 0");

        if (pledgedAmount[_id][msg.sender] == 0) {
            campaign.numberOfInvestors += 1;
            investors[adr].push(_id);
        }

        (bool success, ) = address(this).call{value: _amount}("");
        require(success, "Call failed");

        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        //token.transferFrom(msg.sender, address(this), _amount);
        campaigns[_id] = campaign;
        emit Pledge(_id, msg.sender, _amount);
    }

    function unpledge(uint _id, uint _amount) external {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp <= campaign.endAt, "Ended");

        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Call failed");

        campaign.pledged -= _amount;
        pledgedAmount[_id][msg.sender] -= _amount;
        //token.transfer(msg.sender, _amount);

        emit Unpledge(_id, msg.sender, _amount);
    }

    function claim(uint _id, uint amount, address adr) external payable {
        Campaign storage campaign = campaigns[_id];

        (bool success, ) = adr.call{value: amount}("");     
        require(success, "Call failed");
        campaign.claimed = true;
        //token.transferFrom(msg.sender, campaign.pledged);
        

        emit Claim(_id);
    }

    function claimShares(uint _id, address adr) external {
        require(pledgedAmount[_id][adr] > 0, "Nothing pledged");
        //uint amountDue = pledgedAmount[_id][msg.sender] * 100 / campaigns[_id].goal;
        token.sendToAddress(tokenAddress, adr, (pledgedAmount[_id][adr] / 10**15) * (10**3));
        pledgedAmount[_id][adr] = 0;
    }

    function getTokens(uint amount) external payable {
        token.sendToContract(address(this), amount);
    }

    function refund(uint _id) external {
        Campaign storage campaign = campaigns[_id];

        uint bal = pledgedAmount[_id][msg.sender];
        (bool success, ) = msg.sender.call{value: bal}("");
        require(success, "Call failed");

        pledgedAmount[_id][msg.sender] = 0;
        //token.transfer(msg.sender, bal);
        
        emit Refund(_id, msg.sender, bal);
    }




}