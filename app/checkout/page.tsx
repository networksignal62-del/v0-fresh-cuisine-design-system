"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { formatPrice, generateOrderReference, calculateEstimatedDelivery, sendSMSReceipt } from "@/lib/utils-app"
import type { Order, Customer, DeliveryAddress } from "@/lib/types"
import { OrderConfirmationModal } from "@/components/order-confirmation-modal"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Form state
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
  })

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: "",
    city: "",
    zipCode: "",
    instructions: "",
  })

  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express" | "pickup">("standard")
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "orange-money" | "vault" | "afrimoney">("cod")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("[v0] Page loaded: Checkout")

    if (mounted && cart.length === 0 && !showConfirmation) {
      console.log("[v0] Cart is empty, redirecting to cart page")
      router.push("/cart")
    }
  }, [cart.length, mounted, showConfirmation, router])

  const deliveryFees = {
    standard: 10000,
    express: 25000,
    pickup: 0,
  }

  const subtotal = getCartTotal()
  const deliveryFee = deliveryFees[deliveryOption]
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + tax

  useEffect(() => {
    console.log("[v0] Order total calculated:", {
      subtotal,
      deliveryFee,
      tax,
      discount: 0,
      grandTotal: total,
    })
  }, [subtotal, deliveryFee, tax, total])

  const handleDeliveryOptionChange = (option: typeof deliveryOption) => {
    setDeliveryOption(option)
    console.log("[v0] Delivery option selected:", option)
  }

  const handlePaymentMethodChange = (method: typeof paymentMethod) => {
    setPaymentMethod(method)
    console.log("[v0] Payment method selected:", method)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Place order clicked")
    console.log("[v0] Delivery info entered:", { customer, deliveryAddress })

    setIsProcessing(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const order: Order = {
      id: generateOrderReference(),
      reference: generateOrderReference(),
      customer,
      deliveryAddress,
      items: cart,
      subtotal,
      deliveryFee,
      tax,
      discount: 0,
      total,
      deliveryOption,
      paymentMethod,
      status: "confirmed",
      createdAt: new Date(),
      estimatedDelivery: calculateEstimatedDelivery(deliveryOption),
    }

    console.log("[v0] Order placed successfully")
    console.log("[v0] Order reference:", order.reference)

    sendSMSReceipt(order, customer.phone)

    setCompletedOrder(order)
    setShowConfirmation(true)
    clearCart()
    setIsProcessing(false)
  }

  const isFormValid =
    customer.name && customer.phone && deliveryAddress.street && deliveryAddress.city && deliveryAddress.zipCode

  if (!mounted || (cart.length === 0 && !showConfirmation)) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#fffbf5]">
      <Header />

      <OrderConfirmationModal
        order={completedOrder}
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false)
          router.push("/")
        }}
      />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#0f1419]">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Information */}
              <section className="bg-white border border-[#e5e7e8] rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-[#0f1419]">Delivery Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                      placeholder="+232 78 891 638"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium mb-2">
                      Street Address <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="street"
                      type="text"
                      required
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                      className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City/Town <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                      placeholder="Freetown"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                      ZIP/Postal Code <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      required
                      value={deliveryAddress.zipCode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                      className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                      placeholder="12345"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="instructions" className="block text-sm font-medium mb-2">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      id="instructions"
                      rows={3}
                      value={deliveryAddress.instructions}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, instructions: e.target.value })}
                      className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent resize-none"
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>
                </div>
              </section>

              {/* Delivery Options */}
              <section className="bg-white border border-[#e5e7e8] rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-[#0f1419]">Delivery Options</h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border-2 border-[#e5e7e8] rounded-lg cursor-pointer hover:border-[#014325] transition-colors has-[:checked]:border-[#014325] has-[:checked]:bg-[#f0fdf4]">
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={deliveryOption === "standard"}
                      onChange={() => handleDeliveryOptionChange("standard")}
                      className="w-5 h-5 text-[#014325] focus:ring-2 focus:ring-[#014325]"
                    />
                    <div className="flex-1">
                      <p className="font-bold">Standard Delivery</p>
                      <p className="text-sm text-[#5c6466]">2-3 hours</p>
                    </div>
                    <span className="font-bold text-[#014325]">{formatPrice(10000)}</span>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-[#e5e7e8] rounded-lg cursor-pointer hover:border-[#014325] transition-colors has-[:checked]:border-[#014325] has-[:checked]:bg-[#f0fdf4]">
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={deliveryOption === "express"}
                      onChange={() => handleDeliveryOptionChange("express")}
                      className="w-5 h-5 text-[#014325] focus:ring-2 focus:ring-[#014325]"
                    />
                    <div className="flex-1">
                      <p className="font-bold">Express Delivery</p>
                      <p className="text-sm text-[#5c6466]">45-60 minutes</p>
                    </div>
                    <span className="font-bold text-[#014325]">{formatPrice(25000)}</span>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-[#e5e7e8] rounded-lg cursor-pointer hover:border-[#014325] transition-colors has-[:checked]:border-[#014325] has-[:checked]:bg-[#f0fdf4]">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryOption === "pickup"}
                      onChange={() => handleDeliveryOptionChange("pickup")}
                      className="w-5 h-5 text-[#014325] focus:ring-2 focus:ring-[#014325]"
                    />
                    <div className="flex-1">
                      <p className="font-bold">Pickup</p>
                      <p className="text-sm text-[#5c6466]">Ready in 30 minutes</p>
                    </div>
                    <span className="font-bold text-[#10b981]">Free</span>
                  </label>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white border border-[#e5e7e8] rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-[#0f1419]">Payment Method</h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border-2 border-[#e5e7e8] rounded-lg cursor-pointer hover:border-[#014325] transition-colors has-[:checked]:border-[#014325] has-[:checked]:bg-[#f0fdf4]">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => handlePaymentMethodChange("cod")}
                      className="w-5 h-5 text-[#014325] focus:ring-2 focus:ring-[#014325]"
                    />
                    <div className="flex-1">
                      <p className="font-bold">Cash on Delivery</p>
                      <p className="text-sm text-[#5c6466]">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-[#e5e7e8] rounded-lg cursor-pointer hover:border-[#014325] transition-colors has-[:checked]:border-[#014325] has-[:checked]:bg-[#f0fdf4]">
                    <input
                      type="radio"
                      name="payment"
                      value="orange-money"
                      checked={paymentMethod === "orange-money"}
                      onChange={() => handlePaymentMethodChange("orange-money")}
                      className="w-5 h-5 text-[#014325] focus:ring-2 focus:ring-[#014325]"
                    />
                    <div className="flex-1">
                      <p className="font-bold">Orange Money</p>
                      <p className="text-sm text-[#5c6466]">Mobile money (*242# or *241#)</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-[#e5e7e8] rounded-lg cursor-pointer hover:border-[#014325] transition-colors has-[:checked]:border-[#014325] has-[:checked]:bg-[#f0fdf4]">
                    <input
                      type="radio"
                      name="payment"
                      value="vault"
                      checked={paymentMethod === "vault"}
                      onChange={() => handlePaymentMethodChange("vault")}
                      className="w-5 h-5 text-[#014325] focus:ring-2 focus:ring-[#014325]"
                    />
                    <div className="flex-1">
                      <p className="font-bold">Vault</p>
                      <p className="text-sm text-[#5c6466]">Secure card payment</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-[#e5e7e8] rounded-lg cursor-pointer hover:border-[#014325] transition-colors has-[:checked]:border-[#014325] has-[:checked]:bg-[#f0fdf4]">
                    <input
                      type="radio"
                      name="payment"
                      value="afrimoney"
                      checked={paymentMethod === "afrimoney"}
                      onChange={() => handlePaymentMethodChange("afrimoney")}
                      className="w-5 h-5 text-[#014325] focus:ring-2 focus:ring-[#014325]"
                    />
                    <div className="flex-1">
                      <p className="font-bold">Afrimoney</p>
                      <p className="text-sm text-[#5c6466]">West African payment</p>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e5e7e8] rounded-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-[#0f1419]">Order Summary</h2>

                {/* Items List */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-[#5c6466]">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#014325]">{formatPrice(item.totalPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#e5e7e8] pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c6466]">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c6466]">Delivery Fee</span>
                    <span className="font-medium">{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c6466]">Tax (5%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="border-t-2 border-[#014325] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Grand Total</span>
                    <span className="font-bold text-2xl text-[#014325]">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || isProcessing}
                  className="w-full bg-[#014325] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#014325]/90 disabled:bg-[#f2f3f4] disabled:text-[#5c6466] disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? "Processing..." : `Confirm Order - ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
