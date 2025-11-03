import Image from "next/image"
import Link from "next/link"

export function PromoBanner() {
  return (
    <section className="bg-[#fffbf5] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl overflow-hidden shadow-lg">
          {/* Left: Operating Hours & Promo */}
          <div className="p-6 md:p-10 space-y-6">
            {/* Weekdays */}
            <div className="bg-[#fffbf5] rounded-xl p-6 border border-[#e5e7e8]">
              <p className="text-[#5c6466] mb-2">Weekdays (Monday until Friday)</p>
              <p className="text-4xl md:text-5xl font-bold text-[#0f1419] mb-1">09:30 - 22:00</p>
              <p className="text-[#5c6466]">(21:00 Last Order)</p>
            </div>

            {/* Weekend */}
            <div className="bg-[#fffbf5] rounded-xl p-6 border border-[#e5e7e8]">
              <p className="text-[#5c6466] mb-2">Weekend (Saturday and Sunday)</p>
              <p className="text-4xl md:text-5xl font-bold text-[#0f1419] mb-1">10:30 - 23:00</p>
              <p className="text-[#5c6466]">(23:00 Last Order)</p>
            </div>

            {/* Promo Text */}
            <div className="pt-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#014325] mb-3 leading-tight">
                Get 20% OFF On Your First Order!
              </h2>
              <p className="text-[#5c6466] mb-6">Invite friends & earn exclusive discounts on future orders.</p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="bg-[#ffb40b] text-[#0f1419] px-6 py-3 rounded-lg font-bold hover:bg-[#ffb40b]/90 transition-colors"
                >
                  VIEW ON MAP
                </Link>
                <Link
                  href="/about"
                  className="bg-white text-[#0f1419] px-6 py-3 rounded-lg font-bold border-2 border-[#e5e7e8] hover:border-[#014325] transition-colors"
                >
                  VIEW OUR AREA
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-64 lg:h-full min-h-[400px]">
            <Image
              src="/images/design-mode/pasta-spaghetti-with-shrimps-tomato-sauce-served-plate-dark-surface-closeup.jpg"
              alt="Delicious grilled shrimp skewers"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
