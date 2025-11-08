"use client"

import { useState, useEffect } from "react"
import type { CartItem, Product, AddOn, ProductVariant } from "@/lib/types"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem("fresh-cuisine-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
        console.log("[v0] Cart loaded from localStorage, items:", parsedCart.length)
      } catch (error) {
        console.error("[v0] Error loading cart:", error)
        setCart([])
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fresh-cuisine-cart", JSON.stringify(cart))
      console.log("[v0] Cart saved to localStorage, items:", cart.length)
    }
  }, [cart, isLoaded])

  const addToCart = (
    product: Product,
    quantity: number,
    selectedAddOns: AddOn[],
    selectedVariant?: ProductVariant | null,
  ) => {
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)
    const basePrice = selectedVariant ? selectedVariant.price : product.price
    const totalPrice = (basePrice + addOnsTotal) * quantity

    const newItem: CartItem = {
      productId: product.id,
      product,
      quantity,
      selectedAddOns,
      totalPrice,
      selectedVariant: selectedVariant || undefined,
    }

    setCart((prevCart) => {
      const updatedCart = [...prevCart, newItem]
      console.log("[v0] Item added to cart:", {
        productId: product.id,
        productName: product.name,
        quantity,
        selectedAddOns: selectedAddOns.map((a) => a.name),
        totalPrice,
        newCartLength: updatedCart.length,
      })
      return updatedCart
    })
  }

  const removeFromCart = (index: number) => {
    setCart((prevCart) => {
      const item = prevCart[index]
      const newCart = prevCart.filter((_, i) => i !== index)
      console.log("[v0] Item removed from cart:", item.product.name, "remaining items:", newCart.length)
      return newCart
    })
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return

    setCart((prevCart) => {
      const newCart = [...prevCart]
      const item = newCart[index]
      const basePrice = item.selectedVariant ? item.selectedVariant.price : item.product.price
      const addOnsTotal = item.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)
      item.quantity = quantity
      item.totalPrice = (basePrice + addOnsTotal) * quantity

      console.log("[v0] Quantity updated:", item.product.name, "new qty:", quantity, "new total:", item.totalPrice)
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
    console.log("[v0] Cart cleared")
  }

  const getCartTotal = () => {
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0)
    return total
  }

  const getItemCount = () => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    return count
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    isLoaded,
  }
}
