"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { formatPrice, generateOrderReference, calculateEstimatedDelivery } from "@/lib/utils-app"
import type { Order, Customer, DeliveryAddress } from "@/lib/types"
import { OrderConfirmationModal } from "@/components/order-confirmation-modal"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>("")
  const [deliveryOption, setDeliveryOption] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "", email: "" })
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: "",
    city: "",
    zipCode: "",
    instructions: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("[v0] Page loaded: Checkout")
    console.log("[v0] Cart items on checkout:", cart.length)

    if (mounted && cart.length === 0 && !showConfirmation) {
      console.log("[v0] Cart is empty, redirecting to cart page")
      router.push("/cart")
    }
  }, [cart.length, mounted, showConfirmation, router])

  const deliveryFees = {
    standard: 10,
    express: 25,
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

  const handleDeliveryOptionChange = (option: string) => {
    setDeliveryOption(option)
    console.log("[v0] Delivery option selected:", option)
  }

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
    console.log("[v0] Payment method selected:", method)
  }

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }

      setPaymentProof(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      console.log("[v0] Payment proof uploaded:", file.name, "size:", (file.size / 1024).toFixed(2), "KB")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] ==================== PLACE ORDER CLICKED ====================")
    console.log("[v0] Cart items count:", cart.length)
    console.log(
      "[v0] Cart items details:",
      cart.map((item) => ({ name: item.product.name, qty: item.quantity, price: item.totalPrice })),
    )
    console.log("[v0] Payment method:", paymentMethod)
    console.log("[v0] Has payment proof:", !!paymentProof)
    console.log("[v0] Form valid:", isFormValid)

    if (cart.length === 0) {
      console.error("[v0] ERROR: Cart is empty!")
      alert("Your cart is empty. Please add items before placing an order.")
      router.push("/cart")
      return
    }

    if (paymentMethod !== "cod" && !paymentProof) {
      console.error("[v0] ERROR: Payment proof missing for non-COD payment")
      alert("Please upload your payment proof (screenshot of transaction) to continue.")
      return
    }

    setIsProcessing(true)
    console.log("[v0] Processing started...")

    try {
      const orderItems = cart.map((item) => ({
        product: { ...item.product },
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      }))

      console.log("[v0] Order items captured:", orderItems.length)
      console.log(
        "[v0] Order items list:",
        orderItems.map((i) => `${i.product.name} x${i.quantity}`),
      )

      let paymentProofUrl = ""

      if (paymentProof) {
        console.log("[v0] Uploading payment proof to Vercel Blob...")
        console.log("[v0] Payment proof file:", paymentProof.name, "Size:", (paymentProof.size / 1024).toFixed(2), "KB")

        const formData = new FormData()
        formData.append("file", paymentProof)

        try {
          const uploadResponse = await fetch("/api/upload-payment", {
            method: "POST",
            body: formData,
          })

          console.log("[v0] Upload response status:", uploadResponse.status)

          if (!uploadResponse.ok) {
            let errorMessage = "Failed to upload payment proof"
            try {
              const error = await uploadResponse.json()
              errorMessage = error.error || errorMessage
              console.error("[v0] Upload error (JSON):", errorMessage)
            } catch (parseError) {
              const textError = await uploadResponse.text()
              errorMessage = textError || uploadResponse.statusText || errorMessage
              console.error("[v0] Upload error (text):", textError)
            }
            alert(`${errorMessage}. Please try with a smaller image or compress it.`)
            setIsProcessing(false)
            return
          }

          const uploadData = await uploadResponse.json()
          paymentProofUrl = uploadData.url
          console.log("[v0] ✓ Payment proof uploaded successfully!")
          console.log("[v0] Payment proof URL:", paymentProofUrl)
        } catch (uploadError) {
          console.error("[v0] Upload exception:", uploadError)
          alert("Failed to upload payment proof. Please try again.")
          setIsProcessing(false)
          return
        }
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const order: Order = {
        id: generateOrderReference(),
        reference: generateOrderReference(),
        customer,
        deliveryAddress,
        items: orderItems,
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

      console.log("[v0] ✓ Order created successfully!")
      console.log("[v0] Order reference:", order.reference)
      console.log("[v0] Order total:", formatPrice(order.total))

      const whatsappNumber = "232033680260"

      const orderItemsList = orderItems
        .map((item) => `- ${item.product.name} x${item.quantity} - ${formatPrice(item.totalPrice)}`)
        .join("\n")

      console.log("[v0] Order items formatted for WhatsApp:")
      console.log(orderItemsList)

      let paymentProofSection = ""
      if (paymentProofUrl) {
        paymentProofSection = `

📸 *Payment Proof:* 
${paymentProofUrl}
(Click link above to view transaction screenshot)`
      }

      const orderDetails = `🎂 *New Order from Pee's Bakery*

📋 *Order Reference:* ${order.reference}

👤 *Customer Details:*
Name: ${customer.name}
Phone: ${customer.phone}
${customer.email ? `Email: ${customer.email}` : ""}

📍 *Delivery Address:*
${deliveryAddress.street}
${deliveryAddress.city}, ${deliveryAddress.zipCode}
${deliveryAddress.instructions ? `Instructions: ${deliveryAddress.instructions}` : ""}

🛒 *Order Items:*
${orderItemsList}

💰 *Order Summary:*
Subtotal: ${formatPrice(subtotal)}
Delivery: ${formatPrice(deliveryFee)} (${deliveryOption})
Tax: ${formatPrice(tax)}
*Total: ${formatPrice(total)}*

💳 *Payment Method:* ${paymentMethod.toUpperCase().replace("-", " ")}${paymentProofSection}

🚚 *Estimated Delivery:* ${order.estimatedDelivery.toLocaleString()}

Thank you for your order! 🎉
      `.trim()

      console.log("[v0] WhatsApp message prepared (length:", orderDetails.length, "chars)")
      console.log("[v0] Opening WhatsApp...")

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderDetails)}`

      window.open(whatsappUrl, "_blank")
      console.log("[v0] ✓ WhatsApp opened successfully!")

      setCompletedOrder(order)
      setShowConfirmation(true)
      console.log("[v0] ✓ Confirmation modal displayed")

      console.log("[v0] Clearing cart...")
      clearCart()
      console.log("[v0] ✓ Cart cleared successfully!")
      console.log("[v0] ==================== ORDER COMPLETE ====================")

      setIsProcessing(false)
    } catch (error) {
      console.error("[v0] ❌ FATAL ERROR processing order:", error)
      alert("An error occurred while processing your order. Please try again.")
      setIsProcessing(false)
    }
  }

  const isFormValid =
    customer.name &&
    customer.phone &&
    deliveryAddress.street &&
    deliveryAddress.city &&
    deliveryAddress.zipCode &&
    (paymentMethod === "cod" || paymentProof !== null)

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
                    <span className="font-bold text-[#014325]">{formatPrice(10)}</span>
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
                    <span className="font-bold text-[#014325]">{formatPrice(25)}</span>
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
                      <p className="text-sm text-[#5c6466]">Mobile money (*242# or *241#) or Maxit app</p>
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

                {paymentMethod !== "cod" && (
                  <div className="mt-6 p-4 bg-[#fef2f2] border-2 border-[#dc2626] rounded-lg">
                    <label className="block mb-2 font-bold text-[#0f1419]">
                      Upload Payment Proof <span className="text-[#dc2626]">*REQUIRED*</span>
                    </label>
                    <p className="text-sm text-[#5c6466] mb-3">
                      Please upload a screenshot of your {paymentMethod.replace("-", " ").toUpperCase()} transaction.
                      This is required to process your order. The image will be securely uploaded and included in your
                      order confirmation. (Max 10MB)
                    </p>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#dc2626] rounded-lg cursor-pointer hover:bg-white transition-colors bg-white">
                        <Upload className="w-5 h-5 text-[#dc2626]" />
                        <span className="text-sm font-bold text-[#dc2626]">
                          {paymentProof ? "Change Payment Screenshot" : "Upload Payment Screenshot"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePaymentProofChange}
                          className="hidden"
                          required
                        />
                      </label>
                      {paymentProofPreview && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-[#10b981]">
                          <Image
                            src={paymentProofPreview || "/placeholder.svg"}
                            alt="Payment proof preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      {paymentProof && (
                        <p className="text-sm text-[#10b981] font-medium flex items-center gap-2">
                          <span className="text-xl">✓</span>
                          {paymentProof.name} ({(paymentProof.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                      {!paymentProof && (
                        <p className="text-sm text-[#dc2626] font-medium">
                          Payment proof screenshot is required to proceed with this payment method.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-[#fffbf5] border border-[#ffb40b] rounded-lg">
                  <p className="text-sm text-[#0f1419]">
                    <strong>Note:</strong> For customized design cakes (marriage or any other event), please message us
                    on WhatsApp at{" "}
                    <a href="https://wa.me/232033680260" className="text-[#014325] font-bold hover:underline">
                      033680260
                    </a>{" "}
                    or use Orange Money payment code: <strong>216542</strong>
                  </p>
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
                  {isProcessing ? "Processing Order..." : `Confirm Order - ${formatPrice(total)}`}
                </button>

                {paymentMethod !== "cod" && !paymentProof && (
                  <p className="text-xs text-[#dc2626] text-center mt-2">
                    Upload payment screenshot to enable order confirmation
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
