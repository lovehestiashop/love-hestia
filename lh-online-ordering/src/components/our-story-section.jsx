
function OurStorySectionComponent() {
  const data = {
    image: "/Our story.jpeg",
    title: "About Us",
    text: `Love Hestia began in 2022, born from healing, hope, and a love for dried flowers.

What started as a small hobby grew into a passion for creating thoughtful floral arrangements. Today, we work with dried and preserved blooms, offering meaningful gifts, decorative pieces, and floral workshops.

Every arrangement is made with intention and care, bringing a little warmth, beauty, and joy to life's special moments.`,
  };

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 px-6 items-center">

        {/* Image */}
        <div className="order-1 md:order-2">
          <img
            src={data.image}
            alt="About Love Hestia"
            className="w-full h-[350px] md:h-[450px] object-cover rounded-lg"
          />
        </div>

        {/* About Us Content */}
        <div className="order-2 md:order-1">
          <h2
            className="text-[30px] md:text-[42px] mb-6 font-semibold text-neutral-700 leading-none"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {data.title}
          </h2>

          <p className="text-[15px] md:text-[18px] leading-[2] text-neutral-600 whitespace-pre-line">
            {data.text}
          </p>
        </div>

      </div>
    </section>
  );
}

export default OurStorySectionComponent;
