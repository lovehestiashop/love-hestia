import { useEffect, useRef, useState } from "react";
import heroImage from "../assets/hero-shot-opt.jpg";
import NavItemsComponent from "./nav-items";

function HeroSectionComponent() {
  const [offsetY, setOffsetY] = useState(0);
  const ticking = useRef(false);

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

  return (
    <section className="relative w-full h-[75vh] md:min-h-screen overflow-hidden">

      {/* PARALLAX IMAGE */}
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

        <h1 className="text-[52px] md:text-[80px] leading-[1.05] mb-3">
          Love written
          <br />
          in flowers
        </h1>

        <p className="tracking-wide text-base md:text-2xl">
          Flower Studio
        </p>

      </div>
    </section>
  );
}

export default HeroSectionComponent;
