// We import Chai to use its asserting functions here.
const { expect } = require("chai");

describe("Token contract", function () {
  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let ownerBalance;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    token = await Token.deploy();
    await token.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Mint and Burn", function () {
    it("Should mint tokens", async function () {
      const mintAmount = 5000;
      console.log(
        "Total supply before mint is: ",
        (await token.totalSupply()).toString()
      );
      await token.mint(addr1.address, mintAmount);
      const addr1Balance = await token.balanceOf(addr1.address);
      console.log("Balance after mint: ", addr1Balance.toString());
      console.log(
        "Total supply after mint is: ",
        (await token.totalSupply()).toString()
      );
      const totSup = await token.totalSupply();
      expect(addr1Balance).to.equal(mintAmount);
    });

    it("Should BURN! tokens", async function () {
      let burnAmount = 1000;
      const ownerBalanceBeforeBurn = await token.balanceOf(owner.address);
      console.log("Balance before burn: ", ownerBalanceBeforeBurn.toString());
      await token.burn(burnAmount);
      const ownerBalanceAftrBurn = await token.balanceOf(owner.address);
      console.log("Balance after burn: ", ownerBalanceAftrBurn.toString());
      expect(ownerBalanceAftrBurn).to.below(ownerBalanceBeforeBurn);
    });

    it("Should BURN FROM! tokens", async function () {
      const burnAmount = 500;
      const mintAmount = 5000;
      const burnAddress = owner.address;
      await token.mint(burnAddress, mintAmount);
      const addr1BalanceBeforeBurn = await token.balanceOf(burnAddress);
      console.log(
        "Balance addr1 before burn: ",
        addr1BalanceBeforeBurn.toString()
      );
      console.log("Burn amount: ", burnAmount.toString());
      await token.approve(burnAddress, burnAmount);
      await token.burnFrom(burnAddress, burnAmount);
      const addr1BalanceAfterBurn = await token.balanceOf(burnAddress);
      console.log("Balance after burn: ", addr1BalanceAfterBurn.toString());
      expect(addr1BalanceAfterBurn).to.below(addr1BalanceBeforeBurn);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await token.transfer(addr1.address, 50);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await token.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
