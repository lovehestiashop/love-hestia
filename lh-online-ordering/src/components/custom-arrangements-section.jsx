import customArrangementImage from "../assets/custom-arrangement.JPG";
import { Link } from "react-router-dom";

function CustomArrangementSectionComponent() {
  return (
    <section className="py-16 bg-[#faf9f7] text-neutral-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
        
        {/* Image */}
        <div>
          <img
            src={customArrangementImage}
            alt="Custom Arrangement"
            className="w-full rounded-lg object-cover"
          />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-[42px] font-light mb-6">
            Custom Arrangements
          </h2>

          <p className="text-base leading-relaxed mb-6">
            We'd love to create a personalized dried-flower arrangement just for
            you. Each design is thoughtfully crafted based on your chosen color
            palette, inspiration photos, and gifting needs.
          </p>

          <p className="text-base leading-relaxed">
            Final pricing depends on flower availability, arrangement size, and
            design complexity. Every piece is handmade with care, making each
            bouquet uniquely yours.
          </p>

          {/*
          <Link to="/customize">
            <button className="mt-8 border border-neutral-800 px-6 py-2 rounded-full text-sm hover:bg-neutral-800 hover:text-white transition">
              Custom Order Process
            </button>
          </Link>
          */}
        </div>
      </div>
    </section>
  );
}

export default CustomArrangementSectionComponent;
