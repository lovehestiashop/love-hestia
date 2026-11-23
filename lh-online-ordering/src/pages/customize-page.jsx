import { useState } from "react";
import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";
import api from "../services/api";

function CustomizePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Require at least 5 days' notice.
  const getMinimumDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const inquiryData = {
      website: formData.get("website") || "",
      customer_name: formData.get("customer_name"),
      customer_number: formData.get("customer_number"),
      customer_email: formData.get("customer_email"),
      delivery_date: formData.get("delivery_date"),
      color_palette: formData.get("color_palette"),
      focal_flower: formData.get("focal_flower"),
      quantity: Number(formData.get("quantity")),
      notes: formData.get("notes") || "",
    };

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

            <p className="mt-4 text-sm font-medium text-neutral-700">
              Custom bouquets start at ₱1,500.
            </p>
          </div>

          {/* Process */}
          <div className="mb-12 grid gap-6 border-y border-neutral-200 py-8 sm:grid-cols-3">
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

          {/* Inquiry Form */}
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Contact Details */}
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

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Email address
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    className={inputClass}
                    placeholder="Your email address (optional)"
                    maxLength={150}
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
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Number of focal flowers *
                  </label>
                  <select
                    name="quantity"
                    className={inputClass}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select quantity
                    </option>
                    <option value="1">1 flower</option>
                    <option value="3">3 flowers</option>
                    <option value="7">7 flowers</option>
                    <option value="12">12 flowers</option>
                    <option value="18">18 flowers</option>
                  </select>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    Filler flowers and complementary stems will be selected
                    by our florist to complete the arrangement.
                  </p>
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
                    required
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Please allow at least 5 days for custom arrangements.
                    Your preferred date will be subject to confirmation.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Additional notes
                  </label>
                  <textarea
                    name="notes"
                    rows="4"
                    maxLength={2000}
                    className={inputClass}
                    placeholder="Tell us more about the arrangement you're imagining..."
                  />
                </div>
              </div>
            </div>

            {/* Honeypot spam protection */}
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

            {/* Submit */}
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
    </div>
  );
}

export default CustomizePage;
