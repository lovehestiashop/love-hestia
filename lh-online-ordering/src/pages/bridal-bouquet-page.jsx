
import { useState, useEffect } from "react";
import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";
import api from "../services/api";
import { homeSettingsService } from "../services/home-settings-service";
import { mediaService } from "../services/media-service";

const BRIDAL_STARTING_PRICE = 1500;

function BridalBouquetPage() {
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [showInspirationModal, setShowInspirationModal] = useState(false);

  const [civilImage, setCivilImage] = useState("");
  const [churchImage, setChurchImage] = useState("");

  // LOAD BRIDAL PHOTOS FROM WORDPRESS
  useEffect(() => {
    let active = true;

    const resolveImageUrl = async (image) => {
      if (!image) return "";

      if (typeof image === "string") {
        const value = image.trim();

        if (!value) return "";

        if (/^https?:\/\//i.test(value)) return value;

        if (value.startsWith("/")) {
          return `https://api.lovehestia.shop${value}`;
        }

        if (/^\d+$/.test(value)) {
          const media = await mediaService.getById(Number(value));
          return media?.source_url || media?.guid?.rendered || "";
        }

        return "";
      }

      if (typeof image === "number") {
        const media = await mediaService.getById(image);
        return media?.source_url || media?.guid?.rendered || "";
      }

      if (typeof image === "object") {
        const directUrl =
          image.source_url ||
          image.url ||
          image.sizes?.large?.source_url ||
          image.sizes?.large ||
          image.sizes?.medium_large?.source_url ||
          image.sizes?.medium_large ||
          image.sizes?.full?.url ||
          image.guid?.rendered;

        if (directUrl) return directUrl;

        const imageId =
          image.ID || image.id || image.attachment_id;

        if (imageId) {
          const media = await mediaService.getById(Number(imageId));
          return media?.source_url || media?.guid?.rendered || "";
        }
      }

      return "";
    };

    const loadWeddingImages = async () => {
      try {
        let pageData;

        // Bridal sample photos are stored in WordPress page 4973.
        try {
          const response = await api.get(
            "/pages/4973?acf_format=standard"
          );

          pageData = response.data;
        } catch (pageError) {
          console.warn(
            "Trying the home settings service instead.",
            pageError
          );

          pageData = await homeSettingsService.getSettings();
        }

        if (!active) return;

        const acf = pageData?.acf || pageData?.meta || pageData || {};

        const civilImageField =
          acf.civil_wedding_sample ??
          acf.civil_wedding_sample_image ??
          acf.civil_wedding_image ??
          acf.civil_wedding_photo;

        const churchImageField =
          acf.church_wedding_sample ??
          acf.church_wedding_sample_image ??
          acf.church_wedding_image ??
          acf.church_wedding_photo;

        const [civilUrl, churchUrl] = await Promise.all([
          resolveImageUrl(civilImageField),
          resolveImageUrl(churchImageField),
        ]);

        if (!active) return;

        setCivilImage(civilUrl);
        setChurchImage(churchUrl);

        if (!civilUrl || !churchUrl) {
          console.error(
            "Bridal sample image fields were not found.",
            {
              pageId: pageData?.id,
              availableFields: Object.keys(acf),
              civilImageField,
              churchImageField,
            }
          );
        }

      } catch (err) {
        console.error(
          "Unable to load bridal sample photos:",
          err
        );
      } finally {
        if (active) setLoadingImages(false);
      }
    };

    loadWeddingImages();

    return () => {
      active = false;
    };
  }, []);

  // SCROLL TO TOP
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  // MINIMUM 3 DAYS NOTICE
  const getMinimumDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // DATE RESTRICTIONS
  const isDateAllowed = (value) => {
    if (!value || value < getMinimumDate()) {
      return false;
    }

    if (value >= "2026-12-19" && value <= "2027-01-08") {
      return false;
    }

    const date = new Date(`${value}T00:00:00`);
    const isSunday = date.getDay() === 0;

    if (isSunday && value !== "2027-02-14") {
      return false;
    }

    return true;
  };

  const handleDateChange = (event) => {
    const value = event.target.value;

    setDateError("");

    if (value && !isDateAllowed(value)) {
      event.target.value = "";

      setDateError(
        value >= "2026-12-19" && value <= "2027-01-08"
          ? "We are unavailable from December 19, 2026 to January 8, 2027."
          : value < getMinimumDate()
          ? "Please allow at least 3 days for your bridal bouquet."
          : "We do not accept Sunday deliveries, except February 14, 2027."
      );
    }
  };

  // SUBMIT BRIDAL INQUIRY
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setDateError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const deliveryDate = formData.get("delivery_date");

    if (!isDateAllowed(deliveryDate)) {
      setDateError("Please select an available delivery date.");
      return;
    }

    const preferredFlowers = formData.get("focal_flower");
    const preferredQuantity = formData.get("focal_quantity") || "";
    const colorPalette = formData.get("color_palette");
    const originalNotes = formData.get("notes") || "";

    const bridalNotes =
      `Wedding bouquet inquiry | ` +
      `Starting price: PHP ${BRIDAL_STARTING_PRICE.toLocaleString("en-PH")} | ` +
      `Starting inclusions: 1 focal flower and 4 different types of fillers | ` +
      `Preferred flowers: ${preferredFlowers} | ` +
      `Preferred quantity: ${preferredQuantity || "Not specified"} | ` +
      `Color palette: ${colorPalette} | ` +
      `Additional notes: ${originalNotes.trim() || "None"}`;

    const inquiryData = new FormData();

    inquiryData.append("website", formData.get("website") || "");
    inquiryData.append("customer_name", formData.get("customer_name"));
    inquiryData.append("customer_number", formData.get("customer_number"));
    inquiryData.append("customer_email", formData.get("customer_email"));
    inquiryData.append("instagram_name", formData.get("instagram_name"));
    inquiryData.append("delivery_date", deliveryDate);
    inquiryData.append("color_palette", colorPalette);
    inquiryData.append("focal_flower", preferredFlowers);
    inquiryData.append("focal_quantity", preferredQuantity);
    inquiryData.append("notes", bridalNotes);

    setLoading(true);

    try {
      const response = await api.post(
        "/love-hestia/v1/custom-inquiries",
        inquiryData,
        { timeout: 30000 }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to submit your inquiry."
        );
      }

      setMessage(
        response.data.message ||
          "Thank you! Your bridal bouquet inquiry has been submitted."
      );

      form.reset();
      setDateError("");
      setShowInspirationModal(true);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#98776f]";

  const labelClass =
    "mb-2 block text-sm font-medium text-neutral-700";

  return (
    <div>
      <HeaderComponent />

      <section className="bg-[#faf9f7] text-neutral-700">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">

          {/* INTRODUCTION */}
          <div className="mb-10 text-center">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#98776f]">
              Love Hestia Bridal Florals
            </p>

            <h1
              className="mb-4 text-4xl font-medium text-neutral-800 md:text-5xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              A Bouquet for Your Forever
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-600">
              Every wedding has its own story. Tell us a little about
              yours, and let us help you find the bouquet that feels
              just right for your day.
            </p>

            {/* PRICING NOTE */}
            <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-neutral-500 md:text-sm">
              A little note on pricing: Final pricing depends on your
              inspiration, preferred flower varieties, and the quantity
              of dried and preserved blooms needed for your bouquet.
            </p>

          </div>

          {/* BRIDAL BOUQUET PHOTO COLLAGE */}
          <div className="mb-12">

            <h2
              className="mb-5 text-center text-2xl font-normal text-neutral-800 md:text-3xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Bridal Bouquet Inspirations
            </h2>

            <div className="overflow-hidden rounded-lg bg-[#eee9e5]">

              {loadingImages ? (
                <div className="flex h-[280px] items-center justify-center text-sm text-neutral-500 md:h-[460px]">
                  Loading bridal bouquet photos...
                </div>
              ) : civilImage && churchImage ? (
                <div className="grid h-[280px] grid-cols-[1.15fr_0.85fr] gap-1 sm:h-[360px] md:h-[460px]">

                  <img
                    src={civilImage}
                    alt="Love Hestia preserved bridal bouquet inspiration"
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />

                  <img
                    src={churchImage}
                    alt="Love Hestia dried and preserved bridal bouquet inspiration"
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />

                </div>
              ) : civilImage || churchImage ? (
                <img
                  src={civilImage || churchImage}
                  alt="Love Hestia bridal bouquet inspiration"
                  loading="eager"
                  decoding="async"
                  className="h-[280px] w-full object-cover sm:h-[360px] md:h-[460px]"
                />
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-neutral-500 md:h-[460px]">
                  Bridal bouquet photos are not available yet.
                </div>
              )}

            </div>

          </div>

          {/* BRIDAL BOUQUET STARTING PRICE */}
          <div className="mb-14 rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">

            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#98776f]">
              Bridal Bouquet Starting Price
            </p>

            <h2 className="mb-5 text-3xl font-medium text-neutral-800 md:text-4xl">
              ₱1,500
            </h2>

            <p className="mb-4 text-sm text-neutral-600">
              Your starting bouquet includes:
            </p>

            <ul className="space-y-3 text-sm leading-relaxed text-neutral-700">

              <li className="flex gap-3">
                <span className="text-[#98776f]">✦</span>
                One main focal flower
              </li>

              <li className="flex gap-3">
                <span className="text-[#98776f]">✦</span>
                Four different types of complementary filler flowers
              </li>

            </ul>

            <p className="mt-6 border-t border-neutral-100 pt-5 text-xs leading-relaxed text-neutral-500">
              The final quotation may vary depending on your
              inspiration photos, preferred flower varieties,
              arrangement size, and the quantity of blooms required.
            </p>

          </div>

          {/* INQUIRY FORM */}
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* CUSTOMER DETAILS */}
            <div>

              <h2 className="mb-6 text-lg font-medium text-neutral-800">
                Your Details
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className={labelClass}>Full name *</label>

                  <input
                    type="text"
                    name="customer_name"
                    className={inputClass}
                    placeholder="Your name"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className={labelClass}>Contact number *</label>

                  <input
                    type="tel"
                    name="customer_number"
                    className={inputClass}
                    placeholder="Your mobile number"
                    required
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email address *</label>

                  <input
                    type="email"
                    name="customer_email"
                    className={inputClass}
                    placeholder="Your email address"
                    required
                    maxLength={150}
                  />
                </div>

                <div>
                  <label className={labelClass}>Instagram username *</label>

                  <input
                    type="text"
                    name="instagram_name"
                    className={inputClass}
                    placeholder="@yourusername"
                    required
                    maxLength={100}
                  />
                </div>

              </div>
            </div>

            {/* BOUQUET PREFERENCES */}
            <div>

              <h2 className="mb-2 text-lg font-medium text-neutral-800">
                Your Bridal Bouquet Preferences
              </h2>

              <p className="mb-6 text-sm text-neutral-500">
                Help us understand the flowers and colors you envision
                for your wedding day.
              </p>

              <div className="space-y-6">

                {/* COLOR PALETTE */}
                <div>
                  <label className={labelClass}>
                    Preferred color palette *
                  </label>

                  <input
                    type="text"
                    name="color_palette"
                    className={inputClass}
                    placeholder="e.g. Ivory, champagne, and blush pink"
                    required
                    maxLength={150}
                  />
                </div>

                {/* PREFERRED FLOWERS */}
                <div>
                  <label className={labelClass}>
                    Preferred focal flower *
                  </label>

                  <select
                    name="focal_flower"
                    className={inputClass}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select your preferred flower
                    </option>

                    <option value="Preserved Roses">
                      Preserved Roses
                    </option>

                    <option value="Preserved Sunflowers">
                      Preserved Sunflowers
                    </option>

                    <option value="Preserved Peonies">
                      Preserved Peonies
                    </option>

                    <option value="Sola Peonies">
                      Sola Peonies
                    </option>

                    <option value="Mixed focal flowers">
                      Mixed focal flowers
                    </option>

                  </select>
                </div>

                {/* FOCAL FLOWER QUANTITY */}
                <div>
                  <label className={labelClass}>
                    How many focal flowers would you prefer?
                  </label>

                  <input
                    type="text"
                    name="focal_quantity"
                    className={inputClass}
                    placeholder="e.g. 3, 5, 7, or your preferred quantity"
                    maxLength={150}
                  />

                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    For a combination of flowers, please list each
                    flower and its quantity in your additional notes.
                  </p>
                </div>

                {/* ADDITIONAL NOTES */}
                <div>
                  <label className={labelClass}>
                    Additional notes
                  </label>

                  <textarea
                    name="notes"
                    rows="4"
                    maxLength={1500}
                    className={inputClass}
                    placeholder="Tell us about your dream bridal bouquet, preferred filler flowers, wrapping, ribbon, or special requests."
                  />
                </div>

                {/* DELIVERY DATE */}
                <div>
                  <label className={labelClass}>
                    Preferred delivery date *
                  </label>

                  <input
                    type="date"
                    name="delivery_date"
                    min={getMinimumDate()}
                    className={inputClass}
                    onChange={handleDateChange}
                    required
                  />

                  {dateError && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {dateError}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* HONEYPOT SPAM PROTECTION */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label>
                Leave this field empty

                <input
                  type="text"
                  name="website"
                  tabIndex="-1"
                  autoComplete="off"
                />
              </label>
            </div>

            {/* SUBMISSION FEEDBACK */}
            {message && (
              <div
                role="status"
                className="rounded-md border border-[#cbd5c0] bg-[#f0f3ed] p-4 text-sm leading-relaxed text-neutral-700"
              >
                {message}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-2 text-center">

              <button
                type="submit"
                disabled={loading}
                className="
                  rounded-full
                  border
                  border-[#98776f]
                  bg-[#98776f]
                  px-8
                  py-3
                  text-sm
                  text-white
                  transition
                  hover:border-[#806159]
                  hover:bg-[#806159]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? "Submitting..." : "Submit Bridal Inquiry"}
              </button>

              <p className="mt-4 text-xs leading-relaxed text-neutral-500">
                Submitting an inquiry does not confirm an order or require
                payment. We'll review your preferences and contact you
                with a personalized quotation.
              </p>

            </div>

          </form>

        </div>
      </section>

      <FooterComponent />

      {/* INSPIRATION PHOTO POPUP */}
      {showInspirationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5"
          role="presentation"
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bridal-modal-title"
            className="w-full max-w-md rounded-xl bg-[#faf9f7] p-7 text-center shadow-xl sm:p-9"
          >

            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#98776f]">
              Thank you for your inquiry
            </p>

            <h2
              id="bridal-modal-title"
              className="mb-4 text-2xl font-medium text-neutral-800"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Let's Bring Your Bridal Vision to Life
            </h2>

            <p className="mb-7 text-sm leading-relaxed text-neutral-600">
              We'd love to see the bouquet you've been dreaming of!
              After submitting your inquiry, please send us your
              inspiration photos through Instagram. Include your
              preferred flower combinations and quantities so we can
              review your vision and prepare a personalized quotation.
            </p>

            <a
              href="https://www.instagram.com/lovehestiaflowers/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowInspirationModal(false)}
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-full
                border
                border-[#98776f]
                bg-[#98776f]
                px-6
                py-3
                text-sm
                text-white
                transition
                hover:bg-[#806159]
              "
            >
              Send Your Inspiration Photos on Instagram
            </a>

            <button
              type="button"
              onClick={() => setShowInspirationModal(false)}
              className="mt-4 px-5 py-2 text-sm text-neutral-500 transition hover:text-neutral-800"
            >
              Maybe later
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default BridalBouquetPage;
