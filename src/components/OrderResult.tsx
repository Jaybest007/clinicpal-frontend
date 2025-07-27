import React from "react";

interface OrderResultProps {
  open: boolean;
  value: string;
  loading: boolean;
  onChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function OrderResult({
  open,
  value,
  loading,
  onChange,
  onClose,
  onSubmit,
}: OrderResultProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Enter Order Results
        </h3>
        <form onSubmit={onSubmit}>
          <textarea
            name="orderResults"
            className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 resize-none mb-4"
            placeholder="Enter order results..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          ></textarea>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Results"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}