"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"

interface CommunityApprovalSuccessScreenProps {
  approvedAmount: number
  currencySymbol?: string
  onContinue: () => void
  duration?: number // in milliseconds
}

export default function CommunityApprovalSuccessScreen({
  approvedAmount,
  currencySymbol = "$",
  onContinue,
  duration = 5000, // Default 5 seconds
}: CommunityApprovalSuccessScreenProps) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    startTimeRef.current = Date.now() // Reset start time on mount/duration change
    intervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsedTime / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(intervalRef.current!)
        onContinue()
      }
    }, 50) // Update progress roughly 20 times per second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [duration, onContinue])

  const handleContinueClick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    onContinue()
  }

  return (
    <div className="min-h-screen bg-[#26cb4d] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Success!</h1>
        <p className="text-lg sm:text-xl mb-10">
          Your friends accepted that <br />
          you pay {currencySymbol}
          {approvedAmount.toFixed(2)} for now.
        </p>

        <Button
          onClick={handleContinueClick}
          className="w-full max-w-xs mx-auto bg-white text-[#26cb4d] font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-100 transition-colors relative overflow-hidden h-14"
          aria-label="Continue"
        >
          <div
            className="absolute top-0 left-0 h-full bg-green-200 transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="relative z-10">Continue</span>
        </Button>
      </div>
    </div>
  )
}
