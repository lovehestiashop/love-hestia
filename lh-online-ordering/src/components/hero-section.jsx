import { useEffect, useRef, useState } from "react";
import heroImageFallback from "../assets/hero-shot-opt.jpg";
import NavItemsComponent from "./nav-items";

function HeroSectionComponent() {
  const [offsetY, setOffsetY] = useState(0);
  const ticking = useRef(false);

  const [heroImage, setHeroImage] = useState(heroImageFallback);
  const [heroTitle, setHeroTitle] = useState("Love written in flowers");
  const [heroSubtitle, setHeroSubtitle] = useState("Flower Studio");

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const pageRes = await fetch(
          "https://api.lovehestia.shop/wp-json/wp/v2/pages/4973?_fields=acf"
        );

        const pageData = await pageRes.json();

        if (pageData.acf?.hero_title) {
          setHeroTitle(pageData.acf.hero_title);
        }

        if (pageData.acf?.hero_subtitle) {
          setHeroSubtitle(pageData.acf.hero_subtitle);
        }

        if (pageData.acf?.hero_image) {
          const mediaRes = await fetch(
            `https://api.lovehestia.shop/wp-json/wp/v2/media/${pageData.acf.hero_image}`
          );

          const mediaData = await mediaRes.json();

          if (mediaData.source_url) {
            setHeroImage(mediaData.source_url);
          }
        }
      } catch (error) {
        console.error("Failed loading hero content", error);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <section className="relative w-full h-[75vh] md:min-h-screen overflow-hidden">

      {/* Hero Image */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${offsetY * 0.4}px)`,
        }}
      >
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-[120%] object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Navigation */}
      <nav className="absolute text-white top-5 left-1/2 -translate-x-1/2 w-full flex justify-center py-6 z-20">
        <NavItemsComponent />
      </nav>

      {/* Content */}
      <div className="relative z-10 h-[75vh] md:min-h-screen flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-[32px] sm:text-[42px] md:text-[80px] leading-[1.05] mb-3 whitespace-nowrap">
          {heroTitle}
        </h1>

        <p className="tracking-wide text-base md:text-2
