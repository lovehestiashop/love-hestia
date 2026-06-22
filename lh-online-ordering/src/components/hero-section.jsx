import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { homeSettingsService } from "../services/home-settings-service";
import { mediaService } from "../services/media-service";

function HeroSectionComponent() {
  const navigate = useNavigate();

  const [offsetY, setOffsetY] = useState(0);
  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [slides, setSlides] = useState([]);

  const ticking = useRef(false);

  // LOAD HERO DATA
  useEffect(() => {
    async function loadHero() {
      try {
        const settings =
          await homeSettingsService.getSettings();

        const image1 =
          await mediaService.getById(
            settings.hero_slide_1_image
          );

        const image2 =
          await mediaService.getById(
            settings.hero_slide_2_image
          );

        const image3 =
          await mediaService.getById(
            settings.hero_slide_3_image
          );

        setSlides([
          {
            image: image1.source_url,
            title:
              settings.hero_slide_1_title,
            subtitle:
              settings.hero_slide_1_subtitle,
            buttonText:
              settings.hero_slide_1_button_text,
            buttonLink:
              settings.hero_slide_1_button_link,
          },

          {
            image: image2.source_url,
            title:
              settings.hero_slide_2_title,
            subtitle:
              settings.hero_slide_2_subtitle,
            buttonText:
              settings.hero_slide_2_button_text,
            buttonLink:
              settings.hero_slide_2_button_link,
          },

          {
            image: image3.source_url,
            title:
              settings.hero_slide_3_title,
            subtitle:
              settings.hero_slide_3_subtitle,
            buttonText:
              settings.hero_slide_3_button_text,
            buttonLink:
              settings.hero_slide_3_button_link,
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    }

    loadHero();
  }, []);

  // PARALLAX
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

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // AUTOPLAY
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1
          ? 0
          : prev + 1
      );
    }, 5000);

    return () =>
      clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide];

const handleButtonClick = () => {
  if (!slide.buttonLink) return;

  if (
    slide.buttonLink.startsWith("http://") ||
    slide.buttonLink.startsWith("https://")
  ) {
    window.open(
      slide.buttonLink,
      "_blank",
      "noopener,noreferrer"
    );
  } else {
    navigate(slide.buttonLink);
  }
};
  return (
    <section className="relative w-full h-[65vh] md:h-[70vh] overflow-hidden">
      {/* BACKGROUND IMAGES */}

      {slides.map((item, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity:
              currentSlide === index
                ? 1
                : 0,
            transform: `translateY(${
              offsetY * 0.25
            }px)`,
          }}
        >
         <img
  src={item.image}
  alt={item.title}
  loading={
    index === 0
      ? "eager"
      : "lazy"
  }
  className="w-full h-[110%] object-cover"
  style={{
    objectPosition: "center 20%",
  }}
/>
        </div>
      ))}

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-black/40"></div>

      {/* CONTENT */}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <h1
          className="
            text-[42px]
            sm:text-[60px]
            md:text-[72px]
            leading-[1]
            mb-6
          "
          style={{
            fontFamily:
              "'Cormorant Garamond', serif",
            fontWeight: 300,
          }}
        >
          {slide.title}
        </h1>

  <p
  className="
    max-w-2xl
    text-[16px]
    md:text-[24px]
    text-white/95
    mb-8
  "
  style={{
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 300,
    lineHeight: "1.8",
  }}
>
          {slide.subtitle}
        </p>

        {slide.buttonText && (
          <button
            onClick={
              handleButtonClick
            }
            className="
              bg-white/95
              text-[#5f5a55]
              px-8
              py-4
              rounded-full
              uppercase
              tracking-[2px]
              text-[12px]
              hover:bg-white
              transition
            "
          >
            {slide.buttonText}
          </button>
        )}

      {/* DOTS */}

<div
  className="
    absolute
    bottom-6
    left-1/2
    -translate-x-1/2
    flex
    gap-4
    z-20
  "
>
          {slides.map(
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentSlide(
                    index
                  )
                }
                className={`
                  w-3
                  h-3
                  rounded-full
                  transition-all
                  ${
                    currentSlide ===
                    index
                      ? "bg-white scale-125"
                      : "bg-white/40"
                  }
                `}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSectionComponent;
