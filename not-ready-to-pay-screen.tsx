"use client"

import { Button } from "@/components/ui/button"

interface NotReadyToPayScreenProps {
  onCancel: () => void
  onConfirmNotReady: () => void
  originalLoanAmount: number
  totalPaid: number // This is effectively the user's current score for this loan
  currentScore: number // Should be equal to totalPaid as per intrinsic scoring
  currencySymbol?: string
}

export default function NotReadyToPayScreen({
  onCancel,
  onConfirmNotReady,
  originalLoanAmount,
  totalPaid,
  currentScore, // Passed for consistency, but totalPaid is the primary driver for score
  currencySymbol = "R$",
}: NotReadyToPayScreenProps) {
  const remainingAmount = Math.max(0, originalLoanAmount - totalPaid)

  // Scenario 1: If they pay now
  const payNowImpactDisplay = remainingAmount // The amount they'd pay to clear, shown as positive
  const finalScoreIfPaidNow = originalLoanAmount // Score becomes the full loan amount

  // Scenario 2: If they don't pay
  const dontPayImpactDisplay = remainingAmount // The amount unpaid, shown as negative
  const finalScoreIfDontPay = totalPaid // Score remains what was paid, but loan defaults

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 max-w-md mx-auto">
      {/* Header Section */}
      <header className="relative flex flex-col items-center mb-8 w-full">
        <button
          onClick={onCancel}
          className="absolute top-0 left-0 text-black font-medium text-base py-2 px-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Cancel"
        >
          Cancel
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#ff0000] mt-1">Not ready to pay</h1>
        <p className="text-base text-gray-600 mt-2 text-center">Your score will drop, but we hope you can recover.</p>
      </header>

      {/* Critical Clarification */}
      <div className="text-center text-sm text-gray-700 mb-8">
        <p>Here's what could happen:</p>
      </div>

      {/* Simulation Scenarios */}
      <div className="space-y-8 sm:space-y-10 flex-grow">
        {/* Scenario 1: If you Pay now */}
        <div className="flex items-center space-x-3 sm:space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="w-1/3 text-sm text-left">
            <p className="text-gray-600">If you</p>
            <p className="font-bold text-black text-base">Pay now</p>
          </div>
          <div className="w-1/4 text-center">
            <p className="text-4xl sm:text-5xl font-bold text-[#26cb4d] relative inline-block">
              +{payNowImpactDisplay}
              <span className="absolute bottom-[-5px] left-0 right-0 h-0.5 sm:h-1 bg-[#26cb4d]"></span>
            </p>
          </div>
          <div className="w-5/12 text-xs sm:text-sm text-black text-left">
            <p>
              Your score becomes {finalScoreIfPaidNow}. You maintain trust, and others are more likely to vouch for you
              again.
            </p>
          </div>
        </div>

        {/* Scenario 2: If you don't pay */}
        <div className="flex items-center space-x-3 sm:space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="w-1/3 text-sm text-left">
            <p className="text-gray-600">If you</p>
            <p className="font-bold text-black text-base">don't pay</p>
          </div>
          <div className="w-1/4 text-center">
            <p className="text-4xl sm:text-5xl font-bold text-[#ff0000] relative inline-block">
              -{dontPayImpactDisplay}
              <span className="absolute bottom-[-5px] left-0 right-0 h-0.5 sm:h-1 bg-[#ff0000]"></span>
            </p>
          </div>
          <div className="w-5/12 text-xs sm:text-sm text-black text-left">
            <p>
              Your score remains {finalScoreIfDontPay} but the loan defaults. Who vouched for you will choose what
              happens next.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Explanatory Text (Optional - can be uncommented if desired) */}
      {/*
      <div className="text-center text-xs text-gray-500 my-6 space-y-1">
        <p>This shows possible outcomes.</p>
        <p>Your vouchers will help decide if you can't pay.</p>
        <p>Any payment is better than no payment.</p>
      </div>
      */}

      {/* Bottom Button */}
      <div className="mt-auto pt-8 pb-4">
        <Button
          variant="outline"
          onClick={onConfirmNotReady}
          className="w-full bg-white border-2 border-[#ff0000] text-[#ff0000] hover:bg-red-50 hover:text-[#ff0000] font-semibold py-3.5 text-base sm:text-lg rounded-lg h-14"
          aria-label={`I'm not ready to pay ${currencySymbol}${remainingAmount.toFixed(2)}`}
        >
          I'm not ready to pay {currencySymbol}
          {remainingAmount.toFixed(2)}
        </Button>
      </div>
    </div>
  )
}
