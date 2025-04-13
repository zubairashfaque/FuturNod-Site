import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const BlogHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="container mx-auto px-4 py-8 border-b mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Futurnod Blog</h1>
      </div>

      <Tabs defaultValue={currentPath} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger
            value="/blog"
            onClick={() => navigate("/blog")}
            className={
              currentPath === "/blog" ? "border-b-2 border-primary" : ""
            }
          >
            Featured
          </TabsTrigger>
          <TabsTrigger
            value="/blog/list"
            onClick={() => navigate("/blog/list")}
            className={
              currentPath === "/blog/list" ? "border-b-2 border-primary" : ""
            }
          >
            All Posts
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BlogHeader;
