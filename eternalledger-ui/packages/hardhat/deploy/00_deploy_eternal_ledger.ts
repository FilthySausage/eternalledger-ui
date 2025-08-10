import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployEternalLedger: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("EternalLedger", {
    from: deployer,
    args: [], // ✅ empty array
    log: true,
    autoMine: true,
  });

  const contract = await hre.ethers.getContract("EternalLedger", deployer);
  console.log(`✅ EternalLedger deployed at ${await contract.getAddress()}`);
};

deployEternalLedger.tags = ["EternalLedger"];
export default deployEternalLedger;