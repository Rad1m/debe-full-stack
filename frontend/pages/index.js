import React from "react";
import Topbar from "./components/topbar";
import Canvas from "./canvas";
import Modal from "./components/modal";

export default function Home() {
  return (
    <div className="bg-slate-800 text-slate-50 flex-1 w-screen min-h-screen">
      <Topbar />
      <Canvas />
      <Modal />
    </div>
  );
}
