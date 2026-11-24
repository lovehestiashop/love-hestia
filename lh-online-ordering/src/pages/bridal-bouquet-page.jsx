
import { useState, useEffect } from "react";
import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";
import api from "../services/api";
import { homeSettingsService } from "../services/home-settings-service";
import { mediaService } from "../services/media-service";

function BridalBouquetPage() {
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [selectedWedding, setSelectedWedding] = useState("");
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
          image.sizes?.large ||
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

        // Bridal photos are stored in WordPress page 4973.
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

  const weddingOptions = {
    civil: {
      label: "Civil Wedding",
      price: 1500,
      image: civilImage,
    },
    church: {
      label: "Church Wedding",
      price: 3500,
      image: churchImage,
    },
  };

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

    if (!selectedWedding) {
      setError("Please select your wedding style.");
      return;
    }

    const deliveryDate = formData.get("delivery_date");

    if (!isDateAllowed(deliveryDate)) {
      setDateError("Please select an available delivery date.");
      return;
    }

    const wedding = weddingOptions[selectedWedding];

    const originalNotes = formData.get("notes") || "";

    const bridalNotes =
      `Wedding type: ${wedding.label} | ` +
      `Starting price: PHP ${wedding.price.toLocaleString("en-PH")} | ` +
      `Additional notes: ${originalNotes.trim() || "None"}`;

    const inquiryData = new FormData();

    inquiryData.append("website", formData.get("website") || "");
    inquiryData.append("customer_name", formData.get("customer_name"));
    inquiryData.append("customer_number", formData.get("customer_number"));
    inquiryData.append("customer_email", formData.get("customer_email"));
    inquiryData.append("instagram_name", formData.get("instagram_name"));
    inquiryData.append("delivery_date", deliveryDate);
    inquiryData.append("color_palette", formData.get("color_palette"));
    inquiryData.append("focal_flower", formData.get("focal_flower"));

    inquiryData.append(
      "focal_quantity",
      formData.get("focal_quantity") || ""
    );

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
      setSelectedWedding("");
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
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

          {/* INTRODUCTION */}
          <div className="mb-12 text-center">
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
          </div>

          {/* PROCESS - HIDDEN ON MOBILE */}
          <div className="mb-10 hidden gap-6 border-y border-neutral-200 py-8 sm:grid sm:grid-cols-3">

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#98776f]">
                01
              </p>

              <h3 className="mb-2 text-sm font-semibold">
                Choose your bouquet
              </h3>

              <p className="text-sm leading-relaxed text-neutral-500">
                Select your wedding style and share your floral preferences.
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#98776f]">
                02
              </p>

              <h3 className="mb-2 text-sm font-semibold">
                Receive your quotation
              </h3>

              <p className="text-sm leading-relaxed text-neutral-500">
                We'll review your selections and send you a proposed design
                and price.
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#98776f]">
                03
              </p>

              <h3 className="mb-2 text-sm font-semibold">
                Approve your bouquet
              </h3>

              <p className="text-sm leading-relaxed text-neutral-500">
                Once approved, we'll guide you through the ordering process.
              </p>
            </div>

          </div>

          {/* WEDDING STYLE SELECTION */}
          <div className="mb-14">

            <h2 className="mb-2 text-lg font-medium text-neutral-800">
              Choose Your Wedding Style
            </h2>

            <p className="mb-6 text-sm text-neutral-500">
              Select the type of wedding bouquet you'd like us to create.
            </p>

            {/* TWO COLUMNS ON MOBILE AND DESKTOP */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">

              {Object.entries(weddingOptions).map(([key, wedding]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedWedding(key)}
                  aria-pressed={selectedWedding === key}
                  className={`
                    group min-w-0 overflow-hidden rounded-lg border-2 bg-white text-left
                    transition-all duration-300
                    ${
                      selectedWedding === key
                        ? "border-[#98776f] shadow-md"
                        : "border-neutral-200 hover:border-[#c3a59d]"
                    }
                  `}
                >

                  {/* IMAGE - LARGER ON MOBILE */}
                  <div className="relative h-[175px] bg-[#eee9e5] sm:h-[190px] md:h-[250px]">

                    {loadingImages ? (
                      <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                        Loading...
                      </div>
                    ) : wedding.image ? (
                      <img
                        src={wedding.image}
                        alt={`${wedding.label} bridal bouquet sample`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        onError={() => {
                          if (key === "civil") {
                            setCivilImage("");
                          } else {
                            setChurchImage("");
                          }
                        }}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-500">
                        <span className="text-2xl">✿</span>
                        <span className="text-center text-[10px] sm:text-xs">
                          Photo not yet available
                        </span>
                      </div>
                    )}

                    {selectedWedding === key && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#98776f] text-sm text-white sm:right-3 sm:top-3 sm:h-7 sm:w-7">
                        ✓
                      </div>
                    )}

                  </div>

                  {/* CARD DETAILS */}
                  <div className="p-3 sm:p-4 md:p-5">

                    <div className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">

                      <h3 className="text-xs font-medium leading-tight text-neutral-800 sm:text-base">
                        {wedding.label}
                      </h3>

                      <span
                        className={`text-[9px] sm:text-xs ${
                          selectedWedding === key
                            ? "text-[#98776f]"
                            : "text-neutral-400"
                        }`}
                      >
                        {selectedWedding === key ? "Selected" : "Select"}
                      </span>

                    </div>

                    <p className="mt-3 text-[9px] uppercase tracking-wider text-neutral-500 sm:text-xs">
                      Starting price
                    </p>

                    <p className="mt-1 text-lg font-medium text-neutral-800 sm:text-2xl">
                      ₱{wedding.price.toLocaleString("en-PH")}
                    </p>

                  </div>

                </button>
              ))}

            </div>

            {!selectedWedding && (
              <p className="mt-4 text-xs text-neutral-500">
                Please select one wedding style to continue.
              </p>
            )}

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

                <div>
                  <label className={labelClass}>
                    Preferred flowers *
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
                  </select>
                </div>

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
                    For a combination of flowers, please list each flower
                    and quantity in your additional notes.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Additional notes
                  </label>

                  <textarea
                    name="notes"
                    rows="4"
                    maxLength={1500}
                    className={inputClass}
                    placeholder="Tell us more about your dream bridal bouquet, preferred wrapping, ribbon, flower combinations, or any special requests."
                  />
                </div>

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
                className="rounded-full border border-[#98776f] bg-[#98776f] px-8 py-3 text-sm text-white transition hover:border-[#806159] hover:bg-[#806159] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Bridal Inquiry"}
              </button>

              <p className="mt-4 text-xs leading-relaxed text-neutral-500">
                Submitting an inquiry does not confirm an order or require
                payment. We'll review your preferences and contact you
                with a quotation.
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
              Have a bridal inspiration photo?
            </h2>

            <p className="mb-7 text-sm leading-relaxed text-neutral-600">
              We'd love to see the bouquet you've been dreaming of!
              Send us your inspiration photos through Instagram to
              help us understand your vision.
            </p>

            <a
              href="https://www.instagram.com/lovehestiaflowers/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowInspirationModal(false)}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#98776f] bg-[#98776f] px-6 py-3 text-sm text-white transition hover:bg-[#806159]"
            >
              Send your inspiration on Instagram
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
