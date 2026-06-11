import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useRef, forwardRef } from "react";
import HeaderComponent from "../components/header";
import FooterComponent from "../components/footer";
import { orderService } from "../services/order-service";
import QrComponent from "../components/qr";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const STANDARD_FEE = 200;
const SPECIAL_FEE = 250;

// Format date as "January 1, 2025 3:00 PM"
function formatDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

const DateButtonInput = forwardRef(({ value, onClick }, ref) => {
  return (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full border p-3 text-left bg-white hover:bg-neutral-50 transition cursor-pointer -mb-4"
    >
      {value || "Select delivery date & time"}
    </button>
  );
});

DateButtonInput.displayName = "DateButtonInput";

function OrderPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product || null;

  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState("standard");

  const [form, setForm] = useState({
    customer_name: "",
    customer_number: "",
    facebook_name: "",
    receiver_name: "",
    receiver_number: "",
    delivery_address: "",
    date_and_time_of_delivery: "",
    product_ordered: product?.title?.rendered || "",
    customize_product: "",
    small_card_note: "",
    proof_of_payment: null,
  });

  const price = product?.acf?.price || 0;
  const deliveryFee = deliveryArea === "special" ? SPECIAL_FEE : STANDARD_FEE;
  const total = useMemo(() => price + deliveryFee, [price, deliveryFee]);

  const imageUrl =
    product?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/placeholder.jpg";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await orderService.createOrder({
        ...form,
        date_and_time_of_delivery: formatDateTime(
          form.date_and_time_of_delivery,
        ),
        date_time_ordered: formatDateTime(new Date().toISOString()),
        product_image: product.featured_media,
      });

      alert("Order placed successfully!");
      navigate("/shop");
    } catch (err) {
      console.error(err);
      alert("Failed to place order: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <HeaderComponent />

      <section className="bg-neutral-50 py-24">
        <div
          className={`mx-auto px-6 grid gap-12 ${
            product
              ? "max-w-5xl grid-cols-1 md:grid-cols-2"
              : "max-w-xl grid-cols-1"
          }`}
        >
          {/* ORDER FORM */}
          <form
            className={`order-2 md:order-1 space-y-8 ${
              isSubmitting ? "opacity-70 pointer-events-none" : ""
            }`}
            onSubmit={handleSubmit}
          >
            {!product && (
              <div>
                <h3 className="mb-4 font-medium uppercase tracking-wide">
                  Customize Your Arrangement
                </h3>
                <textarea
                  required
                  name="customize_product"
                  value={form.customize_product}
                  onChange={handleChange}
                  placeholder="Describe your custom arrangement*"
                  rows="4"
                  className="w-full border p-3 mb-3"
                />
              </div>
            )}

            <h3 className="mb-4 font-medium uppercase tracking-wide">
              Your Information
            </h3>

            <input
              required
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              type="text"
              placeholder="Name*"
              className="w-full border p-3 mb-3"
            />

            <input
              required
              name="customer_number"
              value={form.customer_number}
              onChange={handleChange}
              type="text"
              placeholder="Number*"
              className="w-full border p-3 mb-3"
            />

            <input
              required
              name="facebook_name"
              value={form.facebook_name}
              onChange={handleChange}
              type="text"
              placeholder="Facebook or Instagram name*"
              className="w-full border p-3 mb-3"
            />

            <h3 className="mb-4 font-medium uppercase tracking-wide">
              Receiver's Information (optional)
            </h3>

            <input
              name="receiver_name"
              value={form.receiver_name}
              onChange={handleChange}
              type="text"
              placeholder="Receiver's name"
              className="w-full border p-3 mb-3"
            />

            <input
              name="receiver_number"
              value={form.receiver_number}
              onChange={handleChange}
              type="text"
              placeholder="Receiver's number"
              className="w-full border p-3 mb-3"
            />

            {/* DELIVERY DETAILS */}
            <h3 className="mb-4 font-medium uppercase tracking-wide">
              Delivery Details
            </h3>

            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setForm((prev) => ({
                  ...prev,
                  date_and_time_of_delivery: date?.toISOString(),
                }));
              }}
              showTimeSelect
              timeFormat="h:mm aa"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              withPortal
              customInput={<DateButtonInput />}
              filterTime={(time) => {
                const hours = new Date(time).getHours();
                return hours >= 9 && hours <= 18; // ✅ 9AM–6PM only
              }}
            />

            <textarea
              required
              name="delivery_address"
              value={form.delivery_address}
              onChange={handleChange}
              placeholder="Delivery address*"
              rows="3"
              className="w-full border p-3 mb-3"
            />

            <textarea
              name="small_card_note"
              value={form.small_card_note}
              onChange={handleChange}
              placeholder="Small card note"
              rows="2"
              className="w-full border p-3 mb-3"
            />

            <h3 className="mb-4 font-medium uppercase tracking-wide">
              Delivery Area
            </h3>

            <label className="flex items-center gap-3 mb-2">
              <input
                type="radio"
                checked={deliveryArea === "standard"}
                onChange={() => setDeliveryArea("standard")}
                required
              />
              Standard Delivery (₱200)
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={deliveryArea === "special"}
                onChange={() => setDeliveryArea("special")}
              />
              Minglanilla / Liloan / Lapu-Lapu (₱250)
            </label>

            <div className="border-t pt-6 space-y-2">
              {product && (
                <>
                  <div className="flex justify-between">
                    <span>Product Price</span>
                    <span>₱{price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₱{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₱{total}</span>
                  </div>
                </>
              )}
            </div>

            <h3 className="mb-4 font-medium uppercase tracking-wide">
              Payment
            </h3>

            <QrComponent />

            <div>
              <input
                required
                name="proof_of_payment"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleChange}
                className="w-full border p-3 hover:cursor-pointer"
              />
              <p className="mt-2 text-sm text-neutral-600">
                Upload proof of payment*
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-3 py-3 uppercase tracking-widest transition mb-3 ${
                isSubmitting
                  ? "bg-neutral-400 cursor-not-allowed"
                  : "bg-neutral-800 hover:bg-neutral-700 hover:cursor-pointer text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing…
                </>
              ) : (
                "Place Order"
              )}
            </button>

            <p className="text-sm text-neutral-600">
              Note: Kindly inform us once you have placed your order
            </p>
          </form>

          {/* PRODUCT PREVIEW */}
          {product && (
            <div className="order-1 md:order-2">
              <div className="aspect-[3/5] overflow-hidden bg-neutral-200">
                <img
                  src={imageUrl}
                  alt={product.title.rendered}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mt-6 text-lg font-medium uppercase tracking-wide text-neutral-800">
                {product.title.rendered}
              </h2>

              <p>{product.acf.product_description}</p>
            </div>
          )}
        </div>
      </section>

      <FooterComponent />
    </div>
  );
}

export default OrderPage;
