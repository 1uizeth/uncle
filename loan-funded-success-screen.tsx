"use client"

import { CheckCircle, Users, CalendarDays, DollarSign, ArrowRight } from "lucide-react"
import Image from "next/image"

interface VoucherDetails {
  name: string
  amount: number
  avatarUrl?: string
}

interface LoanFundedSuccessScreenProps {
  loanAmount: number
  currencySymbol?: string
  vouchers: VoucherDetails[]
  repaymentDueDate: string
  repaymentAmount: number
  platformFeePercentage?: number // e.g., 5 for 5%
  onUseFunds?: () => void
  onGoToDashboard?: () => void // A general next step
}

export default function LoanFundedSuccessScreen({
  loanAmount,
  currencySymbol = "$",
  vouchers,
  repaymentDueDate,
  repaymentAmount,
  platformFeePercentage = 5,
  onUseFunds,
  onGoToDashboard,
}: LoanFundedSuccessScreenProps) {
  return (
    <div className="min-h-screen bg-green-500 text-white p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-lg mx-auto flex flex-col items-center text-center">
        {/* Excitement Header */}
        <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-white my-6" strokeWidth={1.5} />
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Your Loan is Funded!</h1>
        <p className="text-xl sm:text-2xl font-semibold mb-8">
          {currencySymbol}
          {loanAmount.toFixed(2)} fully funded by your friends!
        </p>

        {/* Community Celebration */}
        <div className="bg-white/10 p-4 sm:p-6 rounded-lg w-full mb-8">
          <Users className="w-10 h-10 mx-auto mb-3 text-green-200" />
          <h2 className="text-xl font-semibold mb-2">
            {vouchers.length} friend{vouchers.length !== 1 ? "s" : ""} believed in you!
          </h2>
          <div className="flex justify-center space-x-2 my-3">
            {vouchers.slice(0, 5).map(
              (
                v,
                i, // Show max 5 avatars
              ) => (
                <Image
                  key={i}
                  src={v.avatarUrl || `/placeholder.svg?height=40&width=40&query=${v.name}+avatar`}
                  alt={v.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-green-400"
                />
              ),
            )}
          </div>
          {/* Removed: "Your community came together to help you succeed." */}
        </div>

        {/* Funding Breakdown */}
        <div className="bg-white/10 p-4 sm:p-6 rounded-lg w-full mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4 text-center">Funding Breakdown</h2>
          <ul className="space-y-2">
            {vouchers.map((voucher, index) => (
              <li key={index} className="flex justify-between items-center text-sm p-2 bg-white/5 rounded">
                <span>
                  <Image
                    src={voucher.avatarUrl || `/placeholder.svg?height=24&width=24&query=${voucher.name}+avatar`}
                    alt={voucher.name}
                    width={24}
                    height={24}
                    className="rounded-full inline-block mr-2"
                  />
                  {voucher.name} vouched
                </span>
                <span className="font-semibold text-green-300">
                  {currencySymbol}
                  {voucher.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Money Availability */}
        <div className="bg-white/5 p-4 sm:p-6 rounded-lg w-full mb-8">
          <DollarSign className="w-10 h-10 mx-auto mb-3 text-green-200" />
          <h2 className="text-xl font-semibold mb-2">
            {currencySymbol}
            {loanAmount.toFixed(2)} is now available!
          </h2>
          <p className="text-sm text-green-100 mb-4">Funds are available immediately in your account.</p>
          {onUseFunds && (
            <button
              onClick={onUseFunds}
              className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors w-full max-w-xs"
            >
              Use Funds
            </button>
          )}
        </div>

        {/* Repayment Details */}
        <div className="bg-white/10 p-4 sm:p-6 rounded-lg w-full mb-8 text-sm">
          <CalendarDays className="w-8 h-8 mx-auto mb-3 text-green-200" />
          <h3 className="text-lg font-semibold mb-2">Repayment Details</h3>
          <p>
            Due by: <span className="font-semibold">{repaymentDueDate}</span>
          </p>
          <p className="mb-2">
            Amount to repay:{" "}
            <span className="font-semibold">
              {currencySymbol}
              {repaymentAmount.toFixed(2)}
            </span>{" "}
            (includes {platformFeePercentage}% platform fee)
          </p>
          {/* Removed: "Your vouchers are counting on you!" */}
        </div>

        {onGoToDashboard && (
          <button
            onClick={onGoToDashboard}
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white/10 transition-colors w-full max-w-xs flex items-center justify-center mx-auto mt-8 mb-4" // Added margin top
          >
            Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  )
}
