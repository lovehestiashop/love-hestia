
import { Link } from "react-router-dom";

import NavItemsComponent from "../components/nav-items";
import FooterComponent from "../components/footer";

function WeddingsEventsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-neutral-700">

      {/* HEADER */}
      <header className="bg-[#faf9f7] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <NavItemsComponent />
        </div>
      </header>

      {/* COMING SOON - TEXT ONLY */}
      <main className="flex min-h-[65vh] items-center justify-center px-6 py-20">

        <div className="max-w-3xl mx-auto text-center">

          {/* BRAND LABEL */}
          <p className="text-xs tracking-[0.22em] uppercase text-[#98776f] mb-6">
            Pretty Withered · A Love Hestia Floral Experience
          </p>

          {/* MAIN HEADING */}
          <h1
            className="text-5xl md:text-7xl text-neutral-700 mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
            }}
          >
            Coming Soon
          </h1>

          {/* DIVIDER */}
          <div className="w-16 h-px bg-[#98776f] mx-auto mb-8" />

          {/* DESCRIPTION */}

          <p className="text-sm md:text-base leading-8 text-neutral-600 mb-5">
            Our Withered Fleur Bar & Tablescape Styling is
            taking shape. We're preparing something special for
            weddings, birthdays, and intimate gatherings.
          </p>

          <p className="text-sm md:text-base leading-8 text-neutral-600 mb-10">
            This floral experience is not yet available for booking,
            but we look forward to bringing it to your celebrations soon.
          </p>



          {/* BACK TO HOME */}
          <Link
            to="/"
            className="
              inline-flex
              items-center
              justify-center
              rounded-full
              border
              border-[#98776f]
              bg-[#98776f]
              px-9
              py-3
              text-sm
              font-medium
              tracking-wide
              text-white
              shadow-md
              transition-all
              duration-300
              hover:bg-[#806159]
              hover:border-[#806159]
            "
          >
            Back to Home
          </Link>

        </div>
      </main>

      {/* FOOTER */}
      <FooterComponent />

    </div>
  );
}

export default WeddingsEventsPage;
