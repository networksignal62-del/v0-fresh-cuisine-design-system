"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("pees-bakery-wishlist")
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
        console.log("[v0] Wishlist loaded from localStorage")
      } catch (error) {
        console.error("[v0] Error loading wishlist:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on wishlist change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pees-bakery-wishlist", JSON.stringify(wishlist))
      console.log("[v0] Wishlist saved to localStorage, items:", wishlist.length)
    }
  }, [wishlist, isLoaded])

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      // Check if already in wishlist
      if (prevWishlist.some((item) => item.id === product.id)) {
        console.log("[v0] Product already in wishlist:", product.name)
        return prevWishlist
      }
      console.log("[v0] Product added to wishlist:", product.name)
      return [...prevWishlist, product]
    })
  }

  const removeFromWishlist = (productId: number) => {
    setWishlist((prevWishlist) => {
      const product = prevWishlist.find((item) => item.id === productId)
      console.log("[v0] Product removed from wishlist:", product?.name)
      return prevWishlist.filter((item) => item.id !== productId)
    })
  }

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId)
  }

  const getWishlistCount = () => {
    return wishlist.length
  }

  const clearWishlist = () => {
    setWishlist([])
    console.log("[v0] Wishlist cleared")
  }

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    isLoaded,
  }
}
