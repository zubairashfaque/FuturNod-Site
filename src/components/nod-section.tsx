import React from "react";

const NodSection = () => {
  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-3xl font-bold">Nod</h3>
            <span className="text-xl">- Conversational AI</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Meet Nod: The Conversational AI That Knows Your Business
          </h2>
        </div>

        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&q=80"
            alt="Customer service representative"
            className="rounded-lg max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default NodSection;
