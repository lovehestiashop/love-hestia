import customArrangementImage from "../assets/custom-arrangement.JPG";

function CustomArrangementSectionComponent() {
  return (
    <section className="py-12 bg-[#faf9f7] text-neutral-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">

        {/* Image */}
        <div>
          <img
            src={customArrangementImage}
            alt="Custom Arrangement"
            className="w-full h-[350px] md:h-[450px] object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-3xl md:text-[36px] font-medium mb-5 text-neutral-800">
            Custom Arrangements
          </h2>

          <p className="text-sm md:text-base leading-relaxed mb-4">
            We'd love to create a personalized dried-flower arrangement just for
            you. Each design is thoughtfully crafted based on your chosen color
            palette, inspiration photos, and gifting needs.
          </p>

          <p className="text-sm md:text-base leading-relaxed">
            Final pricing depends on flower availability, arrangement size, and
            design complexity. Every piece is handmade with care, making each
            bouquet uniquely yours.
          </p>
        </div>

      </div>
    </section>
  );
}

export default CustomArrangementSectionComponent;
