import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";

function FaqPage() {
  return (
    <div>
      <HeaderComponent />
      <section className="bg-[#faf9f7] text-neutral-700">
        <div className="max-w-3xl mx-auto px-6 py-24">
          {/* Title */}
          <h2 className="mb-14 text-center text-3xl font-medium text-neutral-800">
            Frequently asked questions
          </h2>

          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-2">Do you ship nationwide?</h3>
              <p className="mb-2">
                Yes, we ship nationwide through J&T. Shipping rates vary by
                location. To view the cost, simply select the product you want
                and enter your delivery address, the <b>shipping fee</b> will
                appear automatically. Shipping fee rates outside Cebu will depend on the location.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                How long does shipping take?
              </h3>
              <p className="mb-2">
                For orders Cebu orders eligible for Lalamove and Maxim delivery
                you will receive it same day.
              </p>
              <p className="mb-2">
                For orders outside Cebu City that aren’t eligible for Maxim or
                Lalamove, delivery typically takes 4–7 days. Orders to Mindanao
                or Luzon may take 5–10 days via J&T delivery.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Where is your store located?
              </h3>
              <p className="mb-2">
                We don’t have a physical shop yet, so all transactions are
                online.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Are they real flowers?</h3>
              <p className="mb-2">
                Yes, we sell preserved and naturally dried flowers, and they can
                last 1–2 years when cared for properly
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Can we customize arrangements?
              </h3>
              <p className="mb-2">
                Yes, you can view the process for ordering custom arrangements
                <span className="underline">here</span>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Do you conduct private workshops?
              </h3>
              <p className="mb-2">
                Yes, we do! You can view the pricelist{" "}
                <span className="underline">here</span>. The dried flower
                workshop may be slightly more expensive than fresh flowers, as
                dried flowers last much longer.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Do you offer fresh flower arrangements?
              </h3>
              <p className="mb-2">
                For now we only offer dried flower arrangements
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can we change the order?</h3>
              <p className="mb-2">
                You can change the order as long as it’s before the delivery
                date
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can we cancel the order?</h3>
              <p className="mb-2">
                Once payment is completed, orders can no longer be canceled. You
                may change your order at the same product price, or if there’s a
                price difference, you’ll need to pay the additional amount.
              </p>
            </div>
          </div>
        </div>
      </section>
      <FooterComponent />
    </div>
  );
}

export default FaqPage;
