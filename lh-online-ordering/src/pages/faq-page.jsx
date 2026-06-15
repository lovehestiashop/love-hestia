import { useState } from "react";
import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";

function FaqPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      <HeaderComponent />

      <section className="bg-[#faf9f7] text-neutral-700">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <h2 className="mb-14 text-center text-3xl font-medium text-neutral-800">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 text-sm leading-relaxed">
            {/* FAQ 1 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 1 ? null : 1
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  Do you ship nationwide?
                </span>

                <span>
                  {openFaq === 1 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 1 && (
                <p className="mt-3">
                  Yes, we ship nationwide through J&T.
                  Shipping rates vary by location.
                  The shipping fee will appear
                  automatically during checkout.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 2 ? null : 2
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  How long does shipping take?
                </span>

                <span>
                  {openFaq === 2 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 2 && (
                <div className="mt-3">
                  <p className="mb-2">
                    For Cebu orders eligible for
                    Lalamove and Maxim delivery,
                    you will receive it the same
                    day.
                  </p>

                  <p>
                    For orders outside Cebu,
                    delivery typically takes 4–7
                    days. Orders to Luzon and
                    Mindanao may take 5–10 days
                    via J&T.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 3 ? null : 3
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  Where is your store located?
                </span>

                <span>
                  {openFaq === 3 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 3 && (
                <p className="mt-3">
                  We don't have a physical shop
                  yet, so all transactions are
                  currently online.
                </p>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 4 ? null : 4
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  Are they real flowers?
                </span>

                <span>
                  {openFaq === 4 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 4 && (
                <p className="mt-3">
                  Yes. We sell preserved and
                  naturally dried flowers that can
                  last 1–2 years when cared for
                  properly.
                </p>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 5 ? null : 5
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  Can we customize arrangements?
                </span>

                <span>
                  {openFaq === 5 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 5 && (
                <p className="mt-3">
                  Yes, you can request customized
                  arrangements based on your
                  preferred colors, style, and
                  budget.
                </p>
              )}
            </div>

            {/* FAQ 6 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 6 ? null : 6
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  Do you conduct private
                  workshops?
                </span>

                <span>
                  {openFaq === 6 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 6 && (
                <p className="mt-3">
                  Yes, we offer private dried
                  flower workshops. Rates vary
                  depending on the workshop type
                  and number of participants.
                </p>
              )}
            </div>

            {/* FAQ 7 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 7 ? null : 7
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  Do you offer fresh flower
                  arrangements?
                </span>

                <span>
                  {openFaq === 7 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 7 && (
                <p className="mt-3">
                  For now, we only offer preserved
                  and dried flower arrangements.
                </p>
              )}
            </div>

            {/* FAQ 8 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 8 ? null : 8
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  Can we change the order?
                </span>

                <span>
                  {openFaq === 8 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 8 && (
                <p className="mt-3">
                  You may change your order as
                  long as it is before the
                  scheduled delivery date.
                </p>
              )}
            </div>

            {/* FAQ 9 */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === 9 ? null : 9
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-semibold">
                  Can we cancel the order?
                </span>

                <span>
                  {openFaq === 9 ? "▼" : "▶"}
                </span>
              </button>

              {openFaq === 9 && (
                <p className="mt-3">
                  Once payment is completed,
                  orders can no longer be
                  canceled. You may change your
                  order to another product of
                  equal value, or pay the
                  difference if applicable.
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
