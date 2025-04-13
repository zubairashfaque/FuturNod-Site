import React, { useState } from "react";
import Header from "./header";
import Hero from "./hero";
import Services from "./services";
import Process from "./process";
import NodSection from "./nod-section";
import Team from "./team";
import Footer from "./footer";
import ContactModal from "./ContactModal";
import EnvVariablesNotice from "./EnvVariablesNotice";

function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />
      <Hero onContactClick={handleContactClick} />
      <div className="container mx-auto px-4 mt-4">
        <EnvVariablesNotice />
      </div>
      <Services />
      <Process onContactClick={handleContactClick} />
      <NodSection />
      <Team />
      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}

export default Home;
