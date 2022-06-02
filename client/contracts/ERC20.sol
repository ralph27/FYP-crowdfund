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
    uint public circulatingSupply;
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
        totalSupply -= amount;
        circulatingSupply += amount;
        emit Transfer(address(this), recipient, amount);
    }

    function sendToAddress(address sender, address recipient, uint amount) external {
        require(totalSupply > amount, "Not enough supply");
        totalSupply -= amount;
        circulatingSupply += amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        circulatingSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function stake(uint _amount, address adr) public {
        require(_amount <= balanceOf[adr], "Not enough tokens");
        _stake(_amount);
        balanceOf[adr] -= _amount;
        circulatingSupply -= _amount;
    }

    function getTotalAmountStaked() public view returns (uint) {
        return total_amount_stacked;
    }

        /**
    * @notice withdrawStake is used to withdraw stakes from the account holder
     */
    function withdrawStake(uint256 initialAmount, uint256 _amount, uint256 _amountMint, address adr)  public {
        require(_amountMint < totalSupply, "Not enough supply");
        // Return staked tokens to user
        balanceOf[adr] += _amountMint;
        totalSupply -= _amount;
        circulatingSupply += _amountMint;
        total_amount_stacked -= initialAmount;
    }

    function getSummary(address adr) view public returns (uint) {
        uint amount = hasStake(adr);
        return amount;
    }

}