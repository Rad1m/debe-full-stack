import React from "react";
import { ethers } from "ethers";

// helper utilities
export function ellipseAddress(addressToSlide, width) {
  if (addressToSlide) {
    addressToSlide = addressToSlide.toString();
    const concatAddress =
      addressToSlide.slice(0, width) + "..." + addressToSlide.slice(-width);
    return concatAddress;
  } else {
    return "ERROR: No input value";
  }
}

export const useContract = (address, abi) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    return contract;
  } catch (e) {
    console.log(e);
    return false;
  }
};
