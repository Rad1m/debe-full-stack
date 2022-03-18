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

  describe.only("Create game", function () {
    it("Should return game status", async function () {
      // ARRANGE
      await lottery.createGame(
        1,
        "ArsenalVsBarcelona",
        "Emirates Stadium",
        "Arsenal",
        "Barcelona",
        "",
        0,
        0
      );
      // ACT
      await lottery.updateGame(0, "", 1);
      const status = await lottery.getGameStatus(0);

      // ASSERT
      expect(status.state).to.equal(1);
    });
  });

  describe("Enter lottery", function () {
    it("Should return staker info", async function () {
      // ARRANGE
      token.transfer(addr2.address, ethers.utils.parseEther("0.5"));
      console.log("Owner is %s", owner.address);
      console.log("Addr2 is %s", addr2.address);

      // ACT
      await token
        .connect(addr2)
        .approve(lottery.address, ethers.utils.parseEther("1000"));

      await lottery
        .connect(addr2)
        .enterLottery(
          "ARSENAL",
          token.address,
          ethers.utils.parseEther("0.05")
        );

      const staking = 0.05 * 0.95;
      const stakedAmount = await lottery.balances(addr2.address);

      // Assert
      // expect(stakedAmount.stakedAmount).to.equal(0); // there is 5% fee
      console.log("Staking %s", ethers.utils.parseEther(staking.toString()));
      console.log("Staked amount is %s", stakedAmount.stakedAmount);
      // expect(stakedAmount.betOnThis).to.equal("ARSENAL");
      expect(stakedAmount.stakedAmount).to.equal(
        ethers.utils.parseEther(staking.toString())
      );
    });
  });
});
