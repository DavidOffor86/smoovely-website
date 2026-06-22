"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeRemovalsFlow from "./components/HomeRemovalsFlow";
import OfficeMovesFlow from "./components/OfficeMovesFlow";
import B2BLogisticsFlow from "./components/B2BLogisticsFlow";
import ClearanceFlow from "./components/ClearanceFlow";
import StorageFlow from "./components/StorageFlow";

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full bg-blue-600 text-white px-4 py-2 rounded mb-2 hover:bg-blue-700"
  >
    {children}
  </button>
);

const services = [
  "Home Removals",
  "Office Moves",
  "B2B Delivery & Logistics",
  "Clearance & Disposal",
  "Storage Solutions",
];

// Bedroom options for the Home Removals "Details" step (values unchanged).
const bedroomOptions = [
  { value: 1, label: "1 Bedroom Flat", image: "/images/flat.jpg" },
  { value: 2, label: "2 Bedroom House", image: "/images/house2.jpg" },
  { value: 3, label: "3 Bedroom House", image: "/images/house3.jpg" },
  { value: 4, label: "4 Bedroom House", image: "/images/house4.jpg" },
];

// Shared transition between builder steps.
const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: "easeOut" },
};

export default function MultiServicePlatform() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const next = (key, value) => {
    setData({ ...data, [key]: value });
    setStep(step + 1);
  };

  const calculatePrice = () => {
    let price = 80;

    if (data.service === "Home Removals") price += 50;
    if (data.service === "Office Moves") price += 120;
    if (data.service === "B2B Delivery & Logistics") price += 90;
    if (data.service === "Clearance & Disposal") price += 70;
    if (data.service === "Storage Solutions") price += 40;

    if (data.size) price += data.size * 30;

    return price;
  };

  return (
<div id="postcode" className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 scroll-mt-20">
    <div className="w-full max-w-lg">

      {data.service === "Home Removals" && step >= 2 ? (
        <HomeRemovalsFlow onBack={() => setStep(1)} />
      ) : data.service === "Office Moves" && step >= 2 ? (
        <OfficeMovesFlow onBack={() => setStep(1)} />
      ) : data.service === "B2B Delivery & Logistics" && step >= 2 ? (
        <B2BLogisticsFlow onBack={() => setStep(1)} />
      ) : data.service === "Clearance & Disposal" && step >= 2 ? (
        <ClearanceFlow onBack={() => setStep(1)} />
      ) : data.service === "Storage Solutions" && step >= 2 ? (
        <StorageFlow onBack={() => setStep(1)} />
      ) : (
      <>

      {/* PROGRESS BAR */}
      <div className="flex justify-between mb-6 text-sm text-gray-500">
        <span className={step >= 1 ? "text-blue-600 font-bold" : ""}>Service</span>
        <span className={step >= 2 ? "text-blue-600 font-bold" : ""}>Details</span>
        <span className={step >= 3 ? "text-blue-600 font-bold" : ""}>Date</span>
        <span className={step >= 4 ? "text-blue-600 font-bold" : ""}>Info</span>
        <span className={step >= 5 ? "text-blue-600 font-bold" : ""}>Quote</span>
      </div>

      {/* CARD */}
      <div className="bg-white p-6 rounded-lg shadow-lg">

        <h1 className="text-xl font-bold text-blue-600 mb-6 text-center">
          QuickMove Quote
        </h1>

        <AnimatePresence mode="wait">
          <motion.div key={step} {...stepMotion}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="mb-4 font-semibold text-center">
              Choose Service
            </h2>
            <div className="space-y-2">
              {services.map((s) => (
                <button
                  key={s}
                  onClick={() => next("service", s)}
                  className="w-full border p-3 rounded hover:bg-blue-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && data.service === "Home Removals" && (
          <div>
            <h2 className="mb-4 text-center font-semibold">
              How big is your move?
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {bedroomOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => next("size", option.value)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative h-36 overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <img
                    src={option.image}
                    alt={option.label}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-left text-lg font-bold text-white">
                    {option.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && data.service === "Office Moves" && (
          <div>
            <h2 className="mb-4 text-center">Floors</h2>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => next("size", n)}
                  className="border p-3 rounded hover:bg-blue-50"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && data.service === "B2B Delivery & Logistics" && (
          <div>
            <h2 className="mb-4 text-center">Delivery Size</h2>
            <div className="space-y-2">
              {["Small", "Medium", "Large"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => next("size", i + 1)}
                  className="w-full border p-3 rounded hover:bg-blue-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && data.service === "Clearance & Disposal" && (
          <div>
            <h2 className="mb-4 text-center">Load Size</h2>
            <div className="space-y-2">
              {["Light", "Medium", "Full Van"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => next("size", i + 1)}
                  className="w-full border p-3 rounded hover:bg-blue-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && data.service === "Storage Solutions" && (
          <div>
            <h2 className="mb-4 text-center">Storage Duration</h2>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => next("size", n)}
                  className="border p-3 rounded hover:bg-blue-50"
                >
                  {n}m
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="mb-4">Select Date</h2>
            <input
              type="date"
              className="border p-3 rounded w-full"
              onChange={(e) => next("date", e.target.value)}
            />
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <input
              className="border p-3 mb-3 w-full rounded"
              placeholder="Your Name"
              onChange={(e) =>
                setData({ ...data, name: e.target.value })
              }
            />
            <input
              className="border p-3 mb-3 w-full rounded"
              placeholder="Phone Number"
              onChange={(e) =>
                setData({ ...data, phone: e.target.value })
              }
            />
            <button
              onClick={() => setStep(5)}
              className="w-full bg-blue-600 text-white p-3 rounded"
            >
              Get Quote
            </button>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              £{calculatePrice()}
            </h2>
            <button className="bg-green-600 text-white px-6 py-3 rounded">
              Pay Deposit
            </button>
          </div>
        )}

          </motion.div>
        </AnimatePresence>

      </div>
      </>
      )}
    </div>
  </div>
  );
}