"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import { products } from "@/lib/products"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    console.log("[v0] Page loaded: Menu")
    console.log("[v0] Menu page loaded with", products.length, "products")
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory))
    }
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-[#fffbf5]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#0f1419]">Our Menu</h1>

        {/* Category Filter - Sticky */}
        <div className="sticky top-16 md:top-18 bg-[#fffbf5] py-4 z-40 -mx-4 px-4 mb-8">
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#5c6466] text-lg">No products in this category</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
