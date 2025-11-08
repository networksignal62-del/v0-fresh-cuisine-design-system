"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/utils-app"
import { Star, Plus, Minus, Heart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { FlyingCartAnimation } from "@/components/flying-cart-animation"
import { CartModal } from "@/components/cart-modal"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0)
  const [flyingAnimation, setFlyingAnimation] = useState(false)
  const [animationStart, setAnimationStart] = useState({ x: 0, y: 0 })
  const [showCartModal, setShowCartModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const isFavorite = isInWishlist(product.id)

  const handleClick = () => {
    console.log("[v0] Product card clicked:", product.id, product.name)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
    console.log("[v0] Wishlist toggled for:", product.name, "isFavorite:", !isFavorite)

    toast({
      title: isFavorite ? "Removed from Wishlist" : "Added to Wishlist ❤️",
      description: `${product.name}`,
      duration: 3000,
    })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setAnimationStart({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
      setFlyingAnimation(true)
    }

    addToCart(product, quantity, [])
    console.log("[v0] Add to cart from product card:", product.name, "qty:", quantity)

    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} x${quantity} - ${formatPrice(product.price * quantity)}`,
      duration: 3000,
    })

    setShowCartModal(true)
    setQuantity(0)
  }

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.preventDefault()
    e.stopPropagation()

    const newQuantity = Math.max(0, quantity + delta)
    setQuantity(newQuantity)

    if (newQuantity === 0) {
      console.log("[v0] Quantity reset to 0")
    } else {
      console.log("[v0] Quantity updated:", newQuantity)
    }
  }

  return (
    <>
      <FlyingCartAnimation
        trigger={flyingAnimation}
        startPosition={animationStart}
        onComplete={() => setFlyingAnimation(false)}
      />

      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />

      <Link href={`/product/${product.id}`} onClick={handleClick}>
        <div
          className="bg-white border border-[#e5e7e8] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_24px_rgba(1,67,37,0.15)] hover:-translate-y-2 hover:scale-[1.03] cursor-pointer flex flex-col h-full group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-[#f5f5f0]">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-95"
            />
            {/* Animated gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#014325]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Price Badge */}
            <span className="absolute top-3 right-3 bg-[#ffb40b] text-[#0f1419] text-sm font-bold px-3 py-1.5 rounded-full shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              {formatPrice(product.price)}
            </span>

            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-md hover:scale-125 hover:rotate-12 active:scale-95"
              aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${isFavorite ? "fill-[#dc2626] text-[#dc2626] animate-[scale-in_0.3s_ease-out]" : "text-[#5c6466]"}`}
              />
            </button>

            {/* "NEW" badge for featured items */}
            {product.featured && (
              <span className="absolute bottom-3 left-3 bg-[#014325] text-white text-xs font-bold px-2 py-1 rounded-md shadow-md animate-pulse">
                FEATURED
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Slide animation to title on hover */}
            <h3 className="font-bold text-lg text-[#0f1419] line-clamp-1 mb-1 transition-all duration-300 group-hover:text-[#014325]">
              {product.name}
            </h3>

            <p className="text-sm text-[#5c6466] capitalize mb-2 transition-colors duration-300 group-hover:text-[#014325]">
              {product.category}
            </p>

            <p className="text-sm text-[#5c6466] line-clamp-2 leading-relaxed mb-3 flex-1 transition-all duration-300">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-4">
                {/* Rotation animation to star on hover */}
                <Star className="w-4 h-4 fill-[#ffb40b] text-[#ffb40b] transition-transform duration-300 group-hover:rotate-[360deg]" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-[#5c6466]">({product.reviewCount})</span>
              </div>
            )}

            {quantity === 0 ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setQuantity(1)
                  console.log("[v0] Add button clicked for:", product.name)
                }}
                className="w-full bg-[#f5f5f0] hover:bg-[#ffb40b]/20 text-[#0f1419] py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium border border-[#e5e7e8] hover:border-[#ffb40b] hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-between bg-[#fffbf5] border-2 border-[#ffb40b] p-2 rounded-lg animate-[scale-in_0.2s_ease-out]">
                <button
                  onClick={(e) => handleQuantityChange(e, -1)}
                  className="text-[#014325] hover:bg-[#ffb40b]/20 p-1.5 rounded transition-all duration-200 hover:scale-110 active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold text-[#014325] text-lg min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={(e) => handleQuantityChange(e, 1)}
                  className="text-[#014325] hover:bg-[#ffb40b]/20 p-1.5 rounded transition-all duration-200 hover:scale-110 active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}

            {quantity > 0 && (
              <button
                ref={buttonRef}
                onClick={handleAddToCart}
                className="w-full bg-[#ffb40b] hover:bg-[#ffb40b]/90 text-[#0f1419] py-2.5 rounded-lg transition-all duration-300 font-bold mt-2 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </Link>
    </>
  )
}
