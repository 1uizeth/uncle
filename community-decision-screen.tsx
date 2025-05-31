"use client"

import { Button } from "@/components/ui/button"

type PreferenceOption = "pay_smaller" | "more_time" | "split_payments"

interface CommunityDecisionScreenProps {
  onCancel: () => void
  loanAmount: number
  loanPurpose: string
  currencySymbol?: string
  onSelectPreference: (preference: PreferenceOption) => void
}

const PREFERENCE_OPTIONS = [
  { id: "pay_smaller", label: "Pay a smaller amount" },
  { id: "more_time", label: "Ask for more time" },
  { id: "split_payments", label: "Split payments" },
] as const satisfies ReadonlyArray<{ id: PreferenceOption; label: string }>

export default function CommunityDecisionScreen({
  onCancel,
  loanAmount,
  loanPurpose,
  currencySymbol = "$",
  onSelectPreference,
}: CommunityDecisionScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col p-4 sm:p-6 max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-4 w-full">
        <button onClick={onCancel} className="text-sm text-black font-medium" aria-label="Cancel">
          Cancel
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-600">Not ready to pay</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {currencySymbol}
            {loanAmount.toFixed(2)} for {loanPurpose}
          </p>
        </div>
        <div className="w-14"></div> {/* Spacer for centering title */}
      </header>

      {/* Community Notification Message */}
      <div className="text-center my-6 sm:my-8">
        <p className="text-gray-600 text-base sm:text-lg">Your friends were informed and will decide between</p>
        <p className="text-gray-600 text-base sm:text-lg">the following options in the next 24 hours.</p>
      </div>

      {/* Decision Options Section */}
      <div className="w-full flex-grow flex flex-col items-center">
        <h2 className="text-md sm:text-lg font-semibold text-black mb-4 sm:mb-5 self-start">What would you prefer?</h2>
        <div className="w-full space-y-3">
          {PREFERENCE_OPTIONS.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              onClick={() => onSelectPreference(option.id)}
              className="w-full bg-gray-100 border-gray-200 hover:bg-gray-200 text-black font-medium py-3.5 text-md rounded-lg h-auto sm:h-14"
              aria-label={option.label}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Optional: Add a small spacer at the bottom if needed, or rely on parent padding */}
      <div className="h-4"></div>
    </div>
  )
}
