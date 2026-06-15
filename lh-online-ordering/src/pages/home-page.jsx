import CollectionsSectionComponent from "../components/collections-section";
import CustomArrangementSectionComponent from "../components/custom-arrangements-section";
import FooterComponent from "../components/footer";
import HeroSectionComponent from "../components/hero-section";
import OurStorySectionComponent from "../components/our-story-section";
import workshopImage from "../assets/workshop-image.jpg";
import floristForADay1 from "../assets/florist-for-a-day1.jpg";
import floristForADay2 from "../assets/florist2-op.jpg";
import { Link } from "react-router-dom";

function HomePage() {
  const floristForADayImages = [
    { imgUrl: floristForADay1 },
    { imgUrl: floristForADay2 },
  ];

  return (
    <div className="text-neutral-700 bg-neutral-50">
      {/* HERO SECTION */}
      <HeroSectionComponent />

      {/* COLLECTIONS */}
      <CollectionsSectionComponent />

      {/* CUSTOM ARRANGEMENTS */}
      <CustomArrangementSectionComponent />

      {/* OUR STORY */}
      <OurStorySectionComponent />

      {/* WORKSHOP */}
      <section className="relative py-60 bg-[#d8cbb5] text-white text-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={workshopImage}
            alt="Workshop Image"
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl mb-3">
            Private Dried <br className="sm:hidden" /> Flower Workshop
          </h1>
          <p className="mb-4 text-sm">Birthdays · Bridal Shower · Events</p>
          <Link to="/workshop">
            <button className="border px-6 py-2 rounded-full text-sm hover:bg-white hover:text-neutral-700 transition hover:cursor-pointer">
              Learn more
            </button>
          </Link>
        </div>
      </section>

      {/* FLORIST FOR A DAY */}
<section className="py-16 bg-neutral-50 text-center">
  <h1 className="text-[42px] md:text-[80px] mb-4 whitespace-nowrap">
    Florist for a Day
  </h1>

  <p className="italic text-base md:text-lg mb-10 max-w-2xl mx-auto px-6">
    "There's no wrong way to make a bouquet. If it makes you smile, that's
    all the magic you need."
  </p>

  <div className="max-w-6xl mx-auto">
    <div className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
      {floristForADayImages.map((i) => (
        <div
          key={i.imgUrl}
          className="
            min-w-[85%]
            sm:min-w-[70%]
            md:min-w-[48%]
            lg:min-w-[40%]
            h-[500px]
            snap-center
            flex-shrink-0
          "
        >
          <img
            src={i.imgUrl}
            alt="Florist for a Day Workshop"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      ))}
    </div>
  </div>
</section>

      <FooterComponent />
    </div>
  );
}

export default HomePage;
