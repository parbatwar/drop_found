// pages/SellerLanding.jsx — DropFound Amazon-Style Merchant Features & Layout
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function SellerLanding() {
  const { user } = useAuth();

  // Amazon-style structured feature cards (Replacing abstract editorial blocks)
  const amazonStylePillars = [
    {
      badge: 'FEATURE 01',
      title: 'Unified Marketplace Discovery',
      headline: 'Stop scattering your brand across random chat threads.',
      description: 'Your customers are tired of following dozens of pages and waiting on DMs just to check prices or availability. Bring your entire inventory into one clean, searchable marketplace built exclusively for clothing.',
      highlights: [
        'Centralized inventory search engine',
        'No more lost sales in unread DMs',
        'Optimized specifically for apparel and thrift'
      ],
      iconBg: 'bg-red-500 text-white',
    },
    {
      badge: 'FEATURE 02',
      title: 'Dedicated Storefront Identity',
      headline: 'A true professional storefront, not just a plain product list.',
      description: 'Say goodbye to the cluttered templates of mainstream marketplaces. Get a dedicated profile featuring reviews, ratings, follower counts, and aesthetic collections that let your unique brand identity shine.',
      highlights: [
        'Custom brand profile & banner',
        'Verified customer reviews & ratings',
        'Curated aesthetic collections'
      ],
      iconBg: 'bg-neutral-900 text-white',
    },
    {
      badge: 'FEATURE 03',
      title: 'Streamlined Store Operations',
      headline: 'Everything you need to run your shop in one dashboard.',
      description: 'Manage your stock, track incoming orders, and handle sales effortlessly without spending thousands on an independent website. We give small creators and starting-out brands the operational power they need from day one.',
      highlights: [
        'Real-time stock & inventory tracker',
        'Order status and fulfillment pipeline',
        'Built-in lightweight analytics'
      ],
      iconBg: 'bg-neutral-900 text-white',
    },
    {
      badge: 'FEATURE 04',
      title: 'Built-in Trust & Verification',
      headline: 'Real verification badges that keep buyer scams away.',
      description: 'Build instant buyer confidence through our lightweight identity checks. Whether you get a Green badge as an independent creator or a Blue badge as a registered business, buyers know you are 100% legit.',
      highlights: [
        'Green Badge for independent creators',
        'Blue Badge for registered businesses',
        'Enhanced buyer trust & lower drop-offs'
      ],
      iconBg: 'bg-red-500 text-white',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-neutral-900 selection:bg-neutral-900 selection:text-white overflow-x-hidden">
      
      {/* ─── Minimal Editorial Nav ─── */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-24 flex items-center justify-between">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-900 hover:opacity-75 transition-opacity">
            DropFound
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/browse" className="text-[11px] uppercase tracking-[0.25em] font-normal text-neutral-500 hover:text-neutral-900 transition-colors hidden sm:inline-block">
              Explore Marketplace
            </Link>
            <Link
              to={user ? "/apply" : "/login"}
              className="text-[11px] uppercase tracking-[0.25em] font-medium text-white bg-neutral-900 px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all shadow-xs"
            >
              {user ? 'Apply Now' : 'Sign In'}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section: Editorial Split with Aesthetic Visual Card ─── */}
      <section className="relative min-h-[90vh] flex items-center pt-8 pb-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-8 space-y-8 animate-fade-in-up">
              <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 block">
                Nepal&apos;s Dedicated Clothing Platform
              </span>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-tight leading-[1.02] text-neutral-900">
                Your social shop, <br />
                <span className="font-light italic text-red-500">built for growth.</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-xl leading-relaxed tracking-wide">
                We combine the easy reach of social media with the structured, reliable checkout experience of an enterprise marketplace. Give your clothing label or thrift store the professional home it deserves across Nepal.
              </p>
              <div className="pt-4 flex items-center gap-8 flex-wrap">
                <Link
                  to={user ? "/apply" : "/login"}
                        className="inline-block px-10 py-4 bg-neutral-900 rounded-full text-white text-[11px] uppercase tracking-[0.25em] font-light hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                >
                  {user ? 'Start Application' : 'Open Your Shop Free'}
                </Link>
                <a
                  href="#features"
                  className="text-[11px] uppercase tracking-[0.25em] text-neutral-900 font-light hover:text-neutral-500 transition-colors"
                >
                  Explore Features ↓
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 animate-fade-in-up [animation-delay:200ms]">
              <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden border border-neutral-200 transition-all duration-500 hover:shadow-xl group">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop" 
                  alt="DropFound Editorial Fashion" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-neutral-900/80 via-neutral-900/30 to-transparent text-white flex justify-between items-end">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-300 block mb-1">Featured Showcase</span>
                    <p className="text-xs tracking-wider font-light">Kathmandu Independent Stores</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

        {/* ─── Professional Trust Ticker (Replaced Marquee) ─── */}
        <section className="bg-neutral-950 text-white py-5 border-y border-neutral-800 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-wrap items-center justify-between gap-6 text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-light">
            <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span className="text-neutral-200 font-normal">Zero Setup Fees</span>
            </div>
            <div className="hidden md:block text-neutral-700">/</div>
            <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span className="text-neutral-200 font-normal">Secure Verification</span>
            </div>
            <div className="hidden md:block text-neutral-700">/</div>
            <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span className="text-neutral-200 font-normal">Apparel & Thrift </span>
            </div>
            <div className="hidden md:block text-neutral-700">/</div>
            <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span className="text-neutral-200 font-normal">Built for Nepal</span>
            </div>
            </div>
        </section>

      {/* ─── Feature Grid Layout (Structured Depth) ─── */}
      <section id="features" className="py-28 max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-red-600 font-semibold block">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-neutral-900">
            Engineered for high-converting clothing stores.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            Everything structured neatly like an enterprise marketplace, tailor-made for modern boutique and thrift merchants.
          </p>
        </div>

        {/* 2x2 Amazon-style Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {amazonStylePillars.map((pillar, index) => (
            <div 
              key={index}
              className="bg-neutral-50/80 border border-neutral-200/80 p-8 sm:p-10 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-neutral-400 hover:bg-white hover:shadow-xl group"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-semibold">
                    {pillar.badge}
                  </span>
                  <div className={`w-9 h-9 rounded-xl ${pillar.iconBg} flex items-center justify-center text-xs font-medium shadow-sm`}>
                    0{index + 1}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 font-normal">
                    {pillar.headline}
                  </p>
                </div>

                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  {pillar.description}
                </p>

                {/* Amazon-style Bullet Feature Breakdown */}
                <ul className="space-y-2.5 pt-4 border-t border-neutral-200/80">
                  {pillar.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="text-[11px] text-neutral-800 flex items-center gap-2.5 font-light">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-neutral-200/80 flex items-center justify-between text-neutral-600">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400">Included free</span>
                <span className="text-xs font-light text-neutral-900 group-hover:translate-x-1 transition-transform inline-block">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── High-Contrast Dark Metrics Section ─── */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-4xl sm:text-5xl font-extralight tracking-tight text-white">500+</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Active Sellers</p>
            </div>
            <div className="space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-4xl sm:text-5xl font-extralight tracking-tight text-white">10K+</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Monthly Buyers</p>
            </div>
            <div className="space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-4xl sm:text-5xl font-extralight tracking-tight text-white">98%</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Satisfaction</p>
            </div>
            <div className="space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-4xl sm:text-5xl font-extralight tracking-tight text-white">0</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Listing Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Minimal Footer Call to Action ─── */}
      <section className="py-32 bg-neutral-50 text-center border-t border-neutral-200">
        <div className="max-w-xl mx-auto px-6 space-y-8">
          <span className="text-[10px] uppercase tracking-[0.4em] text-red-600 font-semibold block">
            Start Selling Today
          </span>
          <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight text-neutral-900">
            Ready to give your brand a proper digital home?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            Leave behind messy Instagram DMs and manual tracking. Join Nepal&apos;s dedicated clothing marketplace with complete freedom over your pricing and style.
          </p>
          <div className="pt-4">
            <Link
              to={user ? "/apply" : "/login"}
              className="inline-block px-10 py-4 bg-neutral-900 rounded-full text-white text-[11px] uppercase tracking-[0.25em] font-light hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
            >
              {user ? 'Submit Application' : 'Sign In to Begin'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default SellerLanding;