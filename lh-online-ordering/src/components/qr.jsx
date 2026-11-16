
import { useState } from "react";
import gcash from "../assets/gcash.jpg";
import bpi from "../assets/bpi.jpg";

function QrComponent() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="mb-4 space-y-5">
      {/* Local Payment QR Codes */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-center">
        <div className="text-center">
          <img
            src={gcash}
            alt="GCash QR Code"
            className="w-50 border cursor-pointer hover:opacity-80"
            onClick={() => setSelectedImage(gcash)}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Tap for better view
          </p>
        </div>

        <div className="text-center">
          <img
            src={bpi}
            alt="BPI QR Code"
            className="w-74 border cursor-pointer hover:opacity-80"
            onClick={() => setSelectedImage(bpi)}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Tap for better view
          </p>
        </div>
      </div>

      <p className="mt-2 text-sm text-neutral-600 text-center">
        Scan to pay (GCash / BPI)
      </p>

      {/* International Orders Payment Details */}
      <div className="border border-neutral-300 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌍</span>
          <h3 className="font-semibold text-neutral-800 tracking-wide">
            FOR INTERNATIONAL ORDERS
          </h3>
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed mb-4">
          For orders placed from other countries and delivered
          within Cebu City.
        </p>

        <div className="bg-neutral-50 border border-neutral-200 p-4">
          <p className="text-sm font-medium text-neutral-800 mb-3">
            You can pay through GCash
          </p>

          <div className="mb-3">
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
              Account Name
            </p>
            <p className="font-semibold text-neutral-800">
              Loraine J.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
              Account Number
            </p>
            <p className="text-xl font-semibold tracking-wide text-neutral-900">
              09617129672
            </p>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
          After completing your payment, please upload your proof
          of payment below.
        </p>
      </div>

      {/* Fullscreen QR Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Fullscreen QR"
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            aria-label="Close enlarged QR code"
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default QrComponent;
