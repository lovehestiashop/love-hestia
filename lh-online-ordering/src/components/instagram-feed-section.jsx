
function InstagramFeedSectionComponent() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className="text-[36px] md:text-[48px] text-center mb-4 text-neutral-700"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
          }}
        >
          Follow Our Floral Journey
        </h2>

        <p className="text-center text-neutral-600 mb-10">
          A little more Love Hestia, straight from Instagram.
        </p>

        <div className="w-full">
          {/* Instagram feed will be embedded here */}
        </div>
      </div>
    </section>
  );
}

export default InstagramFeedSectionComponent;
