import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { getUseCaseById } from "../api/usecases";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";

interface UseCase {
  id: string;
  title: string;
  description: string;
  content: string;
  industry: string;
  category: string;
  imageUrl: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

const UseCaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchUseCase = async () => {
      if (!id) {
        setError("Use case ID not found");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUseCaseById(id);
        if (data) {
          setUseCase(data);
        } else {
          setError("Use case not found");
        }
      } catch (err) {
        console.error("Error fetching use case:", err);
        setError("Failed to load use case. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUseCase();
  }, [id]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !useCase) {
    return (
      <div className="min-h-screen bg-white">
        <Header onContactClick={handleContactClick} />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">
            {error || "Use case not found"}
          </h1>
          <p className="mb-8 text-gray-600">
            We couldn't find the use case you're looking for.
          </p>
          <Button onClick={() => navigate("/usecases")}>
            Back to Use Cases
          </Button>
        </div>
        <Footer />
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />

      <main className="container mx-auto px-4 py-32">
        <Button
          variant="ghost"
          className="mb-8 flex items-center gap-2"
          onClick={() => navigate("/usecases")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Use Cases
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <span className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                {useCase.industry}
              </span>
              <span className="inline-block px-3 py-1 text-sm bg-secondary/10 text-secondary rounded-full">
                {useCase.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {useCase.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8">{useCase.description}</p>
          </div>

          {useCase.imageUrl && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <img
                src={useCase.imageUrl}
                alt={useCase.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {useCase.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16 p-8 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">
              Interested in this solution?
            </h2>
            <p className="mb-6">
              Contact us to learn more about how we can implement a similar
              solution for your business.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={handleContactClick}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default UseCaseDetail;
