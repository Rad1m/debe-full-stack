import React from "react";

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
