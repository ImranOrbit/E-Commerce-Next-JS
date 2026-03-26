
export default function About() {
  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="md:text-4xl text-2xl font-bold text-amber-400">
            About Us
          </h1>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 mb-4"></div>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Premium Fashion Essentials products crafted with love and science.
          </p>
        </div>

        {/* Fashion Essentials Section */}
        <div className="mb-16 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 border border-amber-400/20">
          <h2 className="text-3xl font-bold text-center text-amber-400 mb-6">
            Fashion Essentials
          </h2>
          <p className="text-center text-gray-300 text-lg mb-4">
            Premium Shirts • Panjabi • T-Shirts • Trousers • Perfume
          </p>
          <p className="text-center text-amber-400 text-sm mb-8">
            ✨ Full HD Clarity — Every Detail, Every Style ✨
          </p>
          
          <div className="text-center">
            <button className="rounded-full bg-amber-400 px-8 py-3 text-black font-semibold hover:bg-amber-500 transition duration-300">
              Explore Collection →
            </button>
          </div>

          {/* Product Categories */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { emoji: "👕", name: "Shirt", color: "text-amber-400" },
              { emoji: "🧥", name: "Panjabi", color: "text-amber-400" },
              { emoji: "👕", name: "T-Shirt", color: "text-amber-400" },
              { emoji: "👖", name: "Pant", color: "text-amber-400" },
              { emoji: "🌸", name: "Perfume", color: "text-amber-400" }
            ].map((item, idx) => (
              <span 
                key={idx} 
                className="bg-gray-900 border border-amber-400/30 px-5 py-2 rounded-full text-gray-300 hover:border-amber-400 hover:text-amber-400 transition duration-300"
              >
                {item.emoji} {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          <div>
            <h2 className="text-2xl font-semibold text-amber-400 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Health & Beauty is a modern e-commerce brand focused on delivering
              high-quality, safe and effective fashion and beauty products.  
              We believe style and beauty start with confidence.
            </p>

            <p className="mt-4 text-gray-300">
              All our products are cruelty-free, dermatologist tested and made
              with carefully selected ingredients.
            </p>

            {/* Now Showing Section */}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-amber-400/20">
              <p className="text-amber-400 font-semibold text-center">
                Now Showing: Shirt Collection
              </p>
              <p className="text-gray-400 text-sm text-center mt-1">
                Premium formal & casual shirts for every occasion
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl bg-gray-900 border border-amber-400/20 p-6 text-center hover:border-amber-400 transition duration-300">
              <h3 className="text-3xl font-bold text-amber-400">10K+</h3>
              <p className="text-sm mt-2 text-gray-400">Happy Customers</p>
            </div>

            <div className="rounded-xl bg-gray-900 border border-amber-400/20 p-6 text-center hover:border-amber-400 transition duration-300">
              <h3 className="text-3xl font-bold text-amber-400">100+</h3>
              <p className="text-sm mt-2 text-gray-400">Premium Products</p>
            </div>

            <div className="rounded-xl bg-gray-900 border border-amber-400/20 p-6 text-center hover:border-amber-400 transition duration-300">
              <h3 className="text-3xl font-bold text-amber-400">50+</h3>
              <p className="text-sm mt-2 text-gray-400">Fashion Styles</p>
            </div>

            <div className="rounded-xl bg-gray-900 border border-amber-400/20 p-6 text-center hover:border-amber-400 transition duration-300">
              <h3 className="text-3xl font-bold text-amber-400">24/7</h3>
              <p className="text-sm mt-2 text-gray-400">Customer Support</p>
            </div>
          </div>
        </div>

        {/* Product Categories Detailed Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-amber-400 mb-8">
            Our Premium Collections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { emoji: "👕", name: "Shirt", desc: "Formal & Casual" },
              { emoji: "🧥", name: "Panjabi", desc: "Traditional Wear" },
              { emoji: "👕", name: "T-Shirt", desc: "Modern Style" },
              { emoji: "👖", name: "Pant", desc: "Comfort Fit" },
              { emoji: "🌸", name: "Perfume", desc: "Luxury Fragrance" }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-gray-900 rounded-lg p-4 text-center border border-amber-400/20 hover:border-amber-400 transition duration-300"
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <h4 className="text-amber-400 font-semibold">{item.name}</h4>
                <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full HD Clarity Banner */}
        <div className="mt-12 text-center py-6 px-4 bg-gradient-to-r from-amber-400/10 to-transparent rounded-lg border border-amber-400/20">
          <p className="text-amber-400 text-sm font-medium">
            ✨ Full HD Clarity — Every Detail, Every Style ✨
          </p>
          <p className="text-gray-500 text-xs mt-2">
            High-resolution images • Premium quality • Authentic products
          </p>
        </div>
      </div>
    </section>
  );
}