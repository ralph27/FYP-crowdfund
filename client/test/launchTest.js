const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Campaign Launch", function() {
   it ("Launch Campaign with correct params", async () => {
      const Crowdfund = await ethers.getContractFactory("Crowdfund");
      const hardhatCrowdfund = await Crowdfund.deploy("0xF8e2928869E87F6e4E61bBd08a02F2Cd6cC26291");
      const launched = await hardhatCrowdfund.launch(1000, 1653476468, 1653476668);
      console.log("goal", launched);
      expect(launched).to.equal(1000);
   }).timeout(60000)
})