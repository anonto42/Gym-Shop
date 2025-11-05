"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
}

export default function PersonalTrainingPage() {
  // Sample product data
  const [products, setProducts] = useState<Product[]>([
    { id: "1", title: "Product 1", description: "Awesome product 1", price: "$10" },
    { id: "2", title: "Product 2", description: "Awesome product 2", price: "$20" },
    { id: "3", title: "Product 3", description: "Awesome product 3", price: "$30" },
    { id: "4", title: "Product 4", description: "Awesome product 4", price: "$40" },
    { id: "5", title: "Product 5", description: "Awesome product 5", price: "$50" },
    { id: "6", title: "Product 6", description: "Awesome product 6", price: "$60" },
    { id: "1", title: "Product 1", description: "Awesome product 1", price: "$10" },
    { id: "2", title: "Product 2", description: "Awesome product 2", price: "$20" },
    { id: "3", title: "Product 3", description: "Awesome product 3", price: "$30" },
    { id: "4", title: "Product 4", description: "Awesome product 4", price: "$40" },
    { id: "5", title: "Product 5", description: "Awesome product 5", price: "$50" },
    { id: "6", title: "Product 6", description: "Awesome product 6", price: "$60" },
    { id: "1", title: "Product 1", description: "Awesome product 1", price: "$10" },
    { id: "2", title: "Product 2", description: "Awesome product 2", price: "$20" },
    { id: "3", title: "Product 3", description: "Awesome product 3", price: "$30" },
    { id: "4", title: "Product 4", description: "Awesome product 4", price: "$40" },
    { id: "5", title: "Product 5", description: "Awesome product 5", price: "$50" },
    { id: "6", title: "Product 6", description: "Awesome product 6", price: "$60" },
    { id: "1", title: "Product 1", description: "Awesome product 1", price: "$10" },
    { id: "2", title: "Product 2", description: "Awesome product 2", price: "$20" },
    { id: "3", title: "Product 3", description: "Awesome product 3", price: "$30" },
    { id: "4", title: "Product 4", description: "Awesome product 4", price: "$40" },
    { id: "5", title: "Product 5", description: "Awesome product 5", price: "$50" },
    { id: "6", title: "Product 6", description: "Awesome product 6", price: "$60" },
    { id: "1", title: "Product 1", description: "Awesome product 1", price: "$10" },
    { id: "2", title: "Product 2", description: "Awesome product 2", price: "$20" },
    { id: "3", title: "Product 3", description: "Awesome product 3", price: "$30" },
    { id: "4", title: "Product 4", description: "Awesome product 4", price: "$40" },
    { id: "5", title: "Product 5", description: "Awesome product 5", price: "$50" },
    { id: "6", title: "Product 6", description: "Awesome product 6", price: "$60" },
  ]);

  const handleEdit = (id: string) => {
    console.log("Edit product", id);
    // Add your edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Delete product", id);
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="w-full h-[88vh] p-4">
      <div className="w-full h-full bg-white border rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">Product Management</h1>
          <Button className="bg-[#125BAC] cursor-pointer">Add Product</Button>
        </div>

        {/* Products Grid */}
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full h-[250px] border rounded-2xl p-4 text-center relative shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{product.title}</h3>
              <p className="text-sm mt-1">{product.description}</p>
              <p className="text-sm font-medium mt-2">{product.price}</p>

              {/* Edit Button */}
              <Button
                onClick={() => handleEdit(product.id)}
                className="absolute top-2 right-2 bg-[#125BAC] text-white p-2 rounded-full hover:bg-[#0d4793]"
              >
                Edit
              </Button>

              {/* Delete Button */}
              <Button
                onClick={() => handleDelete(product.id)}
                className="absolute bottom-2 right-2 bg-[#ac1212] text-white p-2 rounded-full hover:bg-[#7a0d0d]"
              >
                Delete
              </Button>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No products available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
