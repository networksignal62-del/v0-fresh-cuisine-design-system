"use client"

import { categories } from "@/lib/products"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const handleCategoryClick = (categoryId: string) => {
    console.log("[v0] Category clicked:", categoryId)
    onCategoryChange(categoryId)
  }

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 text-sm md:text-base ${
            selectedCategory === category.id
              ? "bg-[#014325] text-white shadow-md"
              : "bg-white text-[#0f1419] border border-[#e5e7e8] hover:border-[#014325]"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
