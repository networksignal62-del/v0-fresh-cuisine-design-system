"use server"

import { createClient } from "@/lib/supabase/server"

export interface OrderPayload {
  customerName: string
  customerPhone: string
  customerAddress: string
  deliveryMethod: "delivery" | "pickup"
  paymentMethod: "cash" | "orange_money" | "afrimoney"
  paymentProofUrl?: string
  subtotal: number
  deliveryFee: number
  total: number
  notes?: string
  items: {
    productId: number
    productName: string
    variantName?: string
    quantity: number
    unitPrice: number
    totalPrice: number
    addons?: { name: string; price: number }[]
    specialInstructions?: string
  }[]
}

export async function saveOrder(payload: OrderPayload) {
  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: payload.customerName,
      customer_phone: payload.customerPhone,
      customer_address: payload.customerAddress,
      delivery_method: payload.deliveryMethod,
      payment_method: payload.paymentMethod,
      payment_proof_url: payload.paymentProofUrl ?? null,
      subtotal: payload.subtotal,
      delivery_fee: payload.deliveryFee,
      total: payload.total,
      notes: payload.notes ?? null,
      status: "pending",
    })
    .select()
    .single()

  if (orderError || !order) {
    return { success: false, error: orderError?.message ?? "Failed to save order" }
  }

  const itemRows = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    variant_name: item.variantName ?? null,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
    addons: item.addons ? JSON.stringify(item.addons) : null,
    special_instructions: item.specialInstructions ?? null,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows)

  if (itemsError) {
    return { success: false, error: itemsError.message }
  }

  return { success: true, orderId: order.id as string }
}

export async function getOrders() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(*)`)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message, data: [] }
  return { success: true, data: data ?? [] }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
