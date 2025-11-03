import type { Order } from "./types"

export function formatPrice(price: number): string {
  return `Le ${price.toFixed(0)}`
}

export function generateOrderReference(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ORD-${year}-${random}`
}

export function calculateEstimatedDelivery(deliveryOption: "standard" | "express" | "pickup"): Date {
  const now = new Date()
  switch (deliveryOption) {
    case "express":
      now.setMinutes(now.getMinutes() + 60)
      break
    case "standard":
      now.setHours(now.getHours() + 2)
      break
    case "pickup":
      now.setMinutes(now.getMinutes() + 30)
      break
  }
  return now
}

export function sendSMSReceipt(order: Order, phone: string) {
  console.log("[v0] SMS Receipt sent to:", phone)
  console.log(`
Fresh Cuisine Receipt
Order: ${order.reference}
Date: ${new Date().toLocaleString()}
---
Items:
${order.items
  .map((item) => `${item.quantity}x ${item.product.name} - LE ${item.totalPrice.toLocaleString()}`)
  .join("\n")}
---
Subtotal: LE ${order.subtotal.toLocaleString()}
Delivery: LE ${order.deliveryFee.toLocaleString()}
Tax: LE ${order.tax.toLocaleString()}
---
Total: LE ${order.total.toLocaleString()}
Payment: ${order.paymentMethod.toUpperCase()}
Delivery to: ${order.deliveryAddress.street}, ${order.deliveryAddress.city}
Est. delivery: ${order.estimatedDelivery.toLocaleTimeString()}
  `)
}
