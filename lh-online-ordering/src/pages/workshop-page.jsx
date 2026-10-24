
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

const DateButtonInput = forwardRef(
  ({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="
        w-full
        border
        border-neutral-300
        bg-white
        p-3
        text-left
        transition
        hover:bg-neutral-50
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

  const [blockedDates, setBlockedDates] = useState([]);
  const [availabilityError, setAvailabilityError] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    location: "",
    arrangement: "dried-bouquet",
  });

  // Load workshop text and up to six photos from WordPress.
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await axios.get(
          `${WORDPRESS_API}/pages/4973`,
          {
            params: { _fields: "acf" },
          }
        );

        const acf = response.data?.acf;

        if (!acf) {
          throw new Error("Workshop content was not returned.");
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
                ? imageValue.ID ?? imageValue.id
                : imageValue;

            if (!imageId) return null;

            try {
              const mediaResponse = await axios.get(
                `${WORDPRESS_API}/media/${imageId}`,
                {
                  params: {
                    _fields: "source_url,media_details",
                  },
                }
              );

              const media = mediaResponse.data;
              const sizes = media.media_details?.sizes || {};

              return (
                sizes["1536x1536"]?.source_url ||
                sizes.large?.source_url ||
                sizes.medium_large?.source_url ||
                media.source_url ||
                null
              );
            } catch (imageError) {
              console.error("Failed to load workshop photo:", imageError);
              return null;
            }
          })
        );

        if (cancelled) return;

        setData({
          title: acf.workshop_title || "Workshop",
          pricing: acf.workshop_pricing || "",
          details: acf.workshop_details || "",
          howToBook: acf.how_to_book || "",
          images: imageResults.filter(Boolean),
        });
      } catch (error) {
        console.error("Failed to load workshop page:", error);

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

  // Load dates already blocked by confirmed, paid workshops.
  // This endpoint will be added to WordPress in the next step.
  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      try {
        const response = await axios.get(AVAILABILITY_ENDPOINT);

        if (!cancelled) {
          const dates = response.data?.blockedDates;

          setBlockedDates(Array.isArray(dates) ? dates : []);
          setAvailabilityError(false);
        }
      } catch (error) {
        console.warn("Workshop availability is not available yet:", error);

        if (!cancelled) {
          setAvailabilityError(true);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  // Automatically advance the slideshow every five seconds.
  useEffect(() => {
    const imageCount = data?.images?.length ?? 0;

    if (imageCount < 2) return;

    const interval = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % imageCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.images?.length]);

  const handleInquiryChange = (event) => {
    const { name, value } = event.target;

    setInquiry((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleInquirySubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    if (!selectedDate) {
      setSubmitError("Please select your preferred date and time.");
      return;
    }

    const preferredDate = getDateKey(selectedDate);

    // Immediate client-side check. WordPress must also check this
    // server-side to prevent duplicate confirmed bookings.
    if (blockedDates.includes(preferredDate)) {
      setSubmitError(
        "That date is unavailable. Please choose another date."
      );
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const preferredTime = selectedDate.toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    try {
      await axios.post(INQUIRY_ENDPOINT, {
        name: inquiry.name.trim(),
        email: inquiry.email.trim(),
        location: inquiry.location.trim(),
        arrangement: inquiry.arrangement,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        website: "",
      });

      // Show the Instagram contact option only after WordPress
      // confirms that the inquiry was successfully saved.
      setSubmitted(true);
    } catch (error) {
      console.error("Workshop inquiry submission failed:", error);

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

      <section className="bg-[#faf9f7] text-neutral-700">
        {/* WORKSHOP PHOTO SLIDESHOW — NO ARROWS */}
        <div className="mx-auto max-w-7xl px-4 pt-12">
          {loading ? (
            <div
              className="flex min-h-[350px] items-center justify-center text-lg font-medium text-neutral-600 md:min-h-[700px]"
              role="status"
            >
              Loading workshop photos...
            </div>
          ) : pageError ? (
            <p className="py-24 text-center text-neutral-600" role="alert">
              We couldn't load the workshop page. Please refresh and try again.
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
                  className="h-[350px] w-full object-cover md:h-[700px]"
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
                        currentImage === index ? "true" : undefined
                      }
                      className={`h-3 w-3 rounded-full transition-colors ${
                        currentImage === index ? "bg-black" : "bg-gray-300"
                      }`}
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
            <h1 className="mb-14 text-center text-4xl">
              {data.title}
            </h1>

            <div className="mb-14">
              <h2 className="mb-5 text-2xl font-medium">Pricing</h2>
              <div
                className="text-base leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: data.pricing }}
              />
            </div>

            <div>
              <h2 className="mb-5 text-2xl font-medium">
                Workshop Details
              </h2>
              <div
                className="text-base leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: data.details }}
              />
            </div>

            <div className="mt-14">
              <h2 className="mb-5 text-2xl font-medium">How to Book</h2>
              <div
                className="text-base leading-relaxed [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2"
                dangerouslySetInnerHTML={{ __html: data.howToBook }}
              />
            </div>

            {/* WORKSHOP INQUIRY FORM */}
            <div
              id="workshop-inquiry"
              className="mt-16 border border-neutral-200 bg-white p-6 md:p-10"
            >
              <h2 className="mb-3 text-center text-2xl font-medium">
                Workshop Inquiry
              </h2>

              <p className="mx-auto mb-8 max-w-xl text-center text-sm leading-relaxed text-neutral-600">
                Tell us about your preferred workshop. We'll review your
                request, discuss availability and pricing with you, and
                confirm your booking after payment. No payment is needed
                when submitting this inquiry.
              </p>

              {submitted ? (
                <div className="text-center" role="status">
                  <h3 className="mb-3 text-xl font-medium">
                    Your inquiry has been submitted!
                  </h3>

                  <p className="mb-6 leading-relaxed text-neutral-600">
                    Thank you for contacting Love Hestia. Please message us
                    on Instagram so we can discuss the details. Your date is
                    not reserved until we confirm your booking and payment.
                  </p>

                  <a
                    href="https://www.instagram.com/lovehestiaflowers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border border-neutral-800 bg-neutral-800 px-6 py-3 text-sm uppercase tracking-widest text-white transition hover:bg-neutral-700"
                  >
                    Contact @lovehestiaflowers
                  </a>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="workshop-name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Name
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
                      maxLength={120}
                      className="w-full border border-neutral-300 bg-white p-3 outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="workshop-email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email address
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
                      className="w-full border border-neutral-300 bg-white p-3 outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="workshop-location"
                      className="mb-2 block text-sm font-medium"
                    >
                      Location
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
                      maxLength={250}
                      className="w-full border border-neutral-300 bg-white p-3 outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="workshop-arrangement"
                      className="mb-2 block text-sm font-medium"
                    >
                      Type of arrangement
                    </label>
                    <select
                      id="workshop-arrangement"
                      name="arrangement"
                      value={inquiry.arrangement}
                      onChange={handleInquiryChange}
                      required
                      className="w-full border border-neutral-300 bg-white p-3 outline-none focus:border-neutral-600"
                    >
                      <option value="dried-bouquet">
                        Dried flower bouquet
                      </option>
                      <option value="preserved-dome">
                        Preserved flower dome
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Preferred date and time
                    </label>

                    <DatePicker
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
                      filterTime={(time) => {
                        const hours = time.getHours();

                        if (hours < 8 || hours > 18) {
                          return false;
                        }

                        if (
                          selectedDate &&
                          getDateKey(selectedDate) === getDateKey(new Date()) &&
                          time <= new Date()
                        ) {
                          return false;
                        }

                        return true;
                      }}
                      withPortal
                      customInput={<DateButtonInput />}
                    />

                    <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                      One workshop can be confirmed per day. Your preferred
                      date is a request, not a confirmed reservation.
                    </p>

                    {availabilityError && (
                      <p className="mt-2 text-xs text-amber-700">
                        Live availability could not be checked. Love Hestia
                        will confirm your requested date before booking.
                      </p>
                    )}
                  </div>

                  {/* Honeypot field for the backend's spam check */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
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

                  {submitError && (
                    <p className="text-sm text-red-700" role="alert">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full border px-6 py-3 text-sm font-medium uppercase tracking-widest text-white transition ${
                      submitting
                        ? "cursor-not-allowed border-neutral-400 bg-neutral-400"
                        : "border-neutral-800 bg-neutral-800 hover:bg-neutral-700"
                    }`}
                  >
                    {submitting
                      ? "Submitting inquiry..."
                      : "Submit Workshop Inquiry"}
                  </button>

                  <p className="text-center text-xs leading-relaxed text-neutral-500">
                    No payment is collected here. After your inquiry is
                    successfully saved, you can contact us on Instagram.
                    Your booking is not confirmed until Love Hestia confirms it.
                  </p>
                </form>
              )}
            </div>

            <div className="mt-20 text-center">
              <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-neutral-600">
                Let's plan your workshop together.
              </p>

              <a
                href="https://www.instagram.com/lovehestiaflowers/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-neutral-800 px-8 py-3 tracking-wide text-neutral-800 transition-all duration-300 hover:bg-neutral-800 hover:text-white"
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
