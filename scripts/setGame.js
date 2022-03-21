const hre = require("hardhat");
const contractAddress = require("../frontend/src/artifacts/Lottery-address.json");

async function main() {
  console.log("Creating game...");

  const lottery = await ethers.getContractAt(
    "Lottery",
    contractAddress.Contract
  );
  const [sender] = await ethers.getSigners();

  const tx0 = await lottery.createGame(
    0,
    "Arsenal Vs Barcelona",
    "Emirates Stadium",
    "Arsenal",
    "Barcelona",
    "",
    "",
    0,
    0
  );

  await tx0.wait();

  const tx1 = await lottery.createGame(
    1,
    "Aston Villa vs Burnley",
    "Villa Park",
    "Aston Villa",
    "Burnley",
    "Burnley",
    "2:3",
    3,
    0
  );

  await tx1.wait();

  const status0 = await lottery.games(0);
  const status1 = await lottery.games(1);
  const gameCount = await lottery.gamesCount;
  console.log("Game name is", status0.gameName);
  console.log("Game name is", status1.gameName);
  console.log("Got %s game", gameCount.length);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });