const { expect } = require("chai");
const { ethers } = require("hardhat");
const { web3 } = require("@nomiclabs/hardhat-web3");

describe("Betting Contract", function () {
  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.
  let Lottery;
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.deployed();

    Lottery = await ethers.getContractFactory("Lottery");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    lottery = await Lottery.deploy(token.address);
    await lottery.deployed();
  });

  let date = 1658680436;

  describe("Create game", function () {
    it("Should return game status", async function () {
      // ARRANGE
      await lottery.createGame(
        0,
        "Arsenal vs Barcelona",
        "Emirates Stadium",
        date,
        "Arsenal",
        "Barcelona",
        "",
        "",
        0,
        0
      );
      // ACT
      await lottery.updateGame(0, "Arsenal", "2:1", 3);
      const gameInfo = await lottery.games(0);

      console.log(
        "%s %s %s",
        gameInfo.homeTeam,
        gameInfo.result,
        gameInfo.awayTeam
      );
      console.log("Game is", gameInfo.state);

      // ASSERT
      expect(gameInfo.state).to.equal(3);
    });
  });

  describe("Enter lottery", function () {
    it("Should return staker info", async function () {
      // ARRANGE
      token.transfer(addr2.address, ethers.utils.parseEther("5"));
      console.log("Owner is %s", owner.address);
      console.log("Addr2 is %s", addr2.address);
      let date = 1658680436;

      await lottery.createGame(
        0,
        "Arsenal vs Barcelona",
        "Emirates Stadium",
        date,
        "Arsenal",
        "Barcelona",
        "",
        "",
        0,
        0
      );

      await lottery.createGame(
        1,
        "Aston Villa vs Burnley",
        "Villa Park",
        date,
        "Aston Villa",
        "Burnley",
        "",
        "",
        0,
        0
      );

      // ACT
      await token
        .connect(addr2)
        .approve(lottery.address, ethers.utils.parseEther("1000"));

      await lottery
        .connect(addr2)
        .enterLottery(
          0,
          "ARSENAL",
          token.address,
          ethers.utils.parseEther("0.05")
        );

      await lottery
        .connect(addr2)
        .enterLottery(
          1,
          "Burnley",
          token.address,
          ethers.utils.parseEther("1")
        );

      const staking = 0.05 * 0.95;
      const stakedAmount0 = await lottery.balances(0, addr2.address);
      const stakedAmount1 = await lottery.balances(1, addr2.address);

      // Assert
      console.log("Staking %s", ethers.utils.parseEther(staking.toString()));
      console.log("Staked 0 amount is %s", stakedAmount0.stakedAmount);
      console.log("Staked 1 amount is %s", stakedAmount1.stakedAmount);
    });
  });

  describe("Unstake amount", function () {
    it("Should return new balance", async function () {
      // ARRANGE
      token.transfer(addr1.address, ethers.utils.parseEther("500"));
      console.log("Owner is %s", owner.address);
      console.log("Addr1 is %s", addr1.address);
      let date = 1658680436;

      await lottery.createGame(
        0,
        "Arsenal vs Barcelona",
        "Emirates Stadium",
        date,
        "Arsenal",
        "Barcelona",
        "",
        "",
        0,
        0
      );

      await token
        .connect(addr1)
        .approve(lottery.address, ethers.utils.parseEther("1000"));

      await lottery
        .connect(addr1)
        .enterLottery(
          0,
          "ARSENAL",
          token.address,
          ethers.utils.parseEther("500")
        );

      // ACT
      const oldBalance = await token.balanceOf(addr1.address);
      await lottery
        .connect(addr1)
        .updateStakeBeforeStart(0, ethers.utils.parseEther("100"));
      const newBalance = await token.balanceOf(addr1.address);

      // ASSERT
      const staking = 375;
      const stakedAmount = await lottery.balances(0, addr1.address);
      console.log("Staking %s", ethers.utils.parseEther(staking.toString()));
      console.log("Staked amount is %s", stakedAmount.stakedAmount);
      console.log("Wallet Balance old %s", oldBalance);
      console.log("Wallet Balance new is %s", newBalance);
      expect(stakedAmount.stakedAmount).to.equal(
        ethers.utils.parseEther(staking.toString())
      );
    });
  });

  describe("Unstake amount higher than staked", function () {
    it("Should revert with error", async function () {
      // ARRANGE
      token.transfer(addr1.address, ethers.utils.parseEther("500"));
      let date = 1658680436;

      await lottery.createGame(
        0,
        "Arsenal vs Barcelona",
        "Emirates Stadium",
        date,
        "Arsenal",
        "Barcelona",
        "",
        "",
        0,
        0
      );

      await token
        .connect(addr1)
        .approve(lottery.address, ethers.utils.parseEther("1000"));

      await lottery
        .connect(addr1)
        .enterLottery(
          0,
          "ARSENAL",
          token.address,
          ethers.utils.parseEther("50")
        );

      // ACT
      console.log("This should revert with error");

      // ASSERT
      const stakedAmount = await lottery.balances(0, addr1.address);
      console.log("Staked amount is %s", stakedAmount.stakedAmount);
      await expect(
        lottery
          .connect(addr1)
          .updateStakeBeforeStart(0, ethers.utils.parseEther("55"))
      ).to.be.revertedWith("You try to unstake too much");
    });
  });

  describe("Unstake/Claim All", function () {
    it("Should unstake total amount of tokens", async function () {
      // ARRANGE
      token.transfer(addr1.address, ethers.utils.parseEther("1500"));
      let date = 1658680436;

      await lottery.createGame(
        0,
        "Arsenal vs Barcelona",
        "Emirates Stadium",
        date,
        "Arsenal",
        "Barcelona",
        "",
        "",
        0,
        0
      );

      await token
        .connect(addr1)
        .approve(lottery.address, ethers.utils.parseEther("1000"));

      await lottery
        .connect(addr1)
        .enterLottery(
          0,
          "ARSENAL",
          token.address,
          ethers.utils.parseEther("1000")
        );

      // ACT
      const oldBalance = await token.balanceOf(addr1.address);
      const stakedAmountBefore = await lottery.balances(0, addr1.address);
      await lottery.connect(owner).updateGame(0, "Arsenal", "2:1", 4);
      await lottery.connect(addr1).claimAll(0);
      const stakedAmountAfter = await lottery.balances(0, addr1.address);
      const newBalance = await token.balanceOf(addr1.address);

      // ASSERT
      console.log("Staked amount before %s", stakedAmountBefore.stakedAmount);
      console.log("Staked amount after %s", stakedAmountAfter.stakedAmount);
      console.log("Balance amount before %s", oldBalance);
      console.log("Balance amount after %s", newBalance);
      expect(stakedAmountAfter.stakedAmount).to.equal(0);
    });
  });
});
