const fs = require("fs");
const ethers = require("ethers");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }, { ethers }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/artifacts/Token-address.json";

    console.log("File is ", addressesFile);

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    } else {
      console.log("Found token address...");
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.Contract)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    } else {
      console.log("Token address is %s . Continue... ", address.Contract);
    }

    const token = await ethers.getContractAt("Token", address.Contract);
    const [sender] = await ethers.getSigners();

    const balanceSender = await token.balanceOf(sender.address);

    console.log(
      "Sender balance is %s address %s ",
      balanceSender,
      sender.address
    );

    const amount = ethers.utils.parseEther("1000000");
    const tx = await token.transfer(receiver, amount);
    await tx.wait();

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    const balanceReceiver = await token.balanceOf(receiver);
    console.log(
      "Receiver balance is %s address %s ",
      balanceReceiver,
      receiver
    );

    console.log(`Transferred 1 ETH and ${amount} tokens to ${receiver}`);
  });
