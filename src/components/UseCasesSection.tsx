import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface UseCase {
  id: string;
  title: string;
  description: string;
  image: string;
  industry: string;
  solutionType: string;
  link: string;
}

const UseCasesSection = () => {
  // Mock data for use cases
  const defaultUseCases: UseCase[] = [
    {
      id: "1",
      title: "AI-Powered Customer Service Automation",
      description:
        "How a leading e-commerce platform reduced support costs by 40% while improving customer satisfaction scores.",
      image:
        "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&q=80",
      industry: "E-commerce",
      solutionType: "AI & Automation",
      link: "/use-cases/ai-customer-service",
    },
    {
      id: "2",
      title: "Blockchain Supply Chain Tracking",
      description:
        "Implementing transparent and secure supply chain tracking for a global manufacturing company.",
      image:
        "https://images.unsplash.com/photo-1566661614419-e7d4e356d5f9?w=800&q=80",
      industry: "Manufacturing",
      solutionType: "Blockchain",
      link: "/use-cases/blockchain-supply-chain",
    },
    {
      id: "3",
      title: "Data-Driven Healthcare Optimization",
      description:
        "How a healthcare provider leveraged big data analytics to improve patient outcomes and operational efficiency.",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      industry: "Healthcare",
      solutionType: "Data Analytics",
      link: "/use-cases/healthcare-data-analytics",
    },
    {
      id: "4",
      title: "Smart City Infrastructure Management",
      description:
        "Developing IoT solutions for urban infrastructure monitoring and management.",
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
      industry: "Government",
      solutionType: "IoT",
      link: "/use-cases/smart-city-infrastructure",
    },
    {
      id: "5",
      title: "Fintech Payment Processing Platform",
      description:
        "Building a secure, scalable payment processing solution for a fintech startup.",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      industry: "Finance",
      solutionType: "Fintech",
      link: "/use-cases/fintech-payment-platform",
    },
    {
      id: "6",
      title: "AR/VR Training Simulation",
      description:
        "Creating immersive training experiences for industrial workers using augmented and virtual reality.",
      image:
        "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
      industry: "Education",
      solutionType: "AR/VR",
      link: "/use-cases/ar-vr-training",
    },
  ];

  const [useCases, setUseCases] = useState<UseCase[]>(defaultUseCases);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // All unique industries and solution types for filtering
  const industries = Array.from(
    new Set(defaultUseCases.map((useCase) => useCase.industry)),
  );
  const solutionTypes = Array.from(
    new Set(defaultUseCases.map((useCase) => useCase.solutionType)),
  );

  // Filter use cases based on search term and active tab
  const filterUseCases = () => {
    let filtered = defaultUseCases;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (useCase) =>
          useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          useCase.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          useCase.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          useCase.solutionType.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by tab
    if (activeTab !== "all") {
      if (industries.includes(activeTab)) {
        filtered = filtered.filter((useCase) => useCase.industry === activeTab);
      } else if (solutionTypes.includes(activeTab)) {
        filtered = filtered.filter(
          (useCase) => useCase.solutionType === activeTab,
        );
      }
    }

    setUseCases(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterUseCases();
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterUseCases();
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="w-full bg-background py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Use Cases
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover how our solutions have transformed businesses across
            industries with innovative technology implementations.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search use cases..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
        </div>

        {/* Tabs for filtering */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={handleTabChange}
          className="mb-10"
        >
          <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
            <TabsTrigger value="all" className="rounded-full">
              All
            </TabsTrigger>

            {/* Industry tabs */}
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <TabsTrigger
                  key={industry}
                  value={industry}
                  className="rounded-full"
                >
                  {industry}
                </TabsTrigger>
              ))}
            </div>

            {/* Solution type tabs */}
            <div className="flex flex-wrap gap-2">
              {solutionTypes.map((solutionType) => (
                <TabsTrigger
                  key={solutionType}
                  value={solutionType}
                  className="rounded-full"
                >
                  {solutionType}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {useCases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={useCase.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={useCase.image}
                          alt={useCase.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {useCase.industry}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-secondary/10 text-secondary hover:bg-secondary/20"
                          >
                            {useCase.solutionType}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">
                          {useCase.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {useCase.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        {/* Additional content can go here */}
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="ghost"
                          className="w-full justify-between group"
                          asChild
                        >
                          <a href={useCase.link}>
                            <span>View Case Study</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No use cases found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                    setUseCases(defaultUseCases);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-blue-600/10 p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">
            Have a similar project in mind?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let's discuss how our expertise can help transform your business
            with innovative technology solutions.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Let's Talk
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
