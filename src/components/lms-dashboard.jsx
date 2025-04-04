"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Home,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

import { Button } from "../../src/components/ui/button";
import { cn } from "../lib/utils";
import { UserButton } from "@clerk/nextjs";


export function LmsDashboard() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-800 text-white transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Learning Destiny </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex-1">
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          {/* <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
          >
            <Book className="mr-2 h-4 w-4" />
            Explore Courses
          </Link> */}
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            My Courses
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-10 top-4 hidden lg:flex"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-6 w-6" />
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </Button>
      </aside>
      <main
        className={cn(
          "flex-1 overflow-auto p-4 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <UserButton />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
        </div>
      </main>
    </div>
  );
}
