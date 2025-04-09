import React from "react";
import { Card, CardContent } from "./ui/card";

interface TeamMember {
  name: string;
  title: string;
  skills: string;
  description: string;
  image: string;
}

const Team = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Omair Ashfaque",
      title: "AI & Automation Strategy Lead",
      skills:
        "AI-Driven Process Automation | Business Intelligence | Risk Modeling",
      description:
        "Omair specializes in AI-powered automation and data-driven strategy, helping businesses streamline workflows, optimize operations, and enhance decision-making. With experience in financial AI, business intelligence, and automation tools, he ensures that AI solutions deliver real-world efficiency and scalability.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    },
    {
      name: "Zubair A.",
      title: "AI & Machine Learning Architect",
      skills: "Generative AI | Intelligent Chatbots | Predictive Analytics",
      description:
        "Zubair is the architect of AI-powered automation, pioneer in Agentic AI models, specializing in chatbots, NLP models, and AI-driven decision-making tools. His experience in Large Language Models (LLMs), RAG-based assistants, and AI-powered customer support systems enables businesses to automate workflows and enhance customer interactions with AI-driven efficiency.",
      image:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80",
    },
    {
      name: "Farhan Mushtaq",
      title: "AI Strategy & Business Automation Advisor",
      skills:
        "AI Product Validation | Enterprise AI Solutions | Business Growth",
      description:
        "Farhan is a strategic AI leader with a Ph.D. in Data Science and extensive experience in enterprise AI deployment. He helps businesses scale AI-driven automation, ensuring that AI solutions are practical, efficient, and deliver measurable results. His expertise in AI validation and workflow automation ensures that organizations maximize efficiency and reduce operational bottlenecks.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      name: "Ozair A.",
      title: "Software & Automation Infrastructure Lead",
      skills:
        "Full-Stack Development | AI Workflow Integration | Cybersecurity",
      description:
        "Ozair ensures the seamless integration of AI into business processes, focusing on secure, scalable software solutions. With expertise in full-stack development, cloud infrastructure, and AI-driven automation, he builds platforms that optimize business workflows, enhance security, and drive efficiency through intelligent automation.",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
    },
  ];

  return (
    <section id="team" className="w-full py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Streamline your business processes with AI-powered automation. Meet
            the experts behind Futurnod.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="border border-gray-100 rounded-lg overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover aspect-square"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-gray-800 font-medium mb-2">
                      {member.title}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {member.skills}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
