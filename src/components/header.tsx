import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import Logo from "./ui/logo";

interface HeaderProps {
  onContactClick: () => void;
}

const Header = ({ onContactClick = () => {} }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`w-full py-4 px-4 md:px-8 lg:px-12 flex justify-between items-center border-b border-gray-100 ${isScrolled ? "fixed top-0 left-0 right-0 bg-white z-50 shadow-sm" : ""}`}
    >
      <Logo />
      <div className="flex items-center space-x-8">
        <nav className="hidden md:flex space-x-8">
          <a
            href="#services"
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            Services
          </a>
          <a
            href="#process"
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            Process
          </a>
          <a
            href="#team"
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            Team
          </a>
          <a
            href="/blog"
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            Blog
          </a>
        </nav>
        <Button
          onClick={onContactClick}
          className="bg-red-500 hover:bg-red-600 text-white rounded-md px-6 py-2 text-base"
        >
          Let's talk
        </Button>
      </div>
    </header>
  );
};

export default Header;
