"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string; // e.g., "1 month", "3 months"
}

export default function PackageManagement() {
  // Sample package data
  const [packages, setPackages] = useState<Package[]>([
    { id: "1", name: "Basic Plan", description: "Access to gym facilities", price: "$50", duration: "1 month" },
    { id: "2", name: "Standard Plan", description: "Gym + Group Classes", price: "$90", duration: "1 month" },
    { id: "3", name: "Premium Plan", description: "All-access + Personal Trainer", price: "$150", duration: "1 month" },
    { id: "4", name: "Basic 3 Months", description: "3 months access to gym", price: "$130", duration: "3 months" },
    { id: "5", name: "Standard 3 Months", description: "3 months Gym + Classes", price: "$240", duration: "3 months" },
  ]);

  const handleEdit = (id: string) => {
    console.log("Edit package", id);
    // Add your edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Delete package", id);
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  return (
    <div className="w-full h-[88vh] p-4">
      <div className="w-full h-full bg-white border rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">Package Management</h1>
          <Button className="bg-[#125BAC] cursor-pointer">Add Package</Button>
        </div>

        {/* Packages Grid */}
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="w-full h-[250px] border rounded-2xl p-4 text-center relative shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{pkg.name}</h3>
              <p className="text-sm mt-1">{pkg.description}</p>
              <p className="text-sm font-medium mt-2">{pkg.price}</p>
              <p className="text-sm text-gray-500">{pkg.duration}</p>

              {/* Edit Button */}
              <Button
                onClick={() => handleEdit(pkg.id)}
                className="absolute top-2 right-2 bg-[#125BAC] text-white p-2 rounded-full hover:bg-[#0d4793]"
              >
                Edit
              </Button>

              {/* Delete Button */}
              <Button
                onClick={() => handleDelete(pkg.id)}
                className="absolute bottom-2 right-2 bg-[#ac1212] text-white p-2 rounded-full hover:bg-[#7a0d0d]"
              >
                Delete
              </Button>
            </div>
          ))}

          {packages.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No packages available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
