import React from "react";
import { Games } from "./games";

export default function Canvas() {
  let gameList = [];
  var i = 0;
  while (i < 6) {
    gameList.push(<Games key={i} id={i} />);
    i++;
    console.log("Generating game", i);
  }
  console.log("Canvas ready");

  return (
    <div class="mt-4">
      <div class="px-8 flex flex-wrap w-screen max-w-full gap-4 justify-between">
        {gameList}
      </div>
    </div>
  );
}
