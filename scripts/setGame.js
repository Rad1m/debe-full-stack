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
    "Arsenal vs Barcelona",
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
    1,
    ethers.utils.parseEther("5000")
  );

  await tx1.wait();

  const tx2 = await lottery.createGame(
    2,
    "Newcastle vs Wolves",
    "St. James' Park",
    "Newcastle",
    "Wolves",
    "",
    "",
    2,
    ethers.utils.parseEther("1500")
  );

  await tx2.wait();

  const tx3 = await lottery.createGame(
    3,
    "Everton vs Man United",
    "Goodison Park",
    "Everton",
    "Man United",
    "Everton",
    "2:3",
    3,
    ethers.utils.parseEther("4500")
  );

  await tx3.wait();

  const tx4 = await lottery.createGame(
    4,
    "Southampton vs Chelsea",
    "St. Mary's Stadium",
    "Southampton",
    "Chelsea",
    "",
    "",
    4,
    ethers.utils.parseEther("9500")
  );

  await tx4.wait();

  const tx5 = await lottery.createGame(
    5,
    "Norwich vs Burnley",
    "Carrow Road",
    "Norwich",
    "Burnley",
    "",
    "",
    5,
    ethers.utils.parseEther("10000")
  );

  await tx5.wait();

  const status0 = await lottery.games(0);
  const status1 = await lottery.games(1);
  const status2 = await lottery.games(2);
  const status3 = await lottery.games(3);
  const status4 = await lottery.games(4);
  const status5 = await lottery.games(5);
  console.log("Game name is", status0.gameName);
  console.log("Game name is", status1.gameName);
  console.log("Game name is", status2.gameName);
  console.log("Game name is", status3.gameName);
  console.log("Game name is", status4.gameName);
  console.log("Game name is", status5.gameName);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
