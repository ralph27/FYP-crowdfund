// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract CPAMM {
    IERC20 public immutable GMS;

    uint public reserve_GMS;
    uint public reserve_ETH;

    uint public totalSupply;
    mapping (address => uint) public balanceOf;

    constructor(address _token) {
        GMS = IERC20(_token);
    } 

    receive() external payable {}

    function _mint(address _to, uint _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }

    function _update(uint ResGMS, uint ResETH) private {
        console.log("resGMS: ", ResGMS);
        console.log("resETH: ", ResETH);
        reserve_GMS = ResGMS;
        reserve_ETH = ResETH;
    }

    function swap(address tokenIn, uint amountIn) external payable returns (uint amountOut) {
        require(amountIn > 0, "can't swap 0 tokens");
        bool isGMS = tokenIn == address(GMS);
        
        if (isGMS) {
            GMS.transferFrom(msg.sender, address(this), amountIn);
        } else {    
            (bool success, ) = address(this).call{value: amountIn}("");
            require(success, "Call failed");
        }

        uint amountInWithFee = (amountIn * 997) / 1000;
        if (isGMS) {
            amountOut = (reserve_ETH * amountInWithFee) / (reserve_GMS + amountInWithFee);
            (bool success, ) = msg.sender.call{value: amountOut}("");
            require(success, "Call failed");
            
        } else {
            amountOut = (reserve_GMS * amountInWithFee) / (reserve_ETH + amountInWithFee);
            GMS.transferFrom(address(this), msg.sender, amountOut);
        }

        console.log("amount out: ",amountOut);

       if (isGMS) {
            _update(GMS.balanceOf(address(this)), reserve_ETH - amountOut);
        } else {
            _update(GMS.balanceOf(address(this)), reserve_ETH + amountIn);
        }

    }

    function addLiquidity(uint amountGMS, uint amountETH) external payable returns (uint shares) { 
        require(amountGMS > 0 && amountETH > 0, "Less Than 1");

        GMS.transferFrom(msg.sender, address(this), amountGMS);
        (bool success, ) = address(this).call{value: amountETH}("");
        require(success, "Call failed");

        if (reserve_ETH > 0 && reserve_GMS > 0) {
            require(reserve_GMS * amountGMS == reserve_ETH * amountETH, "x / y != dx / dy");
        }

        if (totalSupply == 0) {
            shares = _sqrt(amountGMS * amountETH);
        } else {
            shares = _min(
                (amountGMS * totalSupply) / reserve_GMS,
                (amountETH * totalSupply) / reserve_ETH
            );
        }

        require(shares > 0, "shares = 0");
        _mint(msg.sender, shares);

       _update(GMS.balanceOf(address(this)), amountETH + reserve_ETH);
    }

    function removeLiquidity(uint _shares) external returns (uint amountGMS, uint amountETH) {
        uint balGMS = GMS.balanceOf(address(this));
        uint balETH = reserve_ETH;

        amountGMS = (_shares * balGMS) / totalSupply;
        amountETH = (_shares * balETH) / totalSupply;
        
        _burn(msg.sender, _shares);
        _update(balGMS - amountGMS, balETH - amountETH);

        GMS.transfer(msg.sender, amountGMS);
        (bool success, ) = msg.sender.call{value: amountETH}("");
        require(success, "Call failed");

    }

    
    function _sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }
    
}

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint amount);
    event Approval(address indexed owner, address indexed spender, uint amount);
}