
import { useState } from "react";
import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";
import api from "../services/api";

function CustomizePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [showInspirationModal, setShowInspirationModal] = useState(false);

  // Require at least 5 days' notice.
  const getMinimumDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Check delivery date restrictions.
  const isDateAllowed = (value) => {
    if (!value || value < getMinimumDate()) {
      return false;
    }

    // Shop closure: December 19, 2026 to January 8, 2027.
    if (value >= "2026-12-19" && value <= "2027-01-08") {
      return false;
    }

    // Block Sundays, except February 14, 2027.
    const date = new Date(`${value}T00:00:00`);
    const isSunday = date.getDay() === 0;

    if (isSunday && value !== "2027-02-14") {
      return false;
    }

    return true;
  };

  // Validate the selected delivery date.
  const handleDateChange = (event) => {
    const value = event.target.value;

    setDateError("");

    if (value && !isDateAllowed(value)) {
      event.target.value = "";

      setDateError(
        value >= "2026-12-19" && value <= "2027-01-08"
          ? "We are unavailable from December 19, 2026 to January 8, 2027."
          : value < getMinimumDate()
          ? "Please allow at least 5 days for custom arrangements."
          : "We do not accept Sunday deliveries, except February 14, 2027."
      );
    }
  };

  // Submit custom inquiry.
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
    inquiryData.append("notes", formData.get("notes") || "");

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
          "Thank you! Your custom bouquet inquiry has been submitted."
      );

      form.reset();
      setDateError("");

      // Show inspiration photo prompt after successful submission.
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
    "w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#7c8a6e]";

  const labelClass =
    "mb-2 block text-sm font-medium text-neutral-700";

  return (
    <div>
      <HeaderComponent />

      <section className="bg-[#faf9f7] text-neutral-700">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

          {/* Introduction */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-medium text-neutral-800">
              A Bouquet Made Meaningful
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-600">
              Tell us a little about the bouquet you have in mind.
              We'll review your preferences, check flower availability,
              and prepare a quotation just for you.
            </p>
          </div>

          {/* Process */}
          <div className="mb-10 grid gap-6 border-y border-neutral-200 py-8 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#7c8a6e]">
                01
              </p>

              <h3 className="mb-2 text-sm font-semibold">
                Submit your inquiry
              </h3>

              <p className="text-sm leading-relaxed text-neutral-500">
                Share your preferred flowers, colors, and delivery date.
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#7c8a6e]">
                02
              </p>

              <h3 className="mb-2 text-sm font-semibold">
                Receive your quotation
              </h3>

              <p className="text-sm leading-relaxed text-neutral-500">
                We'll check availability and send you the proposed design
                and price.
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#7c8a6e]">
                03
              </p>

              <h3 className="mb-2 text-sm font-semibold">
                Approve and order
              </h3>

              <p className="text-sm leading-relaxed text-neutral-500">
                Once approved, we'll guide you through our regular checkout
                and payment process.
              </p>
            </div>
          </div>

          {/* Starting Price */}
          <div className="mb-14 rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#7c8a6e]">
              Custom Bouquet Starting Price
            </p>

            <h2 className="mb-5 text-3xl font-medium text-neutral-800">
              ₱1,500
            </h2>

            <p className="mb-4 text-sm text-neutral-600">
              Your starting bouquet includes:
            </p>

            <ul className="space-y-3 text-sm leading-relaxed text-neutral-700">
              <li className="flex gap-3">
                <span className="text-[#7c8a6e]">✦</span>
                One main focal flower
              </li>

              <li className="flex gap-3">
                <span className="text-[#7c8a6e]">✦</span>
                Four types of complementary filler flowers
              </li>

              <li className="flex gap-3">
                <span className="text-[#7c8a6e]">✦</span>
                Approximately 15–20 inches in height
              </li>
            </ul>

            <p className="mt-5 border-t border-neutral-100 pt-4 text-xs leading-relaxed text-neutral-500">
              The final quotation may vary depending on your preferred
              flowers, quantity, and availability.
            </p>
          </div>

          {/* Inquiry Form */}
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Customer Details */}
            <div>
              <h2 className="mb-6 text-lg font-medium text-neutral-800">
                Your Details
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className={labelClass}>
                    Full name *
                  </label>

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
                  <label className={labelClass}>
                    Contact number *
                  </label>

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
                  <label className={labelClass}>
                    Email address *
                  </label>

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
                  <label className={labelClass}>
                    Instagram username *
                  </label>

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

            {/* Bouquet Preferences */}
            <div>
              <h2 className="mb-2 text-lg font-medium text-neutral-800">
                Your Bouquet Preferences
              </h2>

              <p className="mb-6 text-sm text-neutral-500">
                We work exclusively with dried and preserved flowers.
                Fresh flowers are not available for custom arrangements.
              </p>

              <div className="space-y-6">

                {/* Color Palette */}
                <div>
                  <label className={labelClass}>
                    Preferred color palette *
                  </label>

                  <input
                    type="text"
                    name="color_palette"
                    className={inputClass}
                    placeholder="e.g. Blush pink, ivory, and champagne"
                    required
                    maxLength={150}
                  />
                </div>

                {/* Focal Flower */}
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
                      Select a focal flower
                    </option>

                    <option value="Preserved Roses">
                      Preserved Roses
                    </option>

                    <option value="Preserved Peonies">
                      Preserved Peonies
                    </option>

                    <option value="Sola Peonies">
                      Sola Peonies
                    </option>

                    <option value="Preserved Sunflowers">
                      Preserved Sunflowers
                    </option>

                    <option value="Mix of preserved Flowers">
                      Mix of preserved Flowers 
                    </option>
                  </select>
                </div>

                {/* Focal Flower Quantity */}
                <div>
                  <label className={labelClass}>
                    How many focal flowers would you prefer?
                  </label>

                  <input
                    type="text"
                    name="focal_quantity"
                    className={inputClass}
                    placeholder="e.g. 1, 3, 7, 12, or your preferred quantity"
                    maxLength={150}
                  />

                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    You may indicate your preferred quantity. For mixed
                    focal flowers, please list each flower and quantity
                    in the additional notes below.
                  </p>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className={labelClass}>
                    Additional notes
                  </label>

                  <textarea
                    name="notes"
                    rows="4"
                    maxLength={2000}
                    className={inputClass}
                    placeholder="If you want mixed focal flowers, add your preferred quantities here. e.g. 2 sunflowers, 5 roses, and 2 peonies. You may also include any other notes for your bouquet."
                  />
                </div>

                {/* Delivery Date */}
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

            {/* Honeypot Spam Protection */}
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

            {/* Submission Feedback */}
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

            {/* Submit Button */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full border border-[#7c8a6e] bg-[#7c8a6e] px-8 py-3 text-sm text-white transition hover:bg-[#68765c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit custom inquiry"}
              </button>

              <p className="mt-4 text-xs leading-relaxed text-neutral-500">
                Submitting an inquiry does not confirm an order or require
                payment. We'll contact you after reviewing your request.
              </p>
            </div>

          </form>
        </div>
      </section>

      <FooterComponent />

      {/* Inspiration Photo Popup - Appears After Successful Submission */}
      {showInspirationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspiration-modal-title"
            className="w-full max-w-md rounded-xl bg-[#faf9f7] p-7 text-center shadow-xl sm:p-9"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#7c8a6e]">
              Thank you for your inquiry
            </p>

            <h2
              id="inspiration-modal-title"
              className="mb-4 text-2xl font-medium text-neutral-800"
            >
              Do you have an inspiration photo?
            </h2>

            <p className="mb-7 text-sm leading-relaxed text-neutral-600">
              We'd love to see what you have in mind! Send us your
              inspiration photo through Instagram so we can better
              understand the bouquet you'd love to have.
            </p>

            <a
              href="https://www.instagram.com/lovehestiaflowers/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowInspirationModal(false)}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#7c8a6e] bg-[#7c8a6e] px-6 py-3 text-sm text-white transition hover:bg-[#68765c]"
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

export default CustomizePage;
