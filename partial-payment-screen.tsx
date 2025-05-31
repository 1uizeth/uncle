"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type PresetAmount = 5 | 10 | 25 | 50 | 75

interface PartialPaymentScreenProps {
  onCancel: () => void
  loanAmount: number // Original total loan amount
  loanPurpose: string
  currencySymbol?: string
  presetAmounts?: PresetAmount[]
  onConfirmPayment: (partialAmount: number) => void
}

const DEFAULT_PRESET_AMOUNTS: PresetAmount[] = [5, 10, 25, 50, 75]

export default function PartialPaymentScreen({
  onCancel,
  loanAmount,
  loanPurpose,
  currencySymbol = "$",
  presetAmounts = DEFAULT_PRESET_AMOUNTS,
  onConfirmPayment,
}: PartialPaymentScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<PresetAmount | null>(null)

  const handleAmountSelect = (amount: PresetAmount) => {
    setSelectedAmount(amount)
  }

  const handleConfirm = () => {
    if (selectedAmount !== null) {
      onConfirmPayment(selectedAmount)
    }
  }

  // Filter preset amounts to ensure they are less than or equal to the total loan amount
  const availablePresetAmounts = presetAmounts.filter((amount) => amount <= loanAmount)

  return (
    <div className="min-h-screen bg-white flex flex-col p-4 sm:p-6 max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 sm:mb-8 w-full">
        <button onClick={onCancel} className="text-sm text-black font-medium" aria-label="Cancel">
          Cancel
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#ff4d00]">Pay a smaller amount</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {currencySymbol}
            {loanAmount.toFixed(2)} for {loanPurpose}
          </p>
        </div>
        <div className="w-14"></div> {/* Spacer for centering title */}
      </header>

      {/* Amount Selection Section */}
      <div className="flex-grow flex flex-col items-center w-full">
        <p className="text-md sm:text-lg font-medium text-black mb-4 sm:mb-5 self-start">
          How much would you be able to pay?
        </p>
        <div className="flex flex-wrap justify-start gap-2 sm:gap-3 w-full mb-8">
          {availablePresetAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              onClick={() => handleAmountSelect(amount)}
              className={`
                flex-1 min-w-[56px] sm:min-w-[64px] h-12 sm:h-14 rounded-md text-base
                border-[#bebebe] text-[#121212] hover:bg-[#f4f4f4]
                ${selectedAmount === amount ? "bg-[#e0e0e0] border-2 border-[#121212]" : "bg-white"}
              `}
              aria-pressed={selectedAmount === amount}
            >
              {currencySymbol}
              {amount}
            </Button>
          ))}
        </div>
        {availablePresetAmounts.length === 0 && (
          <p className="text-center text-gray-600 my-4">No partial payment options available for this loan amount.</p>
        )}
      </div>

      {/* Confirm Button */}
      <div className="mt-auto pt-6 sm:pt-8 pb-4 w-full">
        <Button
          onClick={handleConfirm}
          disabled={selectedAmount === null || availablePresetAmounts.length === 0}
          className="w-full bg-[#121212] text-white hover:bg-black font-semibold py-3.5 text-md rounded-lg h-12 sm:h-14 disabled:opacity-50"
          aria-label="Confirm partial payment"
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}
