#!/usr/bin/env node

/**
 * Add Products with Premium Images - Nardos Perfume Store
 * Usage: node addProductsWithImages.js
 */

const axios = require('axios');

// Admin Token (Replace with your actual token)
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTgyYjk1ODcxZGY3OGMyZWNjNmFjZWEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODY5NTIwMzAsImV4cCI6MTc4NzU1NjgzMH0.lz00CocdKq-Yy_VPl4hn6Yf9XJXbTZHCmIR3k_E4I_w";
const BASE_URL = "http://localhost:5000/api";

// Headers with authentication
const headers = {
  Authorization: `Bearer ${ADMIN_TOKEN}`,
  "Content-Type": "application/json",
};

// Premium Products with Real Images
const premiumProducts = [
  {
    name: "Lavender Dream",
    brand: "Nardos Essence",
    category: "Women",
    description: "Soothing lavender with floral notes",
    price: 79.99,
    stock: 85,
    image: "https://images.unsplash.com/photo-1555621458-ab7a9edac809?w=500&h=500&fit=crop",
  },
  {
    name: "Sandalwood Serenity",
    brand: "Nardos Woods",
    category: "Men",
    description: "Warm sandalwood and cedarwood blend",
    price: 94.99,
    stock: 60,
    image: "https://images.unsplash.com/photo-1600256621198-dff89f6b8e4f?w=500&h=500&fit=crop",
  },
  {
    name: "Jasmine Paradise",
    brand: "Nardos Floral",
    category: "Women",
    description: "Enchanting jasmine with vanilla undertones",
    price: 89.99,
    stock: 90,
    image: "https://images.unsplash.com/photo-1562181286-d3fee0d55364?w=500&h=500&fit=crop",
  },
  {
    name: "Citrus Burst",
    brand: "Nardos Fresh",
    category: "Unisex",
    description: "Energizing citrus and bergamot",
    price: 64.99,
    stock: 120,
    image: "https://images.unsplash.com/photo-1587299789398-f92b1d6d9b9d?w=500&h=500&fit=crop",
  },
  {
    name: "Amber Nights",
    brand: "Nardos Luxury",
    category: "Luxury / Men",
    description: "Rich amber with woody spices",
    price: 199.99,
    stock: 40,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
  },
  {
    name: "Oriental Elegance",
    brand: "Nardos Luxury",
    category: "Luxury / Women",
    description: "Luxurious oriental and musk blend",
    price: 229.99,
    stock: 35,
    image: "https://images.unsplash.com/photo-1610506850712-30f5b5f3a803?w=500&h=500&fit=crop",
  },
  {
    name: "Patchouli Mystery",
    brand: "Nardos Exotic",
    category: "Unisex",
    description: "Deep patchouli with spicy notes",
    price: 109.99,
    stock: 55,
    image: "https://images.unsplash.com/photo-1597318159211-d8c2911e2b1e?w=500&h=500&fit=crop",
  },
  {
    name: "Rose Harmony",
    brand: "Nardos Floral",
    category: "Women",
    description: "Delicate rose with soft musk",
    price: 84.99,
    stock: 100,
    image: "https://images.unsplash.com/photo-1523293182986-7651a8ad5003?w=500&h=500&fit=crop",
  },
];

async function addProduct(product) {
  try {
    const response = await axios.post(`${BASE_URL}/products`, product, { headers });
    console.log(`✅ Added: ${product.name} - ${product.brand}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to add ${product.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function addAllProducts() {
  console.log("\n🎨 Adding Premium Products with Images...\n");
  
  let successCount = 0;
  
  for (const product of premiumProducts) {
    const result = await addProduct(product);
    if (result) {
      successCount++;
    }
    // Add slight delay between requests
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n✨ Complete! Added ${successCount}/${premiumProducts.length} products\n`);
}

// Run the script
addAllProducts().catch(error => {
  console.error("Error:", error.message);
  process.exit(1);
});
