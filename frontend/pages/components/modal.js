import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { modalInfo } from "../atoms/atoms";

const Modal = () => {
  const [showModal, setShowModal] = useRecoilState(modalInfo);

  return (
    <>
      {showModal.open ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-300 outline-none focus:outline-none ">
                {/*header*/}
                <div className="flex p-4 border-b border-solid border-slate-400 rounded-t text-center justify-center items-center">
                  <p className="text-3xl font-semibold text-slate-700">
                    {showModal.header}
                  </p>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-700 text-lg leading-relaxed">
                    {showModal.body}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-4 border-t border-solid border-slate-400 rounded-b">
                  <button
                    className="bg-red-400 text-slate-700 active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:bg-red-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>
                      setShowModal((prevState) => ({
                        ...prevState,
                        open: false,
                      }))
                    }
                  >
                    {showModal.button}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
