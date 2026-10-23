import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useRef, forwardRef } from "react";
import HeaderComponent from "../components/header";
import FooterComponent from "../components/footer";
import { orderService } from "../services/order-service";
import { productService } from "../services/product-service";
import QrComponent from "../components/qr";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const isDeliveryDateAvailable = (date) => {
  if (!date) return false;

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Allow Valentine's Day, even when it falls on Sunday
  if (month === 1 && day === 14) {
    return true;
  }

  // Block all other Sundays
  if (date.getDay() === 0) {
    return false;
  }

  // Block scheduled leave dates, including both endpoints
  const blockedRanges = [
    ["2026-10-31", "2026-11-03"],
    ["2026-12-19", "2027-01-08"],
  ];

  return !blockedRanges.some(
    ([start, end]) => dateKey >= start && dateKey <= end
  );
};

const STANDARD_FEE = 0;
const SPECIAL_FEE = 250;
const CAR_FEE = 500;


const CEBU_CITY_BARANGAYS = [
  "Adlaon",
  "Agsungot",
  "Apas",
  "Babag",
  "Bacayan",
  "Banilad",
  "Basak Pardo",
  "Basak San Nicolas",
  "Binaliw",
  "Bonbon",
  "Budla-an",
  "Buhisan",
  "Bulacao",
  "Buot-Taup Pardo",
  "Busay",
  "Calamba",
  "Cambinocot",
  "Camputhaw",
  "Capitol Site",
  "Carreta",
  "Central",
  "Cogon Pardo",
  "Cogon Ramos",
  "Day-as",
  "Duljo",
  "Ermita",
  "Guadalupe",
  "Guba",
  "Hippodromo",
  "Inayawan",
  "Kalubihan",
  "Kalunasan",
  "Kamagayan",
  "Kasambagan",
  "Kinasang-an Pardo",
  "Labangon",
  "Lahug",
  "Lorega",
  "Lusaran",
  "Luz",
  "Mabini",
  "Mabolo",
  "Malubog",
  "Mambaling",
  "Pahina Central",
  "Pahina San Nicolas",
  "Pamutan",
  "Pardo",
  "Pari-an",
  "Paril",
  "Pasil",
  "Pit-os",
  "Pulangbato",
  "Pung-ol-Sibugay",
  "Punta Princesa",
  "Quiot Pardo",
  "Sambag I",
  "Sambag II",
  "San Antonio",
  "San Jose",
  "San Nicolas Central",
  "San Roque",
  "Santa Cruz",
  "Sapangdaku",
  "Sawang Calero",
  "Sinsin",
  "Sirao",
  "Suba Pob.",
  "Sudlon I",
  "Sudlon II",
  "T. Padilla",
  "Tabunan",
  "Tagbao",
  "Talamban",
  "Taptap",
  "Tejero",
  "Tinago",
  "Tisa",
  "To-ong Pardo",
  "Zapatera",
];


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

const cart = state?.cart || [];
const isCartCheckout = cart.length > 0;

const cartSubtotal = state?.subtotal || 0;
const cartDeliveryFee = state?.deliveryFee || 0;
const cartGrandTotal = state?.grandTotal || 0;

  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState("standard");
  
const [showFreeDeliveryAreas, setShowFreeDeliveryAreas] =
  useState(false);

const [barangaySearch, setBarangaySearch] = useState("");

const filteredBarangays = useMemo(() => {
  const query = barangaySearch.trim().toLowerCase();

  return CEBU_CITY_BARANGAYS.filter((barangay) =>
    barangay.toLowerCase().includes(query)
  );
}, [barangaySearch]);


 const [form, setForm] = useState({
    customer_name: "",
    customer_number: "",
    customer_email: "",
    facebook_name: "",
    receiver_name: "",
    receiver_number: "",
    delivery_address: "",
    date_and_time_of_delivery: "",
    product_ordered:
      product?.title?.rendered ||
      cart
        .map((item) => item.product?.title?.rendered)
        .join(", "),
    customize_product: "",
    small_card_note: "",
    proof_of_payment: null,
});

  const price = product?.acf?.price || 0;
 const deliveryFee =
  deliveryArea === "special"
    ? SPECIAL_FEE
    : deliveryArea === "car"
    ? CAR_FEE
    : STANDARD_FEE;
  const currentCartTotal =
  cartSubtotal + deliveryFee;
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

  product,

  product_id: product ? product.id : null,

  cart,

  price: product ? price : cartSubtotal,
  delivery_fee: deliveryFee,

  total: product
    ? total
    : currentCartTotal,

  date_and_time_of_delivery: formatDateTime(
    form.date_and_time_of_delivery,
  ),

  date_time_ordered: formatDateTime(
    new Date().toISOString()
  ),

  product_image: product?.featured_media || "",
});

     localStorage.setItem("cart", JSON.stringify([]));

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
            {!product && !isCartCheckout && (
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
    name="customer_email"
    value={form.customer_email}
    onChange={handleChange}
    type="email"
    placeholder="Email address*"
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
      date_and_time_of_delivery: date?.toISOString() || "",
    }));
  }}
  showTimeSelect
  timeFormat="h:mm aa"
  dateFormat="MMMM d, yyyy h:mm aa"
  minDate={new Date()}
 filterDate={isDeliveryDateAvailable}
  withPortal
  customInput={<DateButtonInput />}
 
