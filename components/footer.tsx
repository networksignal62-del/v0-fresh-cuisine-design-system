import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#fffbf5] border-t border-[#e5e7e8] mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#014325]">About Pee's Bakery</h3>
            <p className="text-sm text-[#5c6466] leading-relaxed">
              Authentic African dishes, fresh pastries, and fast food delights. Taste the culture, enjoy the comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#014325]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menu" className="text-[#5c6466] hover:text-[#014325]">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#5c6466] hover:text-[#014325]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#5c6466] hover:text-[#014325]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-[#5c6466] hover:text-[#014325]">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#014325]">Contact</h3>
            <ul className="space-y-2 text-sm text-[#5c6466]">
              <li>+232 078 891638</li>
              <li>info@peesbakery.sl</li>
              <li>90A Regent Road</li>
              <li>Old School Junction, Freetown</li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#014325]">We Accept</h3>
            <div className="space-y-2 text-sm text-[#5c6466]">
              <p>Cash on Delivery</p>
              <p>Orange Money</p>
              <p>Vault</p>
              <p>Afrimoney</p>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-8 pt-8 border-t border-[#e5e7e8] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#5c6466]">© 2025 Pee's Bakery & Restaurant. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-[#5c6466] hover:text-[#014325]" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#5c6466] hover:text-[#014325]" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#5c6466] hover:text-[#014325]" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
