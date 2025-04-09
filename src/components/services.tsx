import React from "react";
import { Bot, MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const Services = () => {
  const services = [
    {
      icon: <Bot className="h-12 w-12" />,
      title: "Chatbot Development",
      description:
        "Custom AI chatbots that engage your customers 24/7 with natural conversation.",
    },
    {
      icon: <MessageSquare className="h-12 w-12" />,
      title: "Workflow Automation",
      description:
        "Streamline your business processes with intelligent automation solutions.",
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Individual Consulting",
      description:
        "Expert guidance to help you navigate the AI transformation journey.",
    },
  ];

  return (
    <section id="services" className="w-full py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600">
            We provide cutting-edge AI solutions tailored to your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-8">
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
