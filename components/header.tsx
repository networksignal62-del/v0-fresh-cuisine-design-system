"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/hooks/use-cart"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  const handleNavClick = (destination: string) => {
    console.log("[v0] Navigation to:", destination)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#014325] shadow-lg text-green-950">
      <div className="container mx-auto px-4 bg-card my-0 rounded-sm">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="text-lg md:text-2xl font-bold" onClick={() => handleNavClick("home")}>
            Madam Pee&#39;s 
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-[#ffb40b] transition-colors" onClick={() => handleNavClick("home")}>
              Home
            </Link>
            <Link
              href="/menu"
              className="hover:text-[#ffb40b] transition-colors"
              onClick={() => handleNavClick("menu")}
            >
              Menu
            </Link>
            <Link
              href="/about"
              className="hover:text-[#ffb40b] transition-colors"
              onClick={() => handleNavClick("about")}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#ffb40b] transition-colors"
              onClick={() => handleNavClick("contact")}
            >
              Contact
            </Link>
          </nav>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors bg-green-950 text-background py-2.5 px-3"
            onClick={() => handleNavClick("cart")}
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ffb40b] text-[#0f1419] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-4">
              <Link href="/" className="hover:text-[#ffb40b] transition-colors" onClick={() => handleNavClick("home")}>
                Home
              </Link>
              <Link
                href="/menu"
                className="hover:text-[#ffb40b] transition-colors"
                onClick={() => handleNavClick("menu")}
              >
                Menu
              </Link>
              <Link
                href="/about"
                className="hover:text-[#ffb40b] transition-colors"
                onClick={() => handleNavClick("about")}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#ffb40b] transition-colors"
                onClick={() => handleNavClick("contact")}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
