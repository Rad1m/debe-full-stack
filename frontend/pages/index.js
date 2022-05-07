import React from "react";
import Topbar from "./topbar";
import Canvas from "./canvas";
import Modal from "../pages/components/modal";

export default function Home() {
  return (
    <div className="bg-slate-800 text-slate-50 flex-1 min-h-screen">
      <Topbar />
      <Canvas />
      <Modal />
    </div>
  );
}
