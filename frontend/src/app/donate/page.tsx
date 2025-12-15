"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

// interface PaymentResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

// const PRESET_AMOUNTS = [100, 500, 1000, 5000, 10000];

export default function Donate() {
  // Commented out Razorpay-related state and handlers; keeping code intact
  // const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  // const [customAmount, setCustomAmount] = useState<string>("");
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  // const amount = customAmount ? parseInt(customAmount) : selectedAmount;
  // const loadRazorpayScript = async (): Promise<boolean> => { /* ... */ return true };
  // const handlePayment = async () => { /* ... */ };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-red-500 fill-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Make a Difference
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Your donation helps us empower students and communities
          </p>
          <p className="text-gray-500">
            Support education, mentorship, and social initiatives
          </p>
        </div>

        {/* Payment Card – now only shows two images side by side */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8 donate-section">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}

          {/* Two-column layout: show exactly two images, no text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <img
                src="https://2mtegaywr8.ucarecd.net/37f28e39-d1c6-4c1f-96a4-84150d7ac1cf/IMG20251213WA0035.jpg"
                alt="Payment Option 1"
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://2mtegaywr8.ucarecd.net/8404d4e0-1cfd-49ea-81a7-a1bacc4ec9c4/Screenshot_20251213_221051_WhatsApp.jpg"
                alt="Payment Option 2"
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* No additional payment texts; razorpay code remains commented elsewhere */}
        </div>

        {/* Impact Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
            <p className="text-gray-600">Students Helped</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <p className="text-gray-600">Active Volunteers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <p className="text-gray-600">Communities Served</p>
          </div>
        </div>
      </div>
    </div>
  );
}
