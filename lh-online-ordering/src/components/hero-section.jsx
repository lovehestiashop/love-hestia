import { useEffect, useRef, useState } from "react";
import axios from "axios";

function HeroSectionComponent() {
  const [offsetY, setOffsetY] = useState(0);
  const [heroData, setHeroData] = useState(null);

  const ticking = useRef(false);

  useEffect(() => {
    axios
      .get(
        "https://api.lovehestia.shop/wp-json/wp/v2/pages/4973?_fields=acf"
      )
      .then(async (res) => {
        const acf = res.data.acf;

        const mediaRes = await axios.get(
          `https://api.lovehestia.shop/wp-json/wp/v2/media/${acf.hero_image}`
        );

        setHeroData({
          image: mediaRes.data.source_url,
          title: acf.hero_title,
          subtitle: acf.hero_subtitle,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setOffsetY(window.scrollY);
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  if (!heroData) {
    return null;
  }

  return (
    <section className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden">
      {/* Hero Image */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${offsetY * 0.25}px)`,
        }}
      >
        <img
          src={heroData.image}
          alt={heroData.title}
          className="w-full h-[110%] object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-[36px] sm:text-[56px] md:text-[88px] font-light tracking-tight leading-[0.95] mb-4">
  {heroData.title}
</h1>
        <p className="text-base md:text-2xl tracking-wide">
          {heroData.subtitle}
        </p>
      </div>
    </section>
  );
}

export default HeroSectionComponent;
