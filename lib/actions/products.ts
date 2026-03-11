"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ProductPayload {
  name: string
  category: string
  price: number
  image?: string
  description?: string
  longDescription?: string
  featured?: boolean
  rating?: number
  reviewCount?: number
  isCustomizable?: boolean
  isActive?: boolean
}

export async function getAdminProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`*, product_variants(*), product_addons(*)`)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message, data: [] }
  return { success: true, data: data ?? [] }
}

export async function createProduct(payload: ProductPayload) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: payload.name,
      category: payload.category,
      price: payload.price,
      image: payload.image ?? null,
      description: payload.description ?? null,
      long_description: payload.longDescription ?? null,
      featured: payload.featured ?? false,
      rating: payload.rating ?? null,
      review_count: payload.reviewCount ?? 0,
      is_customizable: payload.isCustomizable ?? false,
      is_active: payload.isActive ?? true,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath("/menu")
  revalidatePath("/admin/products")
  return { success: true, data }
}

export async function updateProduct(id: number, payload: Partial<ProductPayload>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("products")
    .update({
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.category !== undefined && { category: payload.category }),
      ...(payload.price !== undefined && { price: payload.price }),
      ...(payload.image !== undefined && { image: payload.image }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.longDescription !== undefined && { long_description: payload.longDescription }),
      ...(payload.featured !== undefined && { featured: payload.featured }),
      ...(payload.isActive !== undefined && { is_active: payload.isActive }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { success: false, error: error.message }
  revalidatePath("/menu")
  revalidatePath("/admin/products")
  return { success: true }
}

export async function deleteProduct(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) return { success: false, error: error.message }
  revalidatePath("/menu")
  revalidatePath("/admin/products")
  return { success: true }
}

export async function toggleProductActive(id: number, isActive: boolean) {
  return updateProduct(id, { isActive })
}

export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_settings").select("*")
  if (error) return { success: false, error: error.message, data: [] }
  return { success: true, data: data ?? [] }
}

export async function updateSiteSetting(key: string, value: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
  if (error) return { success: false, error: error.message }
  return { success: true }
}
