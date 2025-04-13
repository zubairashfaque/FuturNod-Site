import React, { useState, useEffect } from "react";
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
import { getUseCases } from "../api/usecases";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";

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
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [defaultUseCases, setDefaultUseCases] = useState<UseCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  // Fetch use cases from the database
  useEffect(() => {
    const fetchUseCases = async () => {
      setIsLoading(true);
      try {
        const useCasesData = await getUseCases();

        // Map the data to match our component's expected format
        const formattedUseCases = useCasesData.map((useCase) => ({
          id: useCase.id,
          title: useCase.title,
          description: useCase.description,
          image: useCase.imageUrl,
          industry: useCase.industry,
          solutionType: useCase.category,
          link: `/use-cases/${useCase.id}`,
        }));

        setDefaultUseCases(formattedUseCases);
        setUseCases(formattedUseCases);
      } catch (err) {
        console.error("Error fetching use cases:", err);
        setError("Failed to load use cases. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUseCases();
  }, []);

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
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} isOnBlogPage={false} />
      <section className="w-full bg-background py-16 px-4 md:px-8 lg:px-12 pt-32">
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

          {/* Loading and Error States */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading use cases...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

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
            <TabsList className="flex flex-wrap justify-start gap-2 mb-6 bg-white">
              <TabsTrigger
                value="all"
                className="rounded-full bg-white text-foreground data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                All
              </TabsTrigger>

              {/* Industry tabs */}
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <TabsTrigger
                    key={industry}
                    value={industry}
                    className="rounded-full bg-white text-foreground data-[state=active]:bg-primary data-[state=active]:text-white"
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
                    className="rounded-full bg-white text-foreground data-[state=active]:bg-primary data-[state=active]:text-white"
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
                              className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20"
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
              onClick={handleContactClick}
            >
              Let's Talk
            </Button>
          </div>
        </div>
      </section>
      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default UseCasesSection;
