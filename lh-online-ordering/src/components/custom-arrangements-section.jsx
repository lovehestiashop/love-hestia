function CustomArrangementSectionComponent() {
  const data = {
    title: "Custom Arrangements",
    image:
      "https://api.lovehestia.shop/wp-content/uploads/2026/06/DSC03425.jpg",
    text: `We'd love to create a personalized dried-flower arrangement just for you.
Each design is thoughtfully crafted based on your chosen color palette, inspiration photos, and gifting needs.

Final pricing depends on flower availability, arrangement size, and design complexity.Every piece is handmade with care, making each bouquet uniquely yours.`,
  };

  return (
    <section className="py-12 bg-[#faf9f7] text-neutral-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">

        {/* Image */}
        <div>
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-[350px] md:h-[450px] object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-[36px] mb-5 text-neutral-800">
            {data.title}
          </h2>

          <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">
            {data.text}
          </p>
        </div>

      </div>
    </section>
  );
}

export default CustomArrangementSectionComponent;
