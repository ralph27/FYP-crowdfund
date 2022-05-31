const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Campaign Launch", function() {
   it ("Launch Campaign with correct params", async () => {
      const ERC20 = await ethers.getContractFactory("ERC20");
      const hardhatCrowdfund = await ERC20.deploy();
      await hardhatCrowdfund.mint(10000)
      const bal = await hardhatCrowdfund.balanceOf("0x0E74E0c6847a2fE151979461a0dF21310E25f5f0");
      expect(bal).to.equal(10000);
   }).timeout(60000)
})