
import { Link } from "react-router-dom";

function CustomArrangementSectionComponent() {
  const data = {
    image: "/Custom Arrangements.jpeg",
    heading: "A little more personal",
    text: `Each design is thoughtfully crafted based on your chosen color palette, inspiration photos, and gifting needs.

Final pricing depends on flower availability, arrangement size, and design complexity. Every piece is handmade with care, making each bouquet uniquely yours.`,
  };

  return (
    <section className="py-12 bg-[#faf9f7] text-neutral-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">

        {/* Image */}
        <div>
          <img
            src={data.image}
            alt="Love Hestia custom dried-flower arrangements"
            className="w-full h-[350px] md:h-[450px] object-cover rounded-lg"
          />
        </div>

        {/* Centered Content */}
        <div className="text-center">

          {/* Heading */}
          <h2
            className="text-[28px] md:text-[36px] leading-tight mb-6 font-semibold text-neutral-700"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {data.heading}
          </h2>

          {/* Description */}
          <p className="text-[15px] md:text-[18px] leading-[2] text-neutral-600 whitespace-pre-line">
            {data.text}
          </p>

          {/* Centered Button */}
          <div className="flex justify-center mt-8">
            <Link
              to="/customize"
              className="inline-flex items-center justify-center rounded-full border border-[#98776f] bg-[#98776f] px-9 py-3.5 text-sm md:text-base font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:bg-[#806159] hover:border-[#806159] hover:shadow-lg"
            >
              Customize your Arrangement
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CustomArrangementSectionComponent;
