// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "./Staking.sol";

contract CPAMM is Staking {
    IERC20 public immutable GMS;

    uint256 public reserve_GMS;
    uint256 public reserve_ETH;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public GmsAdded;
    mapping(address => uint256) public EthAdded;


    constructor(address _token) {
        GMS = IERC20(_token);
    }

    receive() external payable {}

    function _mint(address _to, uint256 _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint256 _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }

    function _update(uint256 ResGMS, uint256 ResETH) private {
        console.log("resGMS: ", ResGMS);
        console.log("resETH: ", ResETH);
        reserve_GMS = ResGMS;
        reserve_ETH = ResETH;
    }

    function stake(uint256 _amount, uint256 id) public {
        require(_amount <= balanceOf[msg.sender], "Not enough tokens");
        _stake(_amount, msg.sender, id);
        balanceOf[msg.sender] -= _amount;
    }

    function getUserStakes(address adr) public view returns (Stake[] memory) {
        uint256 index = stakes[adr];
        Stake[] memory holder = stakeholders[index].address_stakes;
        return holder;
    }

    function getTotalStakes() public view returns (uint256) {
        return number_of_stakes;
    }

    /**
     * @notice withdrawStake is used to withdraw stakes from the account holder
     */
    function withdrawStake(
        uint256 initialAmount,
        uint256 _amount,
        address adr,
        uint256 id
    ) public {
        // uint res = _withdrawStake(initialAmount, id, adr);
        uint256 index = stakes[adr];
        console.log("index: ", index);
        Stake storage holder = stakeholders[index].address_stakes[id];
        holder.claimable = false;
        // Return staked tokens to user
        balanceOf[adr] += initialAmount;
        GMS.sendToContract(msg.sender, _amount);

        //totalSupply -= _amount;
        //total_amount_stacked -= initialAmount;
    }

    function getSummary(address adr) public view returns (uint256) {
        uint256 amount = hasStake(adr);
        return amount;
    }

    function swap(address tokenIn, uint256 amountIn)
        external
        payable
        returns (uint256 amountOut)
    {
        require(amountIn > 0, "can't swap 0 tokens");
        bool isGMS = tokenIn == address(GMS);

        if (isGMS) {
            GMS.transferFrom(msg.sender, address(this), amountIn);
        } else {
            (bool success, ) = address(this).call{value: amountIn}("");
            require(success, "Call failed");
        }

        uint256 amountInWithFee = (amountIn * 997) / 1000;
        if (isGMS) {
            amountOut =
                (reserve_ETH * amountInWithFee) /
                (reserve_GMS + amountInWithFee);
            (bool success, ) = msg.sender.call{value: amountOut}("");
            require(success, "Call failed");
        } else {
            amountOut =
                (reserve_GMS * amountInWithFee) /
                (reserve_ETH + amountInWithFee);
            GMS.transferFrom(address(this), msg.sender, amountOut);
        }

        console.log("amount out: ", amountOut);

        if (isGMS) {
            _update(GMS.balanceOf(address(this)), reserve_ETH - amountOut);
        } else {
            _update(GMS.balanceOf(address(this)), reserve_ETH + amountIn);
        }
    }

    function addLiquidity(uint256 amountGMS, uint256 amountETH)
        external
        payable
        returns (uint256 shares)
    {
        require(amountGMS > 0 && amountETH > 0, "Less Than 1");

        GMS.transferFrom(msg.sender, address(this), amountGMS);
        (bool success, ) = address(this).call{value: amountETH}("");
        require(success, "Call failed");

        if (reserve_ETH > 0 && reserve_GMS > 0) {
            require(
                reserve_GMS * amountGMS == reserve_ETH * amountETH,
                "x / y != dx / dy"
            );
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
        GmsAdded[msg.sender] += amountGMS;
        EthAdded[msg.sender] += amountETH;

        _update(GMS.balanceOf(address(this)), amountETH + reserve_ETH);
    }

    function removeLiquidity(uint256 _shares)
        external
        returns (uint256 amountGMS, uint256 amountETH)
    {
        uint256 balGMS = GMS.balanceOf(address(this));
        uint256 balETH = reserve_ETH;

        amountGMS = (_shares * balGMS) / totalSupply;
        amountETH = (_shares * balETH) / totalSupply;
        console.log("Amountt GMS withdrew: ", amountGMS);

        _burn(msg.sender, _shares);
        _update(balGMS - amountGMS, balETH - amountETH);

        GMS.transfer(msg.sender, amountGMS);
        (bool success, ) = msg.sender.call{value: amountETH}("");
        require(success, "Call failed");
        GmsAdded[msg.sender] -= amountGMS;
        EthAdded[msg.sender] -= amountETH;
    }

    function _sqrt(uint256 y) private pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        return x <= y ? x : y;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function sendToContract(address recipient, uint256 amount) external;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 amount
    );
}
