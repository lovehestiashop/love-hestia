import customArrangementImage from "../assets/custom-arrangement.JPG";
import { Link } from "react-router-dom";

function CustomArrangementSectionComponent() {
  return (
    <section className="py-30 bg-[#faf9f7] text-neutral-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
       <div className="h-130 flex items-center justify-center rounded">
          <img
            src={customArrangementImage}
            alt="flower bouquet image"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div>
          <h2 className="text-[42px] mb-5 font-light">Custom Arrangements</h2>
          <p className="text-sm leading-relaxed mb-6">
            We'd love to create a personalized dried-flower arrangement just for
            you. Each design is unique and crafted based on your chosen color
            palette or inspiration photos. Final pricing will depend on the
            flower varieties and arrangement size, depending on stock
            availability.
          </p>
          {/* <Link to="/customize">
            <button className="border border-white px-6 py-2 rounded-full text-sm hover:bg-white hover:text-emerald-800 transition hover:cursor-pointer">
              Custom order process
            </button>
          </Link> */}
        </div>
      </div>
    </section>
  );
}

export default CustomArrangementSectionComponent;
