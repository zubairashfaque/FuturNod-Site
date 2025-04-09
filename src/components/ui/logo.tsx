import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="flex items-end">
          <span className="text-4xl font-bold">futur</span>
          <span className="relative inline-block w-4 h-4 bg-[#ff3131] rounded-full ml-1" />
        </div>
        <div className="absolute bottom-0 right-0 flex items-center">
          <div className="bg-black text-white px-3 py-1 rounded-xl flex items-center">
            <span className="text-lg font-light">nod</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
