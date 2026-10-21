
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
          <iframe
            src="https://www.instagram.com/lovehestiaflowers/embed"
            title="Love Hestia Flowers Instagram feed"
            className="w-full border-0"
            style={{ height: "650px" }}
            loading="lazy"
            allowTransparency="true"
          />
        </div>

        <div className="text-center mt-6">
          <a
            href="https://www.instagram.com/lovehestiaflowers/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-neutral-700 rounded-full px-6 py-3 hover:bg-neutral-800 hover:text-white transition"
          >
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

export default InstagramFeedSectionComponent;
