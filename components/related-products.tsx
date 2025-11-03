import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface RelatedProductsProps {
  currentProduct: Product
  allProducts: Product[]
}

export function RelatedProducts({ currentProduct, allProducts }: RelatedProductsProps) {
  const relatedProducts = allProducts
    .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 5)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-[#fffbf5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#0f1419] mb-8">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
