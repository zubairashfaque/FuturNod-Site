import React from "react";
import { Button } from "./ui/button";

interface ProcessProps {
  onContactClick: () => void;
}

const Process = ({ onContactClick = () => {} }: ProcessProps) => {
  const steps = [
    {
      number: "1",
      title: "Intro Call",
      description:
        "Schedule a call to explore our compatibility and discuss how our services can enhance your business. We aim to learn about your current operations and identify ways to add value.",
    },
    {
      number: "2",
      title: "Strategy",
      description:
        "After understanding your needs, we'll set up a follow-up call to present our proposal. This will cover the expected deliverables, implementation strategy, timelines and pricing details.",
    },
    {
      number: "3",
      title: "Implementation",
      description:
        "After receiving your go-ahead, our team will start the process, ensuring you're updated throughout and maintaining close collaboration via our Slack channel.",
    },
  ];

  return (
    <section id="process" className="w-full py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
          <p className="text-xl">
            We keep it simple. One quick call, we understand your needs and get
            started. Ready? Book your intro call now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 font-medium">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Button
            onClick={onContactClick}
            className="bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Book a call
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Process;
