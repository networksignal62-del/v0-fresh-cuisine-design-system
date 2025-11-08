import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API called")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File received:", file.name, "Size:", (file.size / 1024).toFixed(2), "KB")

    if (!file.type.startsWith("image/")) {
      console.error("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      console.error("[v0] File too large:", (file.size / 1024 / 1024).toFixed(2), "MB")
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    const timestamp = Date.now()
    const filename = `payment-proof-${timestamp}-${file.name}`

    console.log("[v0] Uploading to Vercel Blob:", filename)

    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
