import React from "react";

export const ScreenLoader = () => {
  return (
    <div className="min-h-screen w-full bg-[#03000D] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
