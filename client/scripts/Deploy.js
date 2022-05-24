async function main() {
  /*const ERC20 = await ethers.getContractFactory("ERC20");
  const ERC20_deployed = await ERC20.deploy();
  console.log("Contract ERC20 deployed to address: ", ERC20_deployed.address);*/

  const Crowdfund = await ethers.getContractFactory("Crowdfund");
  const Crowdfund_deployed = await Crowdfund.deploy("0xF8e2928869E87F6e4E61bBd08a02F2Cd6cC26291" );
  console.log("Contract Crowdfund deployed to address:", Crowdfund_deployed.address);

  /*const Staking = await ethers.getContractFactory("Staking");
  const Staking_deployed = await Staking.deploy();
  console.log("Contract Staking deployed to address: ", Staking_deployed.address);*/  
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });