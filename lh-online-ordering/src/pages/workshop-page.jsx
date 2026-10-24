
import { useEffect, useState, forwardRef } from "react";
import axios from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";

const WORDPRESS_API =
  "https://api.lovehestia.shop/wp-json/wp/v2";

const WORDPRESS_REST_ROOT =
  "https://api.lovehestia.shop/wp-json";

const INQUIRY_ENDPOINT =
  `${WORDPRESS_REST_ROOT}/love-hestia/v1/workshop-inquiries`;

const AVAILABILITY_ENDPOINT =
  `${WORDPRESS_REST_ROOT}/love-hestia/v1/workshop-availability`;

const INSTAGRAM_URL =
  "https://www.instagram.com/lovehestiaflowers/";

const INITIAL_INQUIRY = {
  name: "",
  email: "",
  location: "",
  arrangement: "dried-bouquet",
};

const DateButtonInput = forwardRef(
  ({ value, onClick, disabled }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      disabled={disabled}
      className="
        w-full
        border
        border-neutral-300
        bg-white
        p-3
        text-left
        transition
        hover:bg-neutral-50
        disabled:cursor-not-allowed
        disabled:bg-neutral-100
        disabled:text-neutral-500
      "
    >
      {value || "Select preferred date & time"}
    </button>
  )
);

