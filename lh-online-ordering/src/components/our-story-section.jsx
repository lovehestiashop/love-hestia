
import { useState } from "react";

function OurStorySectionComponent() {
  const [isExpanded, setIsExpanded] = useState(false);

  const data = {
    image: "/Our story.jpeg",
    title: "About Us",
    subtitle: "Discover the story and inspiration behind Love Hestia.",
    text: `Love Hestia began in 2022, born from healing, hope, and a renewed sense of purpose.

Like many, the journey was shaped by the uncertainty of the pandemic. In the quiet stillness that followed, dried flowers became a new source of comfort and creativity. With no background in floral design, the very first bouquet I created was sold right away. That small moment sparked something much bigger—a path that felt unexpected but meant to be.

What started as a small, comforting hobby slowly grew into a passion and eventually a business. From offering locally sourced dried flowers, Love Hestia has expanded into creating premium preserved blooms that can last for years with proper care.

Every arrangement is crafted with intention, care, and heart, perfect for gifting or adding warmth to any space. Today, Love Hestia also offers dried flower workshops, teaching others how to create pieces they can proudly take home.

Through every bouquet and every workshop, the mission remains the same: to share joy, creativity, and a little warmth, one flower at a time.`,
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

        {/* About Us Card and Story */}
        <div className="order-2 md:order-1">

          {/* Clickable About Us Card */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="about-us-story"
            className="w-full rounded-xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#98776f] sm:p-6"
          >
            {/* Heading and Expand Icon */}
            <span className="flex items-center justify-between gap-4">
              <span
                className="text-[28px] md:text-[36px] font-semibold leading-tight text-[#98776f]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {data.title}
              </span>

              <span
                aria-hidden="true"
                className="text-xl font-medium text-[#98776f]"
              >
                {isExpanded ? "−" : "+"}
              </span>
            </span>

            {/* Supporting Sentence */}
            <span className="mt-2 block text-sm md:text-base leading-relaxed text-neutral-600">
              {data.subtitle}
            </span>
          </button>

          {/* Expandable Story */}
          {isExpanded && (
            <div
              id="about-us-story"
              className="mt-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <p className="text-[15px] md:text-[17px] leading-[2] text-neutral-600 whitespace-pre-line">
                {data.text}
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default OurStorySectionComponent;
