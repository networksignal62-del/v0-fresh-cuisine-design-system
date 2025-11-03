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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
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