DateButtonInput.displayName = "DateButtonInput";

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function WorkshopPage() {
  const [data, setData] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(false);

  // Both sections remain collapsed when the page first opens.
  const [pricingOpen, setPricingOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [blockedDates, setBlockedDates] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] =
    useState(true);
  const [availabilityError, setAvailabilityError] =
    useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [inquiry, setInquiry] = useState(INITIAL_INQUIRY);

  // LOAD WORKSHOP CONTENT AND UP TO SIX PHOTOS.
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await axios.get(
          `${WORDPRESS_API}/pages/4973`,
          {
            params: {
              _fields: "acf",
            },
          }
        );

        const acf = response.data?.acf;

        if (!acf) {
          throw new Error(
            "Workshop content was not returned."
          );
        }

        const imageFields = [
          acf.workshop_image_1,
          acf.workshop_image_2,
          acf.workshop_image_3,
          acf.workshop_image_4,
          acf.workshop_image_5,
          acf.workshop_image_6,
        ].filter(Boolean);

        const imageResults = await Promise.all(
          imageFields.map(async (imageValue) => {
            if (
              typeof imageValue === "string" &&
              /^https?:\/\//i.test(imageValue)
            ) {
              return imageValue;
            }

            const imageId =
              typeof imageValue === "object"
                ? imageValue.ID ??
                  imageValue.id
                : imageValue;

            if (!imageId) return null;

            try {
              const imageResponse = await axios.get(
                `${WORDPRESS_API}/media/${imageId}`,
                {
                  params: {
                    _fields: "source_url,media_details",
                  },
                }
              );

              const media = imageResponse.data;
              const sizes =
                media.media_details?.sizes || {};

              return (
                sizes["1536x1536"]?.source_url ||
                sizes.large?.source_url ||
                sizes.medium_large?.source_url ||
                media.source_url ||
                null
              );
            } catch (imageError) {
              console.error(
                "Failed to load workshop photo:",
                imageError
              );

              return null;
            }
          })
        );

        if (cancelled) return;

        setData({
          title: acf.workshop_title || "Private Workshop",
          pricing: acf.workshop_pricing || "",
          details: acf.workshop_details || "",
          images: imageResults.filter(Boolean),
        });

        setCurrentImage(0);
      } catch (error) {
        console.error(
          "Failed to load workshop page:",
          error
        );

        if (!cancelled) {
          setPageError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // LOAD DATES ALREADY CONFIRMED AND PAID IN WORDPRESS.
  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      try {
        const response = await axios.get(
          AVAILABILITY_ENDPOINT
        );

        const dates = response.data?.blockedDates;

        if (!Array.isArray(dates)) {
          throw new Error(
            "The workshop availability response is invalid."
          );
        }

        if (!cancelled) {
          setBlockedDates(dates);
          setAvailabilityError(false);
        }
      } catch (error) {
        console.error(
          "Could not load workshop availability:",
          error
        );

        if (!cancelled) {
          setAvailabilityError(true);
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  // AUTOMATIC SLIDESHOW: CHANGE PHOTOS EVERY FIVE SECONDS.
  useEffect(() => {
    const imageCount = data?.images?.length ?? 0;

    if (imageCount < 2) return;

    const interval = setInterval(() => {
      setCurrentImage(
        (previous) => (previous + 1) % imageCount
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.images?.length]);

  // UPDATE FORM FIELDS.
  const handleInquiryChange = (event) => {
    const { name, value } = event.target;

    setInquiry((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SUBMIT INQUIRY AND SHOW THE CONFIRMATION POPUP.
  const handleInquirySubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const name = inquiry.name.trim();
    const email = inquiry.email.trim();
    const location = inquiry.location.trim();

    if (
      !name ||
      !email ||
      !location ||
      !inquiry.arrangement
    ) {
      setSubmitError(
        "Please complete all required fields before submitting."
      );
      return;
    }

    if (availabilityLoading) {
      setSubmitError(
        "Please wait while we check the available dates."
      );
      return;
    }

    if (availabilityError) {
      setSubmitError(
        "We couldn't check available dates. Please try again later or contact us on Instagram."
      );
      return;
    }

    if (!selectedDate) {
      setSubmitError(
        "Please select your preferred date and time."
      );
      return;
    }

    const preferredDate = getDateKey(selectedDate);

    if (blockedDates.includes(preferredDate)) {
      setSubmitError(
        "That date is already booked. Please choose another date."
      );
      return;
    }

    const websiteField =
      event.currentTarget.elements.website?.value || "";

    const preferredTime = selectedDate.toLocaleTimeString(
      "en-PH",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );

    setSubmitting(true);
    setSubmitError("");

    try {
      await axios.post(INQUIRY_ENDPOINT, {
        name,
        email,
        location,
        arrangement: inquiry.arrangement,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        website: websiteField,
      });

      // Keep the form visible and reset the values after success.
      setInquiry({ ...INITIAL_INQUIRY });
      setSelectedDate(null);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        "Workshop inquiry submission failed:",
        error
      );

      setSubmitError(
        error.response?.data?.message ||
          "We couldn't save your inquiry. Please try again or contact us on Instagram."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-[#faf9f7]">
      <HeaderComponent />

      {/* SUCCESS POPUP */}
      {showSuccessModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            py-6
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="workshop-success-title"
        >
          <div
            className="
              relative
              w-full
              max-w-md
              bg-[#faf9f7]
              p-7
              text-center
              shadow-xl
              md:p-10
            "
          >
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              aria-label="Close confirmation popup"
              className="
                absolute
                right-4
                top-3
                text-2xl
                text-neutral-500
                hover:text-neutral-800
              "
            >
              ×
            </button>

            <div
              className="mb-4 text-3xl text-neutral-700"
              aria-hidden="true"
            >
              ✓
            </div>

            <h2
              id="workshop-success-title"
              className="mb-4 text-2xl font-medium text-neutral-800"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Inquiry Submitted!
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-neutral-600">
              Thank you for your interest in a Love Hestia
              floral workshop! Your inquiry has been submitted
              successfully. Please message us on Instagram to
              discuss your preferred color palette and payment
              details so we can finalize your workshop booking.
            </p>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block
                w-full
                bg-neutral-800
                px-5
                py-3
                text-sm
                font-medium
                uppercase
                tracking-widest
                text-white
                transition
                hover:bg-neutral-700
              "
            >
              Contact Us on Instagram
            </a>

            <p className="mt-4 text-xs leading-relaxed text-neutral-500">
              Your preferred date is not reserved until Love
              Hestia confirms your booking and payment.
            </p>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="
                mt-4
                text-sm
                text-neutral-600
                underline
                underline-offset-4
                hover:text-neutral-900
              "
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section className="bg-[#faf9f7] text-neutral-700">

        {/* WORKSHOP PHOTO SLIDESHOW — NO ARROWS */}
        <div className="mx-auto max-w-7xl px-4 pt-12">
          {loading ? (
            <div
              className="
                flex
                min-h-[350px]
                items-center
                justify-center
                text-lg
                font-medium
                text-neutral-600
                md:min-h-[700px]
              "
              role="status"
            >
              Loading workshop photos...
            </div>
          ) : pageError ? (
            <p
              className="py-24 text-center text-neutral-600"
              role="alert"
            >
              We couldn't load the workshop page.
              Please refresh and try again.
            </p>
          ) : data?.images?.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-xl">
                <img
                  key={data.images[currentImage]}
                  src={data.images[currentImage]}
                  alt={`Love Hestia workshop photo ${currentImage + 1}`}
                  fetchPriority="high"
                  decoding="async"
                  className="
                    h-[350px]
                    w-full
                    object-cover
                    md:h-[700px]
                  "
                />
              </div>

              {data.images.length > 1 && (
                <div className="mt-6 flex justify-center gap-3">
                  {data.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImage(index)}
                      aria-label={`Show workshop photo ${index + 1}`}
                      aria-current={
                        currentImage === index
                          ? "true"
                          : undefined
                      }
                      className={`
                        h-3
                        w-3
                        rounded-full
                        transition-colors
                        ${
                          currentImage === index
                            ? "bg-black"
                            : "bg-gray-300"
                        }
                      `}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="py-24 text-center text-neutral-600">
              No workshop photos are available yet.
            </p>
          )}
        </div>

        {/* WORKSHOP CONTENT */}
        {!loading && !pageError && data && (
          <div className="mx-auto max-w-4xl px-6 py-20">

            {/* PAGE TITLE */}
            <h1
              className="mb-8 text-center text-4xl font-normal text-neutral-800 md:text-5xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {data.title}
            </h1>

            {/* FLORAL WORKSHOP INVITATION — DIRECTLY BELOW TITLE */}
            <div className="mb-14 px-1">
              <div
                className="
                  border
                  border-[#e8dfd5]
                  bg-white
                  px-6
                  py-10
                  text-center
                  md:px-12
                  md:py-14
                "
              >
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
                  The Love Hestia Experience
                </p>

                <h2
                  className="mb-5 text-3xl font-normal text-neutral-800 md:text-5xl"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Create Something Beautiful
                </h2>

                <p className="mx-auto mb-10 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
                  Discover the beauty of dried and preserved
                  flowers, explore their unique characteristics,
                  and create your own floral arrangement with
                  hands-on guidance from our florist.
                </p>

                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 text-left md:grid-cols-2">

                  {/* LEARN ABOUT THE FLOWERS */}
                  <div className="border-t border-[#e8dfd5] pt-5">
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                      01
                    </span>

                    <h3
                      className="mb-2 mt-3 text-2xl font-normal text-neutral-800"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      Discover the Flowers
                    </h3>

                    <p className="text-sm leading-6 text-neutral-600">
                      Learn about dried and preserved flowers,
                      understand their differences, and discover
                      how to care for your floral creations.
                    </p>
                  </div>

                  {/* HANDS-ON FLORAL ARRANGING */}
                  <div className="border-t border-[#e8dfd5] pt-5">
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                      02
                    </span>

                    <h3
                      className="mb-2 mt-3 text-2xl font-normal text-neutral-800"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      Create Your Own Arrangement
                    </h3>

                    <p className="text-sm leading-6 text-neutral-600">
                      Enjoy a hands-on floral experience and
                      bring your arrangement to life with
                      assistance and guidance from our florist.
                    </p>
                  </div>
                </div>

            
              </div>
            </div>

            {/* COLLAPSIBLE PRICING — CLOSED BY DEFAULT */}
            <div className="mb-6 border-b border-neutral-200">
              <button
                type="button"
                onClick={() =>
                  setPricingOpen((open) => !open)
                }
                aria-expanded={pricingOpen}
                aria-controls="workshop-pricing-content"
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  py-4
                  text-left
                  text-2xl
                  font-medium
                  text-neutral-800
                "
              >
                <span>Pricing</span>

                <span
                  className="ml-4 text-2xl font-normal"
                  aria-hidden="true"
                >
                  {pricingOpen ? "−" : "+"}
                </span>
              </button>

              {pricingOpen && (
                <div
                  id="workshop-pricing-content"
                  className="
                    pb-6
                    text-base
                    leading-relaxed
                    [&_ul]:list-disc
                    [&_ul]:pl-6
                    [&_ul]:space-y-2
                  "
                  dangerouslySetInnerHTML={{
                    __html: data.pricing,
                  }}
                />
              )}
            </div>

            {/* COLLAPSIBLE WORKSHOP DETAILS — CLOSED BY DEFAULT */}
            <div className="mb-6 border-b border-neutral-200">
              <button
                type="button"
                onClick={() =>
                  setDetailsOpen((open) => !open)
                }
                aria-expanded={detailsOpen}
                aria-controls="workshop-details-content"
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  py-4
                  text-left
                  text-2xl
                  font-medium
                  text-neutral-800
                "
              >
                <span>Workshop Details</span>

                <span
                  className="ml-4 text-2xl font-normal"
                  aria-hidden="true"
                >
                  {detailsOpen ? "−" : "+"}
                </span>
              </button>

              {detailsOpen && (
                <div
                  id="workshop-details-content"
                  className="
                    pb-6
                    text-base
                    leading-relaxed
                    [&_ul]:list-disc
                    [&_ul]:pl-6
                    [&_ul]:space-y-2
                  "
                  dangerouslySetInnerHTML={{
                    __html: data.details,
                  }}
                />
              )}
            </div>

            {/* WORKSHOP INQUIRY FORM */}
            <div
              id="workshop-inquiry"
              className="
                mt-12
                border
                border-neutral-200
                bg-white
                p-6
                md:p-10
              "
            >
              <h2
                className="mb-3 text-center text-2xl font-medium"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Workshop Inquiry
              </h2>

              <p className="mx-auto mb-8 max-w-xl text-center text-sm leading-relaxed text-neutral-600">
                Complete all fields to send your inquiry.
                Choose your preferred date and time, then contact
                us on Instagram to discuss your color palette and
                payment details. Your date is not reserved until
                we confirm your booking and receive payment.
              </p>

              <form
                onSubmit={handleInquirySubmit}
                className="space-y-5"
              >

                {/* NAME — REQUIRED */}
                <div>
                  <label
                    htmlFor="workshop-name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Name *
                  </label>

                  <input
                    id="workshop-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={inquiry.name}
                    onChange={handleInquiryChange}
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    maxLength={120}
                    className="
                      w-full
                      border
                      border-neutral-300
                      bg-white
                      p-3
                      outline-none
                      focus:border-neutral-600
                    "
                  />
                </div>

                {/* EMAIL — REQUIRED */}
                <div>
                  <label
                    htmlFor="workshop-email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email address *
                  </label>

                  <input
                    id="workshop-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={inquiry.email}
                    onChange={handleInquiryChange}
                    placeholder="Enter your email address"
                    required
                    maxLength={254}
                    className="
                      w-full
                      border
                      border-neutral-300
                      bg-white
                      p-3
                      outline-none
                      focus:border-neutral-600
                    "
                  />
                </div>

                {/* LOCATION — REQUIRED */}
                <div>
                  <label
                    htmlFor="workshop-location"
                    className="mb-2 block text-sm font-medium"
                  >
                    Location *
                  </label>

                  <input
                    id="workshop-location"
                    name="location"
                    type="text"
                    autoComplete="street-address"
                    value={inquiry.location}
                    onChange={handleInquiryChange}
                    placeholder="Enter your city or event location"
                    required
                    minLength={2}
                    maxLength={250}
                    className="
                      w-full
                      border
                      border-neutral-300
                      bg-white
                      p-3
                      outline-none
                      focus:border-neutral-600
                    "
                  />
                </div>

                {/* ARRANGEMENT TYPE AND PRICE — REQUIRED */}
                <div>
                  <label
                    htmlFor="workshop-arrangement"
                    className="mb-2 block text-sm font-medium"
                  >
                    Type of arrangement *
                  </label>

                  <select
                    id="workshop-arrangement"
                    name="arrangement"
                    value={inquiry.arrangement}
                    onChange={handleInquiryChange}
                    required
                    className="
                      w-full
                      border
                      border-neutral-300
                      bg-white
                      p-3
                      outline-none
                      focus:border-neutral-600
                    "
                  >
                    <option value="dried-bouquet">
                      Dried flower bouquet arrangement — ₱1,300 per participant
                    </option>

                    <option value="preserved-dome">
                      Preserved flower dome arrangement — ₱1,600 per participant
                    </option>
                  </select>

                  <p className="mt-2 text-xs text-neutral-500">
                    A minimum of 5 participants is required.
                  </p>
                </div>

                {/* PREFERRED DATE AND TIME — REQUIRED */}
                <div>
                  <label
                    htmlFor="workshop-date"
                    className="mb-2 block text-sm font-medium"
                  >
                    Preferred date and time *
                  </label>

                  <DatePicker
                    id="workshop-date"
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setSubmitError("");
                    }}
                    showTimeSelect
                    timeFormat="h:mm aa"
                    timeIntervals={30}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={today}
                    filterDate={(date) =>
                      !blockedDates.includes(getDateKey(date))
                    }
                    disabled={
                      availabilityLoading ||
                      availabilityError
                    }
                    required
                    withPortal
                    customInput={<DateButtonInput />}
                  />

                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    {availabilityLoading
                      ? "Checking available dates..."
                      : availabilityError
                      ? "Available dates could not be loaded. Please try again later or contact us on Instagram."
                      : "Dates already confirmed and paid are unavailable. Submitting this form does not reserve your preferred date."}
                  </p>
                </div>

                {/* HIDDEN ANTI-SPAM FIELD */}
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    left-[-10000px]
                    top-auto
                    h-px
                    w-px
                    overflow-hidden
                  "
                >
                  <label htmlFor="workshop-website">
                    Leave this field empty
                  </label>

                  <input
                    id="workshop-website"
                    name="website"
                    type="text"
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                {/* FORM ERROR */}
                {submitError && (
                  <p
                    className="text-sm text-red-700"
                    role="alert"
                  >
                    {submitError}
                  </p>
                )}

                {/* SUBMIT — NO PAYMENT */}
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    availabilityLoading ||
                    availabilityError
                  }
                  className={`
                    w-full
                    border
                    px-6
                    py-3
                    text-sm
                    font-medium
                    uppercase
                    tracking-widest
                    text-white
                    transition
                    ${
                      submitting ||
                      availabilityLoading ||
                      availabilityError
                        ? "cursor-not-allowed border-neutral-400 bg-neutral-400"
                        : "border-neutral-800 bg-neutral-800 hover:bg-neutral-700"
                    }
                  `}
                >
                  {submitting
                    ? "Submitting inquiry..."
                    : "Submit Workshop Inquiry"}
                </button>

                <p className="text-center text-xs leading-relaxed text-neutral-500">
                  After submitting, please message us on Instagram
                  @lovehestiaflowers to discuss your preferred color
                  palette and payment details. No payment is collected
                  through this form.
                </p>
              </form>
            </div>

            {/* CONTACT US */}
            <div className="mt-20 text-center">
              <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-neutral-600">
                Let's plan your workshop together.
              </p>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block
                  border
                  border-neutral-800
                  px-8
                  py-3
                  tracking-wide
                  text-neutral-800
                  transition-all
                  duration-300
                  hover:bg-neutral-800
                  hover:text-white
                "
              >
                Contact Us
              </a>
            </div>

          </div>
        )}
      </section>

      <FooterComponent />
    </div>
  );
}

export default WorkshopPage;
