import React from "react";
import Logo from "./ui/logo";
import { Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-16 px-4 md:px-8 lg:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Logo />
            <p className="mt-4 text-gray-600">
              Nodding to the Future with AI-powered solutions for modern
              businesses.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#services"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Chatbot Development
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Workflow Automation
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  AI Consulting
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#team"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Our Team
                </a>
              </li>
              <li>
                <a
                  href="/#process"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Process
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector('button[aria-label="Toggle menu"]')
                      ?.click();
                  }}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Futur Nod. All rights reserved.
          </p>

          <div className="flex space-x-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
