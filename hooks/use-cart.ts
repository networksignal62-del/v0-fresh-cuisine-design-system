"use client"

import { useState, useEffect } from "react"
import type { CartItem, Product, AddOn } from "@/lib/types"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("fresh-cuisine-cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
        console.log("[v0] Cart loaded from localStorage")
      } catch (error) {
        console.error("[v0] Error loading cart:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on cart change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fresh-cuisine-cart", JSON.stringify(cart))
      console.log("[v0] Cart saved to localStorage, items:", cart.length)
    }
  }, [cart, isLoaded])

  const addToCart = (product: Product, quantity: number, selectedAddOns: AddOn[]) => {
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)
    const totalPrice = (product.price + addOnsTotal) * quantity

    const newItem: CartItem = {
      productId: product.id,
      product,
      quantity,
      selectedAddOns,
      totalPrice,
    }

    setCart((prevCart) => [...prevCart, newItem])

    console.log("[v0] Item added to cart:", {
      productId: product.id,
      productName: product.name,
      quantity,
      selectedAddOns: selectedAddOns.map((a) => a.name),
      totalPrice,
    })
  }

  const removeFromCart = (index: number) => {
    const item = cart[index]
    setCart((prevCart) => prevCart.filter((_, i) => i !== index))
    console.log("[v0] Item removed from cart:", item.product.name)
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return

    setCart((prevCart) => {
      const newCart = [...prevCart]
      const item = newCart[index]
      const addOnsTotal = item.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0)
      item.quantity = quantity
      item.totalPrice = (item.product.price + addOnsTotal) * quantity

      console.log("[v0] Quantity updated:", item.product.name, "new qty:", quantity)
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
    console.log("[v0] Cart cleared")
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
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
