"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"
import type { Order } from "@/lib/types"
import { formatPrice } from "@/lib/utils-app"
import { Confetti } from "./confetti"
import Link from "next/link"

interface OrderConfirmationModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export function OrderConfirmationModal({ order, isOpen, onClose }: OrderConfirmationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && order) {
      console.log("[v0] Order confirmation modal shown")
      setShowConfetti(true)
    }
  }, [isOpen, order])

  if (!isOpen || !order) return null

  return (
    <>
      <Confetti trigger={showConfetti} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#0f1419]/75 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-[modal-enter_0.3s_ease-out]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-[#10b981] animate-[scale-in_0.5s_ease-out]" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-2 text-[#0f1419]">Order Confirmed! 🎉</h2>
          <p className="text-center text-[#5c6466] mb-6">Thank you for your order</p>

          {/* Order Details */}
          <div className="bg-[#fffbf5] rounded-lg p-4 mb-6 space-y-3">
            <div>
              <p className="text-sm text-[#5c6466]">Order Reference</p>
              <p className="text-xl font-bold text-[#014325]">{order.reference}</p>
            </div>

            <div>
              <p className="text-sm text-[#5c6466]">Estimated Delivery</p>
              <p className="font-medium">
                {order.estimatedDelivery.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#5c6466]">Delivery Address</p>
              <p className="font-medium">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#5c6466]">Total Amount</p>
              <p className="text-2xl font-bold text-[#014325]">{formatPrice(order.total)}</p>
            </div>
          </div>

          {/* Receipt Info */}
          <p className="text-sm text-center text-[#5c6466] mb-6">Receipt sent to {order.customer.phone}</p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              onClick={onClose}
              className="block w-full bg-[#014325] text-white py-3 rounded-lg font-medium text-center hover:bg-[#014325]/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
