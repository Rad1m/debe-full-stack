async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log("Token address:", token.address);

  Lottery = await ethers.getContractFactory("Lottery");
  lottery = await Lottery.deploy(token.address);
  await lottery.deployed();

  console.log("Contract address:", lottery.address);

  // save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token, "Token");
  saveFrontendFiles(lottery, "Lottery");
}

function saveFrontendFiles(contract, contractName) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/artifacts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/" + contractName + "-address.json",
    JSON.stringify({ Contract: contract.address }, undefined, 2),
    { encoding: "utf8", flag: "w" }
  );

  const ContractArtifact = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractsDir + "/" + contractName + "-info.json",
    JSON.stringify(ContractArtifact, null, 2),
    { encoding: "utf8", flag: "w" }
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
