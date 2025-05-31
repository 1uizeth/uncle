"use client"

import { Button } from "@/components/ui/button"

interface CommunityReviewStatusScreenProps {
  currentScore: number
  loanAmount: number
  loanPurpose: string
  currencySymbol?: string
  requestedPaymentAmount?: number // The amount the user requested to pay, if applicable
  requestedPreferenceText: string // e.g., "request to pay $50 for now", "request for more time"
  onUpdatePreference: () => void
}

export default function CommunityReviewStatusScreen({
  currentScore,
  loanAmount,
  loanPurpose,
  currencySymbol = "$",
  requestedPreferenceText,
  onUpdatePreference,
}: CommunityReviewStatusScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6 sm:p-8 max-w-md mx-auto text-center">
      {/* Header Section */}
      <div className="w-full mt-8 sm:mt-12 mb-10 sm:mb-16 relative">
        <p className="text-sm text-gray-500">Your score</p>
        <p className="text-2xl sm:text-3xl font-bold text-[#ff4d00] mt-1">is under review</p>
        <p
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl sm:text-9xl font-bold text-[#ff4d00] opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          {currentScore}
        </p>
        <div className="w-20 h-1 bg-[#ff4d00] mx-auto mt-2"></div>
      </div>

      {/* Loan Details Section */}
      <div className="my-8 sm:my-12">
        <p className="text-3xl sm:text-4xl font-bold text-black">
          {currencySymbol}
          {loanAmount.toFixed(2)} for
        </p>
        <p className="text-3xl sm:text-4xl font-bold text-black mt-1">{loanPurpose}</p>
        <p className="text-gray-500 mt-3 text-md sm:text-lg">Your payment is overdue.</p>
      </div>

      {/* Community Status Section */}
      <div className="my-8 sm:my-12">
        <p className="text-[#ff4d00] text-lg sm:text-xl">Your friends are evaluating your</p>
        <p className="text-[#ff4d00] text-lg sm:text-xl">{requestedPreferenceText}</p>
      </div>

      {/* Action Button */}
      <div className="w-full mt-auto mb-6 sm:mb-8">
        <Button
          variant="outline"
          onClick={onUpdatePreference}
          className="w-full max-w-xs mx-auto border-black text-black hover:bg-gray-100 font-semibold py-3 text-md rounded-lg h-12 sm:h-14"
          aria-label="Update preference"
        >
          Update preference
        </Button>
      </div>
    </div>
  )
}
