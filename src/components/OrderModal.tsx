import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const OrderModal = ({ children, onClose }: ModalProps) => (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white max-w-xl w-full mx-4 rounded-lg shadow-xl p-6 relative">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
        onClick={onClose}
        aria-label="Close modal"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

export default OrderModal;
