import { useState } from "react";
import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";

function FaqPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div>
      <HeaderComponent />

      <section className="bg-[#faf9f7] text-neutral-700 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-24">

          <h2
            className="
              mb-20
              text-center
              text-[42px]
              md:text-[72px]
              font-light
              text-neutral-700
              leading-none
            "
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-2">

            {/* FAQ 1 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(1)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Do you ship nationwide?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 1 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 1 && (
                <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                  Yes, we ship nationwide through J&T.
                  Shipping rates vary by location.
                  The shipping fee will appear automatically during checkout.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(2)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  How long does shipping take?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 2 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 2 && (
                <div className="mt-4 text-[15px] leading-8 text-neutral-600">
                  <p className="mb-3">
                    For Cebu orders eligible for Lalamove and Maxim delivery,
                    you will receive it the same day.
                  </p>

                  <p>
                    For orders outside Cebu, delivery typically takes 4–7 days.
                    Orders to Luzon and Mindanao may take 5–10 days via J&T.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(3)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Where is your store located?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 3 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 3 && (
                <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                  We don't have a physical shop yet, so all transactions are
                  currently online.
                </p>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(4)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Are they real flowers?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 4 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 4 && (
                <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                  Yes. We sell preserved and naturally dried flowers that can
                  last 1–2 years when cared for properly.
                </p>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(5)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Can we customize arrangements?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 5 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 5 && (
                <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                  Yes, you can request customized arrangements based on your
                  preferred colors, style, and budget.
                </p>
              )}
            </div>

            {/* FAQ 6 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(6)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Do you conduct private workshops?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 6 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 6 && (
                <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                  Yes, we offer private dried flower workshops. Rates vary
                  depending on the workshop type and number of participants.
                </p>
              )}
            </div>

            {/* FAQ 7 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(7)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Do you offer fresh flower arrangements?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 7 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 7 && (
                <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                  For now, we only offer preserved and dried flower
                  arrangements.
                </p>
              )}
            </div>

            {/* FAQ 8 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(8)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Can we change the order?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 8 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 8 && (
                <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                  You may change your order as long as it is before the
                  scheduled delivery date.
                </p>
              )}
            </div>

            {/* FAQ 9 */}
            <div className="border-b border-neutral-200 py-4">
              <button
                onClick={() => toggleFaq(9)}
                className="flex w-full items-center justify-between text-left"
              >
                <span
                  className="text-[18px] md:text-[22px] font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Can we cancel the order?
                </span>

                <span className="text-2xl text-neutral-500">
                  {openFaq === 9 ? "−" : "+"}
                </span>
              </button>

              {openFaq === 9 && (
                <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                  Once payment is completed, orders can no longer be canceled.
                  You may change your order to another product of equal value,
                  or pay the difference if applicable.
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      <FooterComponent />
    </div>
  );
}

export default FaqPage;
