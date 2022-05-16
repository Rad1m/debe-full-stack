import React from "react";
import Topbar from "./components/topbar";
import Canvas from "./canvas";
import Modal from "./components/modal";

export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 text-slate-50 flex-1 w-screen min-h-screen">
      <Topbar />
      <Canvas />
      <Modal />
    </div>
  );
}
