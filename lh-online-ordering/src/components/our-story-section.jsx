function OurStorySectionComponent() {
  const data = {
    image: "/Our story.jpeg",
    title: "Our Story",
    text: `Love Hestia began in 2022, born from healing, hope, and a renewed sense of purpose.
Like many, the journey was shaped by the uncertainty of the pandemic. In the quiet stillness that followed, dried flowers became a new source of comfort and creativity. With no background in floral design, the very first bouquet I created was sold right away. That small moment sparked something much bigger—a path that felt unexpected but meant to be.

What started as a small, comforting hobby slowly grew into a passion and eventually a business. From offering locally sourced dried flowers, Love Hestia has expanded into creating premium preserved blooms that can last for years with proper care.

Every arrangement is crafted with intention, care, and heart, perfect for gifting or adding warmth to any space. Today, Love Hestia also offers dried flower workshops, teaching others how to create pieces they can proudly take home.
Through every bouquet and every workshop, the mission remains the same: to share joy, creativity, and a little warmth, one flower at a time.`,
  };

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 px-6 items-center">

        <div className="order-1 md:order-2">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-[350px] md:h-[450px] object-cover rounded-lg"
          />
        </div>

        <div className="order-2 md:order-1">
         <h2
  className="
    text-[30px]
    md:text-[42px]
    mb-8
    font-semibold
    text-neutral-700
    leading-none
  "
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
            {data.title}
          </h2>

          <p
  className="
    text-[15px]
    md:text-[18px]
    leading-[2]
    text-neutral-600
    whitespace-pre-line
  "
>
            {data.text}
          </p>
        </div>

      </div>
    </section>
  );
}

export default OurStorySectionComponent;
