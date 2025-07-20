import React from 'react';

interface ConfirmationPageProps {
    name: string;
    address: string;
    patientId: string;
    phone: string;
    isOpen: boolean;
    onClose: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
    name,
    address,
    patientId,
    phone,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xs w-full relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Registration Successful!</h2>
                <p className="text-center text-gray-600 mb-4">Thank you for registering. Here are your details:</p>
                <div className="space-y-2 text-gray-700">
                    <div>
                        <strong>Name:</strong> {name}
                    </div>
                    <div>
                        <strong>Address:</strong> {address}
                    </div>
                    <div>
                        <strong>Patient ID:</strong> {patientId}
                    </div>
                    <div>
                        <strong>Phone number:</strong> {phone}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;