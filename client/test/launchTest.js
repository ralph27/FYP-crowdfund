const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Campaign Launch", function() {
   it ("Launch Campaign with correct params", async () => {
      const ERC20 = await ethers.getContractFactory("Crowdfund");
      const hardhatCrowdfund = await ERC20.deploy("0x6d93b1dFe4CF195CdA2f4CfEBFEA0D2aD54996d7");
      const res = await hardhatCrowdfund.count();
      console.log(res);
      expect(res).to.equal(0);
   }).timeout(60000)
})