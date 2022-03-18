import React, { useMemo } from "react";
import { ethers } from "ethers";

export const useContract = ({ contractAddress, ABI }) => {
  return useMemo(() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return new Contract(contractAddress, ABI, signer);
    } catch (error) {
      console.error(error);
    }
  }, [contractAddress, ABI]);
};
