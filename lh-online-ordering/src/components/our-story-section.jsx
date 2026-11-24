
import { useState } from "react";

function OurStorySectionComponent() {
  const [isExpanded, setIsExpanded] = useState(false);

  const data = {
    image: "/Our story.jpeg",
    title: "About Us",
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

        {/* About Us Button and Story */}
        <div className="order-2 md:order-1">

          {/* Centered About Us Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls="about-us-story"
              className="inline-flex items-center gap-3 text-[30px] md:text-[42px] font-semibold text-neutral-700 leading-none transition-colors duration-300 hover:text-[#98776f]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {data.title}

              <span className="text-xl md:text-2xl font-normal">
                {isExpanded ? "−" : "+"}
              </span>
            </button>
          </div>

          {/* Collapsible Story */}
          {isExpanded && (
            <div
              id="about-us-story"
              className="mt-8"
            >
              <p className="text-[15px] md:text-[18px] leading-[2] text-neutral-600 whitespace-pre-line">
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
