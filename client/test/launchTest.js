const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Campaign Launch", function() {
   it ("Launch Campaign with correct params", async () => {
      const Crowdfund = await ethers.getContractFactory("Crowdfund");
      const hardhatCrowdfund = await Crowdfund.deploy("0xF8e2928869E87F6e4E61bBd08a02F2Cd6cC26291");
      const  res = await hardhatCrowdfund.methods.campaign(29);
      console.log(res);
   }).timeout(60000)
})