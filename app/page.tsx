"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import { products } from "@/lib/products"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    console.log("[v0] Page loaded: Home")
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory))
    }
    console.log("[v0] Products filtered by category:", selectedCategory)
  }, [selectedCategory])

  const featuredProducts = products.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-[#fffbf5]">
      <Header />

      <main>
        <section className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-b from-[#014325] to-[#014325]/80">
          <div className="absolute inset-0">
            <Image
              src="/images/design-mode/v0_image-2.png"
              alt="Pee's Bakery & Restaurant"
              fill
              className="object-cover opacity-45"
              priority
            />
          </div>

          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-balance px-4 text-white text-3xl">
              Welcome to Pee's Bakery & Restaurant
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-6 md:mb-8 text-pretty leading-relaxed px-4 bg-chart-5 rounded-sm">
              Your Home of Authentic African Dishes, Fresh Pastries, and Fast Food Delights in Freetown. Taste the
              culture, enjoy the comfort, and order your favorite meals with ease.
            </p>

            {/* Featured Dishes Grid */}
            <div className="hidden sm:grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mt-4 md:mt-8 w-full max-w-4xl px-4">
              {featuredProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 hover:bg-white/20 transition-colors"
                >
                  <div className="relative aspect-square mb-1 md:mb-2 rounded-md overflow-hidden">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-center line-clamp-1">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#0f1419]">Shop by Category</h2>
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 pb-12 md:pb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#0f1419]">
            {selectedCategory === "all"
              ? "All Products"
              : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
          </h2>

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
        </section>
      </main>

      <Footer />
    </div>
  )
}
