const hre = require("hardhat");
const contractAddress = require("../frontend/src/artifacts/Lottery-address.json");

async function main() {
  console.log("Creating game...");

  const lottery = await ethers.getContractAt(
    "Lottery",
    contractAddress.Contract
  );
  const [sender] = await ethers.getSigners();

  const tx = await lottery.createGame(
    0,
    "ArsenalVsBarcelona",
    "Emirates Stadium",
    "Arsenal",
    "Barcelona",
    "",
    0,
    0
  );

  await tx.wait();
  console.log("Game created...");

  const status = await lottery.games(0);
  console.log("Game name is", status.gameName);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
