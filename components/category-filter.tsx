"use client"

interface Category {
  id: string
  name: string
  display_order?: number
  is_active?: boolean
}

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories?: Category[]
}

// Default categories as fallback
const defaultCategories: Category[] = [
  { id: "all", name: "All Items", display_order: 0 },
  { id: "african", name: "African Dishes", display_order: 1 },
  { id: "bakery", name: "Bakery & Cakes", display_order: 2 },
  { id: "fast-food", name: "Burgers & Shawarma", display_order: 3 },
  { id: "drinks", name: "Drinks & Desserts", display_order: 4 },
]

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  categories,
}: CategoryFilterProps) {
  // Use provided categories or fallback to defaults
  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId)
  }

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {displayCategories.map((category) => (
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
