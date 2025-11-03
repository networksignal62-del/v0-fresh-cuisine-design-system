"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, Search, Heart } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useCart } from "@/hooks/use-cart"
import { products } from "@/lib/products"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const { getItemCount } = useCart()
  const itemCount = getItemCount()
  const router = useRouter()
  const pathname = usePathname()
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNavClick = (destination: string) => {
    console.log("[v0] Navigation to:", destination)
    setMobileMenuOpen(false)
  }

  const handleSearchSelect = (productId: number) => {
    setSearchQuery("")
    setShowSearchDropdown(false)
    router.push(`/product/${productId}`)
  }

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#4a1f3d] shadow-lg bg-[rgba(5,62,29,1)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-4">
          {/* Left: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              className={`px-4 xl:px-6 py-2 rounded-full font-medium transition-colors bg-sidebar ${
                isActive("/") ? "bg-[#d4a5c3] text-[#4a1f3d]" : "text-white hover:bg-white/10"
              }`}
              onClick={() => handleNavClick("home")}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`px-4 xl:px-6 py-2 rounded-full font-medium transition-colors ${
                isActive("/about") ? "bg-[#d4a5c3] text-[#4a1f3d]" : "text-white hover:bg-white/10"
              }`}
              onClick={() => handleNavClick("about")}
            >
              About
            </Link>
            <Link
              href="/menu"
              className={`px-4 xl:px-6 py-2 rounded-full font-medium transition-colors ${
                isActive("/menu") ? "bg-[#d4a5c3] text-[#4a1f3d]" : "text-white hover:bg-white/10"
              }`}
              onClick={() => handleNavClick("menu")}
            >
              Menu
            </Link>
            <Link
              href="/contact"
              className={`px-4 xl:px-6 py-2 rounded-full font-medium transition-colors ${
                isActive("/contact") ? "bg-[#d4a5c3] text-[#4a1f3d]" : "text-white hover:bg-white/10"
              }`}
              onClick={() => handleNavClick("contact")}
            >
              Contact Us
            </Link>
          </nav>

          {/* Center: Brand Name */}
          <Link
            href="/"
            className="text-lg md:text-xl lg:text-3xl font-bold text-white lg:absolute lg:left-1/2 lg:-translate-x-1/2"
            onClick={() => handleNavClick("home")}
          >
            Pee's Bakery
          </Link>

          {/* Right: Search and Icons */}
          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            {/* Search - Desktop */}
            <div className="hidden xl:flex items-center gap-2 relative" ref={searchRef}>
              <Search className="w-5 h-5 text-white" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchDropdown(e.target.value.length > 0)
                }}
                onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
                className="bg-transparent text-white placeholder:text-white/70 border-none outline-none w-32 lg:w-48"
              />

              {showSearchDropdown && filteredProducts.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#e5e7e8] max-h-96 overflow-y-auto z-50">
                  {filteredProducts.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSearchSelect(product.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-[#fffbf5] transition-colors text-left border-b border-[#e5e7e8] last:border-b-0"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#0f1419] line-clamp-1">{product.name}</p>
                        <p className="text-sm text-[#5c6466] capitalize">{product.category}</p>
                      </div>
                      <span className="text-[#014325] font-bold">Le {product.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#ffb40b] flex items-center justify-center hover:bg-[#ffb40b]/90 transition-colors xl:hidden">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-[#4a1f3d]" />
            </button>
            <button className="hidden md:flex w-10 h-10 rounded-full bg-[#ffb40b] items-center justify-center hover:bg-[#ffb40b]/90 transition-colors">
              <Heart className="w-5 h-5 text-[#4a1f3d]" />
            </button>
            <Link
              href="/cart"
              className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#ffb40b] flex items-center justify-center hover:bg-[#ffb40b]/90 transition-colors"
              onClick={() => handleNavClick("cart")}
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-[#4a1f3d]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className={`font-medium transition-colors ${
                  isActive("/") ? "text-[#ffb40b]" : "text-white hover:text-[#ffb40b]"
                }`}
                onClick={() => handleNavClick("home")}
              >
                Home
              </Link>
              <Link
                href="/menu"
                className={`font-medium transition-colors ${
                  isActive("/menu") ? "text-[#ffb40b]" : "text-white hover:text-[#ffb40b]"
                }`}
                onClick={() => handleNavClick("menu")}
              >
                Menu
              </Link>
              <Link
                href="/about"
                className={`font-medium transition-colors ${
                  isActive("/about") ? "text-[#ffb40b]" : "text-white hover:text-[#ffb40b]"
                }`}
                onClick={() => handleNavClick("about")}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`font-medium transition-colors ${
                  isActive("/contact") ? "text-[#ffb40b]" : "text-white hover:text-[#ffb40b]"
                }`}
                onClick={() => handleNavClick("contact")}
              >
                Contact
              </Link>
              {/* Mobile Search */}
              <div className="relative pt-2 border-t border-white/20">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchDropdown(e.target.value.length > 0)
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/70 border border-white/20"
                />
                {showSearchDropdown && filteredProducts.length > 0 && (
                  <div className="mt-2 bg-white rounded-lg shadow-xl border border-[#e5e7e8] max-h-64 overflow-y-auto">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          handleSearchSelect(product.id)
                          setMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[#fffbf5] transition-colors text-left border-b border-[#e5e7e8] last:border-b-0"
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#0f1419] text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-[#5c6466]">Le {product.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
