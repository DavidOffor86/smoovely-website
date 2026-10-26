"use client";

import { useState } from "react";

function Stepper({ value, onChange, min = 1, max = 99 }) {
  const v = Number(value || min);
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, v - 1))}
        className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm font-bold text-gray-700 transition hover:border-blue-400 disabled:opacity-40"
        disabled={v <= min}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-5 text-center text-xs font-semibold text-gray-800">{v}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, v + 1))}
        className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm font-bold text-gray-700 transition hover:border-blue-400 disabled:opacity-40"
        disabled={v >= max}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded border px-2 py-1 text-xs font-medium transition ${
            value === opt
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function SpecialItemsSection({ items, onChange }) {
  const handleAdd = () => {
    const newItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      isHeavy: "No",
      requiresDismantling: "No",
      requiresReassembly: "No",
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id, field, value) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDelete = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const maxReached = items.length >= 20;

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No special items added yet.
        </p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-gray-200 p-4 space-y-3"
        >
          <div>
            <label className="text-xs font-medium text-gray-700">
              Item Description *
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm"
              placeholder="e.g., Trampoline, Piano, Server Rack"
              value={item.description}
              onChange={(e) =>
                handleUpdate(item.id, "description", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">
                Quantity
              </label>
              <div className="mt-1">
                <Stepper
                  value={item.quantity}
                  onChange={(q) => handleUpdate(item.id, "quantity", q)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">
                Heavy Item?
              </label>
              <div className="mt-1">
                <Segmented
                  options={["Yes", "No"]}
                  value={item.isHeavy}
                  onChange={(v) => handleUpdate(item.id, "isHeavy", v)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">
                Dismantling?
              </label>
              <div className="mt-1">
                <Segmented
                  options={["Yes", "No"]}
                  value={item.requiresDismantling}
                  onChange={(v) =>
                    handleUpdate(item.id, "requiresDismantling", v)
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">
                Reassembly?
              </label>
              <div className="mt-1">
                <Segmented
                  options={["Yes", "No"]}
                  value={item.requiresReassembly}
                  onChange={(v) =>
                    handleUpdate(item.id, "requiresReassembly", v)
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            className="text-xs font-medium text-red-600 hover:text-red-800 transition"
          >
            Delete Item
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        disabled={maxReached}
        className="w-full rounded-lg border-2 border-dashed border-blue-400 py-3 text-sm font-semibold text-blue-600 transition hover:border-blue-600 hover:bg-blue-50 disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white"
      >
        + Add Another Item {maxReached && "(Max 20 reached)"}
      </button>
    </div>
  );
}
