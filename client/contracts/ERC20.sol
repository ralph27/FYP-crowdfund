// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./Staking.sol";

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint);
    
    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    function sendToContract(address recipient, uint amount) external;
     function sendToAddress(address sender, address recipient, uint amount) external;


    event Transfer(address indexed from, address indexed to, uint amount);
    event Approval(address indexed owner, address indexed sender, uint amount);
    event Log(uint amount);
}

contract ERC20 is IERC20, Staking {
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name = "Test";
    string public symbol = "TEST";
    uint8 public decimal = 18;
    uint public amountStaked;

    function transfer(address recipient, uint amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address sender, uint amount) external returns (bool) {
        allowance[msg.sender][sender] = amount;
        emit Approval(msg.sender, sender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(uint amount) external {
        balanceOf[address(this)] += amount;
        totalSupply += amount;
        emit Transfer(address(0), address(this), amount);
    }

    function sendToContract(address recipient,uint amount) external {
        emit Log(balanceOf[address(this)]);
        balanceOf[address(this)] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(address(this), recipient, amount);
    }

    function sendToAddress(address sender, address recipient, uint amount) external {
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function stake(uint _amount) public {
        require(_amount < balanceOf[msg.sender], "Not enough tokens");
        _stake(_amount);
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
    }

        /**
    * @notice withdrawStake is used to withdraw stakes from the account holder
     */
    function withdrawStake(uint256 _amount, uint256 stake_index)  public {

        uint256 amount_to_mint = _withdrawStake(_amount, stake_index);
        // Return staked tokens to user
        balanceOf[msg.sender] += amount_to_mint;
        totalSupply += amount_to_mint;
    }

    function getSummary() public {
        uint amount = hasStake(msg.sender);
        amountStaked = amount;
    }

    function stakerSummart() public view returns (Stakeholder memory) {
        return getSummary(msg.sender);
    }

}