filterTime={(time) => {
  const hours = new Date(time).getHours();

  const selected = selectedDate;
  const isValentinesDay =
    selected &&
    selected.getMonth() === 1 &&
    selected.getDate() === 14;

  const earliestHour = isValentinesDay ? 6 : 8;

  return hours >= earliestHour && hours <= 18;
}}

/>


            <textarea
              required
              name="delivery_address"
              value={form.delivery_address}
              onChange={handleChange}
              placeholder="Delivery address or paste your Google Maps location link*"
              rows="3"
              className="w-full border p-3 mb-3"
            />

           {/*
<textarea
  name="small_card_note"
  value={form.small_card_note}
  onChange={handleChange}
  placeholder="Small card note"
  rows="2"
  className="w-full border p-3 mb-3"
/>
*/}

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
  FREE DELIVERY (Cebu city only)
</label>
  
<div className="mb-4">
  <button
    type="button"
    onClick={() =>
      setShowFreeDeliveryAreas((previous) => !previous)
    }
    aria-expanded={showFreeDeliveryAreas}
    aria-controls="cebu-city-free-delivery-areas"
  className="
  ml-6
  flex
  items-center
  gap-1.5
  text-xs
  font-medium
  text-blue-600
  underline
  underline-offset-4
  hover:text-blue-800
"
  >
    {showFreeDeliveryAreas ? "Hide" : "Check"} free-delivery areas
    <span aria-hidden="true">
      {showFreeDeliveryAreas ? "−" : "+"}
    </span>
  </button>

  {showFreeDeliveryAreas && (
    <div
      id="cebu-city-free-delivery-areas"
      className="mt-4 border border-neutral-300 bg-white p-4"
    >
      <h4 className="font-medium text-neutral-800">
        Cebu City Barangays
      </h4>

      <p className="mt-1 mb-3 text-sm text-neutral-600">
        Search your barangay to check whether it is listed for
        Cebu City free delivery.
      </p>

      <input
        type="search"
        value={barangaySearch}
        onChange={(e) => setBarangaySearch(e.target.value)}
        placeholder="Search barangay..."
        aria-label="Search Cebu City barangays"
        className="mb-3 w-full border border-neutral-300 p-2"
      />

      <p className="mb-2 text-xs text-neutral-500">
        {filteredBarangays.length} of{" "}
        {CEBU_CITY_BARANGAYS.length} barangays shown
      </p>

      <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        {filteredBarangays.map((barangay) => (
          <li
            key={barangay}
            className="rounded bg-neutral-50 px-3 py-2 text-neutral-700"
          >
            {barangay}
          </li>
        ))}
      </ul>

      {filteredBarangays.length === 0 && (
        <p className="py-3 text-sm text-neutral-600">
          No matching barangay found. Check the spelling or
          contact Love Hestia to confirm your delivery area.
        </p>
      )}

      <p className="mt-4 text-xs text-neutral-500">
        This is the official barangay list for Cebu City.
        If you are unsure which barangay your address belongs
        to, please confirm with us before selecting free delivery.
      </p>
    </div>
  )}
</div>
     

<label className="flex items-center gap-3 mb-2">
  <input
    type="radio"
    checked={deliveryArea === "special"}
    onChange={() => setDeliveryArea("special")}
  />
  Minglanilla / Liloan / Lapu-Lapu (₱250)
</label>

<label className="flex items-center gap-3">
  <input
    type="radio"
    checked={deliveryArea === "car"}
    onChange={() => setDeliveryArea("car")}
  />
  Car Delivery (₱500)
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

  {!product && cart.length > 0 && (
    <>
      <div className="flex justify-between">
        <span>Cart Items</span>
        <span>{cart.length}</span>
      </div>

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₱{cartSubtotal}</span>
      </div>

      <div className="flex justify-between">
        <span>Delivery Fee</span>
        <span>₱{deliveryFee}</span>
      </div>

      <div className="flex justify-between font-medium text-lg">
        <span>Total</span>
        <span>₱{currentCartTotal}</span>
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
