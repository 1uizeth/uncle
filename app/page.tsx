"use client"

import LoanApplication from "../loan-application"
import LoanStatusScreen from "../loan-status-screen"
import CommunityVouchingScreen from "../community-vouching-screen"
import LoanSuccessScreen from "../loan-success-screen"
import LoanFundedSuccessScreen from "../loan-funded-success-screen"
import VouchingSuccessScreen from "../vouching-success-screen"
import LoanDashboardScreen from "../loan-dashboard-screen"
import PaymentSuccessScreen from "../payment-success-screen"
import NotReadyToPayScreen from "../not-ready-to-pay-screen"
import CommunityDecisionScreen from "../community-decision-screen"
import PartialPaymentScreen from "../partial-payment-screen"
import CommunityReviewStatusScreen from "../community-review-status-screen"
import CommunityApprovalSuccessScreen from "../community-approval-success-screen"

import { useState, useEffect } from "react"

interface Voucher {
  name: string
  amount: number
  avatarUrl?: string
}

type PreferenceOption = "pay_smaller" | "more_time" | "split_payments"

type ScreenState =
  | "LOAN_APPLICATION"
  | "LOAN_APPLICATION_SUCCESS"
  | "LOAN_STATUS"
  | "COMMUNITY_VOUCHING"
  | "LOAN_FUNDED_SUCCESS"
  | "VOUCHING_SUCCESS"
  | "LOAN_DASHBOARD"
  | "PAYMENT_SUCCESS"
  | "NOT_READY_TO_PAY_WARNING"
  | "COMMUNITY_DECISION"
  | "PARTIAL_PAYMENT_SELECTION"
  | "COMMUNITY_REVIEW_STATUS"
  | "COMMUNITY_APPROVAL_SUCCESS"

// Near the top of the Page component
interface UserLoanDetails {
  borrowerName: string
  originalLoanAmount: number // Amount originally requested by the user
  amountActuallyFundedByVouchers: number // Amount funded by the community/vouchers
  totalPaidOnCurrentLoan: number // Running total of all payments made by the user on this loan
  currentScore: number // ALWAYS equals totalPaidOnCurrentLoan
  remainingBalanceToRepay: number // originalLoanAmount (or amountActuallyFundedByVouchers if less) - totalPaidOnCurrentLoan
  purpose: string
  vouchers: Voucher[] // List of vouchers who contributed
  repaymentDays: number
  platformFeePercentage: number
  loanStatus: "pending_approval" | "awaiting_vouchers" | "active" | "completed" | "overdue" | "defaulted"
}

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("LOAN_APPLICATION")
  const [previousScreenForCancel, setPreviousScreenForCancel] = useState<ScreenState | undefined>(undefined)
  const [userPreferenceDetails, setUserPreferenceDetails] = useState({
    text: "",
    requestedAmount: 0,
    type: "" as PreferenceOption | "",
  })

  // Update the initial state for userLoanDetails
  const [userLoanDetails, setUserLoanDetails] = useState<UserLoanDetails>({
    borrowerName: "Yunus", // Changed to Yunus
    originalLoanAmount: 0,
    amountActuallyFundedByVouchers: 0,
    totalPaidOnCurrentLoan: 0,
    currentScore: 0,
    remainingBalanceToRepay: 0,
    purpose: "",
    vouchers: [],
    repaymentDays: 3,
    platformFeePercentage: 5,
    loanStatus: "pending_approval",
  })

  // Remove currentUserAppScore if it's separate from the loan-specific score.
  // The primary "score" is now userLoanDetails.currentScore.
  // If there's a global reputation score, it needs to be clearly defined how it relates.
  // For now, focusing on the loan-specific score = totalPaid.
  // const [currentUserAppScore, setCurrentUserAppScore] = useState(100); // REMOVE or REPURPOSE

  const [communityLoanToVouchFor, setCommunityLoanToVouchFor] = useState({
    borrowerName: "Yunus", // Example: Yunus is asking, Miguel might vouch
    amount: 100,
    purpose: "work equipment",
    fundedAmount: 0,
    vouchersCount: 0,
    repaymentDays: 3,
  })

  const [lastVouchDetails, setLastVouchDetails] = useState({
    vouchAmount: 0,
    borrowerName: "",
    loanFundedAmount: 0,
    loanTotalAmount: 0,
    userMessageToBorrower: "",
  })

  // const [currentUserAppScore, setCurrentUserAppScore] = useState(100)
  const [currentUserVouchingPower, setCurrentUserVouchingPower] = useState(500)
  const [currentUserLoanLimit, setCurrentUserLoanLimit] = useState(150)

  const [paymentSuccessData, setPaymentSuccessData] = useState({
    paidAmount: 0,
    newRecoveryScore: 0,
  })

  const [tempDashboardData, setTempDashboardData] = useState<{
    originalAmount: number
    paidThisTime: number
    remainingAmount: number
  } | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (currentScreen === "COMMUNITY_REVIEW_STATUS") {
      console.log("Simulating community review...")
      timer = setTimeout(() => {
        console.log("Community review complete. Simulating approval.")
        setCurrentScreen("COMMUNITY_APPROVAL_SUCCESS")
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [currentScreen])

  // REMOVE THIS useEffect block:
  /*
  useEffect(() => {
    if (
      !userLoanDetails.isPaid && // This state field was removed, use loanStatus
      userLoanDetails.fundedAmount > 0 && // This field was removed/repurposed
      userLoanDetails.fundedAmount >= userLoanDetails.amount && // This field was removed/repurposed
      currentScreen === "LOAN_STATUS" // This logic is flawed for the new system
    ) {
      // ... old arbitrary score logic ...
    }
  }, [userLoanDetails.fundedAmount, userLoanDetails.amount, currentScreen, currentUserAppScore, userLoanDetails.isPaid]);
  */

  // In handleLoanSubmitted
  const handleLoanSubmitted = (amount: number, purpose: string) => {
    setUserLoanDetails({
      borrowerName: "Yunus", // Changed to Yunus
      originalLoanAmount: amount,
      amountActuallyFundedByVouchers: 0,
      totalPaidOnCurrentLoan: 0,
      currentScore: 0,
      remainingBalanceToRepay: amount,
      purpose,
      vouchers: [],
      repaymentDays: 3,
      platformFeePercentage: 5,
      loanStatus: "awaiting_vouchers",
    })
    setPreviousScreenForCancel(undefined)
    setCurrentScreen("LOAN_APPLICATION_SUCCESS") // Then to LOAN_STATUS
  }

  const handleApplicationSuccessContinue = () => {
    setCurrentScreen("LOAN_STATUS")
  }

  const handleLoanFundedSuccessContinueToDashboard = () => {
    setCurrentScreen("LOAN_DASHBOARD")
  }

  const handleAskForNewLoan = () => {
    setPreviousScreenForCancel(currentScreen)
    setUserLoanDetails((prev) => ({
      ...prev,
      originalLoanAmount: 0,
      amountActuallyFundedByVouchers: 0,
      totalPaidOnCurrentLoan: 0,
      currentScore: 0,
      remainingBalanceToRepay: 0,
      purpose: "",
      vouchers: [],
      loanStatus: "pending_approval",
    }))
    setCurrentScreen("LOAN_APPLICATION")
  }

  const handleCancelFlow = () => {
    if (previousScreenForCancel) {
      setCurrentScreen(previousScreenForCancel)
    } else {
      setCurrentScreen(
        userLoanDetails.originalLoanAmount > 0 && userLoanDetails.loanStatus !== "completed"
          ? "LOAN_DASHBOARD"
          : "LOAN_APPLICATION",
      )
    }
    setPreviousScreenForCancel(undefined)
  }

  const handleShareUserLoanToVouchingView = () => {
    setCommunityLoanToVouchFor({
      borrowerName: userLoanDetails.borrowerName,
      amount: userLoanDetails.originalLoanAmount,
      purpose: userLoanDetails.purpose,
      fundedAmount: 0,
      vouchersCount: userLoanDetails.vouchers.length,
      repaymentDays: userLoanDetails.repaymentDays,
    })
    setCurrentScreen("COMMUNITY_VOUCHING")
  }

  const handleVouchAction = (vouchedForBorrowerName: string, vouchedAmount: number, message: string) => {
    // ... (currentUserVouchingPower logic remains the same) ...
    const scoreIncreaseForVouching = 25
    const newVouchingPower = currentUserVouchingPower - vouchedAmount
    let updatedLoanFundedByVouchers = 0
    let loanTargetAmount = 0

    if (vouchedForBorrowerName === userLoanDetails.borrowerName) {
      // This is a vouch for the current user's active loan application
      updatedLoanFundedByVouchers = userLoanDetails.amountActuallyFundedByVouchers + vouchedAmount
      loanTargetAmount = userLoanDetails.originalLoanAmount
      const newVoucher: Voucher = {
        name: "Miguel",
        amount: vouchedAmount,
        avatarUrl: "/placeholder.svg?height=40&width=40",
      } // Example: Miguel vouches

      setUserLoanDetails((prevDetails) => {
        const newAmountFundedByVouchers = Math.min(updatedLoanFundedByVouchers, prevDetails.originalLoanAmount)
        return {
          ...prevDetails,
          amountActuallyFundedByVouchers: newAmountFundedByVouchers,
          vouchers: [...prevDetails.vouchers, newVoucher],
          // IMPORTANT: User's repayment score (currentScore) and totalPaidOnCurrentLoan DO NOT change here.
          // User's remainingBalanceToRepay is based on originalLoanAmount (or what's funded) minus what THEY paid.
          // If amountActuallyFundedByVouchers is less than originalLoanAmount, the effective loan is smaller.
          // For simplicity, let's assume the loan is only "active" for repayment once fully voucher-funded.
          loanStatus: newAmountFundedByVouchers >= prevDetails.originalLoanAmount ? "active" : prevDetails.loanStatus,
        }
      })
      // Update lastVouchDetails for the VouchingSuccessScreen
      setLastVouchDetails({
        vouchAmount: vouchedAmount,
        borrowerName: vouchedForBorrowerName,
        loanFundedAmount: updatedLoanFundedByVouchers, // This is total vouched for this loan
        loanTotalAmount: loanTargetAmount, // The target for this loan
        userMessageToBorrower: message,
      })
    } else {
      // Vouching for someone else in the community (communityLoanToVouchFor)
      updatedLoanFundedByVouchers = communityLoanToVouchFor.fundedAmount + vouchedAmount
      loanTargetAmount = communityLoanToVouchFor.amount
      setCommunityLoanToVouchFor((prev) => ({
        ...prev,
        fundedAmount: Math.min(updatedLoanFundedByVouchers, prev.amount),
        vouchersCount: prev.vouchersCount + 1,
      }))
      // Update lastVouchDetails for the VouchingSuccessScreen
      setLastVouchDetails({
        vouchAmount: vouchedAmount,
        borrowerName: vouchedForBorrowerName,
        loanFundedAmount: updatedLoanFundedByVouchers,
        loanTotalAmount: loanTargetAmount,
        userMessageToBorrower: message,
      })
    }
    // ... (rest of the function: setCurrentUserVouchingPower, setCurrentScreen) ...
    setCurrentUserVouchingPower(newVouchingPower < 0 ? 0 : newVouchingPower)
    setCurrentScreen("VOUCHING_SUCCESS")
  }

  const handleVouchingSuccessDone = () => {
    if (lastVouchDetails.borrowerName === userLoanDetails.borrowerName) {
      setCurrentScreen("LOAN_STATUS")
    } else {
      setCurrentScreen(
        userLoanDetails.originalLoanAmount > 0 && userLoanDetails.loanStatus !== "completed"
          ? "LOAN_STATUS"
          : "LOAN_APPLICATION",
      )
    }
  }

  // In handlePayNow
  const handlePayNow = () => {
    if (userLoanDetails.loanStatus === "completed" || userLoanDetails.remainingBalanceToRepay <= 0) return

    const paymentAmount = userLoanDetails.remainingBalanceToRepay
    const newTotalPaid = userLoanDetails.totalPaidOnCurrentLoan + paymentAmount

    setPaymentSuccessData({
      paidAmount: paymentAmount, // Amount paid in this transaction
      newRecoveryScore: newTotalPaid, // This is the new score
    })

    setUserLoanDetails((prev) => ({
      ...prev,
      totalPaidOnCurrentLoan: newTotalPaid,
      currentScore: newTotalPaid, // Score = newTotalPaid
      remainingBalanceToRepay: prev.originalLoanAmount - newTotalPaid,
      loanStatus: "completed",
    }))
    setCurrentScreen("PAYMENT_SUCCESS")
  }

  const handlePaymentSuccessContinue = () => {
    handleAskForNewLoan()
  }

  const handleNavigateNotReadyToPay = () => {
    setPreviousScreenForCancel(currentScreen)
    setCurrentScreen("NOT_READY_TO_PAY_WARNING")
  }

  const handleConfirmNotReadyToPay = () => {
    setPreviousScreenForCancel("LOAN_DASHBOARD")
    setCurrentScreen("COMMUNITY_DECISION")
  }

  const handleUserPreferenceSelected = (preference: PreferenceOption) => {
    console.log("User preferred:", preference)
    setPreviousScreenForCancel("COMMUNITY_DECISION")

    if (preference === "pay_smaller") {
      setUserPreferenceDetails({ text: "request to pay a smaller amount.", requestedAmount: 0, type: preference })
      setCurrentScreen("PARTIAL_PAYMENT_SELECTION")
    } else if (preference === "more_time") {
      setUserPreferenceDetails({ text: "request for more time.", requestedAmount: 0, type: preference })
      alert("Selected 'Ask for more time'. Taking you to review status.")
      setCurrentScreen("COMMUNITY_REVIEW_STATUS")
    } else if (preference === "split_payments") {
      setUserPreferenceDetails({ text: "request to split payments.", requestedAmount: 0, type: preference })
      alert("Selected 'Split payments'. Taking you to review status.")
      setCurrentScreen("COMMUNITY_REVIEW_STATUS")
    } else {
      setCurrentScreen("LOAN_DASHBOARD")
      setPreviousScreenForCancel(undefined)
    }
  }

  const handlePartialPaymentConfirmed = (partialAmount: number) => {
    console.log("Partial payment confirmed by user:", partialAmount)
    setUserPreferenceDetails({
      text: `request to pay $${partialAmount.toFixed(2)} for now.`,
      requestedAmount: partialAmount,
      type: "pay_smaller",
    })
    setPreviousScreenForCancel("PARTIAL_PAYMENT_SELECTION")
    setCurrentScreen("COMMUNITY_REVIEW_STATUS")
  }

  const handleUpdatePreference = () => {
    setPreviousScreenForCancel("LOAN_DASHBOARD")
    setCurrentScreen("COMMUNITY_DECISION")
  }

  // In handleCommunityApprovalSuccessContinue
  const handleCommunityApprovalSuccessContinue = () => {
    if (userPreferenceDetails.type === "pay_smaller" && userPreferenceDetails.requestedAmount > 0) {
      const paymentAmount = userPreferenceDetails.requestedAmount
      const newTotalPaid = userLoanDetails.totalPaidOnCurrentLoan + paymentAmount
      const newRemainingBalance = userLoanDetails.originalLoanAmount - newTotalPaid

      // Update userLoanDetails state
      setUserLoanDetails((prev) => ({
        ...prev,
        totalPaidOnCurrentLoan: newTotalPaid,
        currentScore: newTotalPaid, // Score = newTotalPaid
        remainingBalanceToRepay: newRemainingBalance,
        loanStatus: newRemainingBalance <= 0 ? "completed" : prev.loanStatus, // Update status if fully paid
      }))

      // For displaying on a success/transition screen or dashboard
      setTempDashboardData({
        originalAmount: userLoanDetails.originalLoanAmount,
        paidThisTime: paymentAmount,
        remainingAmount: newRemainingBalance,
      })

      alert(
        `Partial payment of $${paymentAmount.toFixed(2)} processed. New score: ${newTotalPaid}. Remaining: $${newRemainingBalance.toFixed(2)}`,
      )

      if (newRemainingBalance <= 0) {
        // If this partial payment completes the loan
        setPaymentSuccessData({ paidAmount: paymentAmount, newRecoveryScore: newTotalPaid })
        setCurrentScreen("PAYMENT_SUCCESS")
      } else {
        setCurrentScreen("LOAN_DASHBOARD")
      }
    } else if (userPreferenceDetails.type === "more_time") {
      // ... (logic for more time - score doesn't change here)
      setUserLoanDetails((prev) => ({ ...prev, loanStatus: "active" })) // Or 'overdue' if it was
      setCurrentScreen("LOAN_DASHBOARD")
    } else if (userPreferenceDetails.type === "split_payments") {
      // ... (logic for split payments - score doesn't change here)
      setUserLoanDetails((prev) => ({ ...prev, loanStatus: "active" })) // Or 'overdue' if it was
      setCurrentScreen("LOAN_DASHBOARD")
    } else {
      setCurrentScreen("LOAN_DASHBOARD")
    }
    setPreviousScreenForCancel(undefined)
  }

  // This handler is for the NotReadyToPayScreen's "I'm not ready to pay" button
  // It currently leads to COMMUNITY_DECISION.
  // If COMMUNITY_DECISION leads to no agreement, then a default might occur.
  // For now, handleConfirmNotReadyToPay leads to community decision.
  // Let's add a new handler for when community decision fails or no option is chosen.
  const handleLoanDefault = () => {
    setUserLoanDetails((prev) => ({
      ...prev,
      loanStatus: "defaulted",
      // currentScore and totalPaidOnCurrentLoan remain as they were.
      // The 'defaulted' status is the penalty.
    }))
    // Navigate to a screen explaining the default.
    alert(
      `Loan status set to defaulted. Your score of ${userLoanDetails.currentScore} reflects what was paid, but you are now in default.`,
    )
    setCurrentScreen("LOAN_DASHBOARD") // Or a specific "Loan Defaulted" screen
  }

  const getRepaymentDetails = () => {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + userLoanDetails.repaymentDays)
    const repaymentAmount = userLoanDetails.originalLoanAmount * (1 + userLoanDetails.platformFeePercentage / 100)
    return {
      dueDateString: dueDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      amount: repaymentAmount,
    }
  }

  switch (currentScreen) {
    case "LOAN_APPLICATION":
      return (
        <LoanApplication
          onLoanSubmitted={handleLoanSubmitted}
          onCancel={previousScreenForCancel ? handleCancelFlow : undefined}
        />
      )
    case "LOAN_APPLICATION_SUCCESS":
      return (
        <LoanSuccessScreen
          loanAmount={userLoanDetails.originalLoanAmount}
          loanPurpose={userLoanDetails.purpose}
          onContinue={handleApplicationSuccessContinue}
        />
      )
    case "LOAN_STATUS":
      return (
        <LoanStatusScreen
          loanAmount={userLoanDetails.originalLoanAmount} // The target loan amount
          loanPurpose={userLoanDetails.purpose}
          amountFundedByVouchers={userLoanDetails.amountActuallyFundedByVouchers} // Pass this new state
          userRepaymentAmount={userLoanDetails.totalPaidOnCurrentLoan} // How much user has paid
          vouchers={userLoanDetails.vouchers}
          score={userLoanDetails.currentScore} // User's repayment score
          onAskForNewLoan={handleAskForNewLoan}
          // Share if loan is not fully voucher-funded OR if user wants to share progress (more complex)
          // For now, share if more voucher funds are needed:
          onShare={
            userLoanDetails.amountActuallyFundedByVouchers < userLoanDetails.originalLoanAmount
              ? handleShareUserLoanToVouchingView
              : undefined
          }
          onPayNow={handlePayNow}
          onNotReadyToPay={handleNavigateNotReadyToPay}
          loanStatus={userLoanDetails.loanStatus} // Pass the loan status
        />
      )
    case "COMMUNITY_VOUCHING":
      return (
        <CommunityVouchingScreen
          currentUserScore={userLoanDetails.currentScore}
          borrowerName={communityLoanToVouchFor.borrowerName}
          loanAmount={communityLoanToVouchFor.amount}
          loanFundedAmount={communityLoanToVouchFor.fundedAmount}
          loanPurpose={communityLoanToVouchFor.purpose}
          existingVouchersCount={communityLoanToVouchFor.vouchersCount}
          repaymentDays={communityLoanToVouchFor.repaymentDays}
          onVouch={handleVouchAction}
          onAskForLoan={handleAskForNewLoan}
          currentUserVouchingPower={currentUserVouchingPower}
        />
      )
    case "LOAN_FUNDED_SUCCESS":
      const repayment = getRepaymentDetails()
      // const previousScoreForDisplay = userLoanDetails.previousAppScoreForDisplay
      return (
        <LoanFundedSuccessScreen
          loanAmount={userLoanDetails.originalLoanAmount}
          currencySymbol="R$"
          vouchers={userLoanDetails.vouchers}
          repaymentDueDate={repayment.dueDateString}
          repaymentAmount={repayment.amount}
          platformFeePercentage={userLoanDetails.platformFeePercentage}
          previousScore={userLoanDetails.currentScore}
          newScore={userLoanDetails.currentScore}
          onUseFunds={() => alert("Navigating to use funds (simulated)...")}
          onGoToDashboard={handleLoanFundedSuccessContinueToDashboard}
        />
      )
    case "VOUCHING_SUCCESS":
      return (
        <VouchingSuccessScreen
          borrowerName={lastVouchDetails.borrowerName}
          vouchAmount={lastVouchDetails.vouchAmount}
          currencySymbol="R$"
          loanFundedAmount={lastVouchDetails.loanFundedAmount}
          loanTotalAmount={lastVouchDetails.loanTotalAmount}
          userMessageToBorrower={lastVouchDetails.userMessageToBorrower}
          scoreIncrease={25}
          newVouchingScore={userLoanDetails.currentScore}
          remainingVouchingPower={currentUserVouchingPower}
          repaymentDays={
            lastVouchDetails.borrowerName === userLoanDetails.borrowerName
              ? userLoanDetails.repaymentDays
              : communityLoanToVouchFor.repaymentDays
          }
          onViewHistory={() => alert("Navigating to vouching history (simulated)...")}
          onDone={handleVouchingSuccessDone}
        />
      )
    case "LOAN_DASHBOARD":
      if (userLoanDetails.loanStatus === "completed") {
        // Simplified condition
        // If loan is completed, perhaps show a summary or option for new loan
        // For now, redirecting to application if completed.
        return (
          <LoanApplication
            onLoanSubmitted={handleLoanSubmitted}
            onCancel={previousScreenForCancel ? handleCancelFlow : undefined}
          />
        )
      }
      // Default dashboard view using userLoanDetails directly
      return (
        <LoanDashboardScreen
          score={userLoanDetails.currentScore}
          currentLoanAmount={userLoanDetails.remainingBalanceToRepay}
          originalLoanAmount={userLoanDetails.originalLoanAmount}
          amountPaid={userLoanDetails.totalPaidOnCurrentLoan}
          loanPurpose={userLoanDetails.purpose}
          vouchersCount={userLoanDetails.vouchers.length} // Or adjust if vouchers are not relevant here
          onPayNow={handlePayNow} // This will pay the remainingBalance
          onNotReadyToPay={userLoanDetails.loanStatus !== "defaulted" ? handleNavigateNotReadyToPay : undefined}
          onAskForNewLoan={handleAskForNewLoan}
          currencySymbol="R$"
          isOverdue={userLoanDetails.loanStatus === "overdue" || userLoanDetails.loanStatus === "defaulted"}
          // isFullyFundedMessage: This message might not be relevant anymore if score is 0 initially.
          // It was for when the loan was just funded by vouchers.
        />
      )
    case "PAYMENT_SUCCESS":
      return (
        <PaymentSuccessScreen
          paidAmount={paymentSuccessData.paidAmount}
          currencySymbol="R$"
          newRecoveryScore={paymentSuccessData.newRecoveryScore}
          onContinue={handlePaymentSuccessContinue}
        />
      )
    case "NOT_READY_TO_PAY_WARNING":
      return <NotReadyToPayScreen onCancel={handleCancelFlow} onConfirmNotReady={handleConfirmNotReadyToPay} />
    case "COMMUNITY_DECISION":
      return (
        <CommunityDecisionScreen
          onCancel={handleCancelFlow}
          loanAmount={userLoanDetails.originalLoanAmount}
          loanPurpose={userLoanDetails.purpose}
          currencySymbol="R$"
          onSelectPreference={handleUserPreferenceSelected}
        />
      )
    case "PARTIAL_PAYMENT_SELECTION":
      return (
        <PartialPaymentScreen
          onCancel={handleCancelFlow}
          loanAmount={userLoanDetails.originalLoanAmount}
          loanPurpose={userLoanDetails.purpose}
          currencySymbol="R$"
          onConfirmPayment={handlePartialPaymentConfirmed}
        />
      )
    case "COMMUNITY_REVIEW_STATUS":
      return (
        <CommunityReviewStatusScreen
          currentScore={userLoanDetails.currentScore}
          loanAmount={userLoanDetails.originalLoanAmount}
          loanPurpose={userLoanDetails.purpose}
          currencySymbol="R$"
          requestedPreferenceText={userPreferenceDetails.text}
          onUpdatePreference={handleUpdatePreference}
        />
      )
    case "COMMUNITY_APPROVAL_SUCCESS":
      return (
        <CommunityApprovalSuccessScreen
          approvedAmount={userPreferenceDetails.requestedAmount}
          currencySymbol="R$"
          onContinue={handleCommunityApprovalSuccessContinue}
        />
      )
    default:
      return (
        <LoanApplication
          onLoanSubmitted={handleLoanSubmitted}
          onCancel={previousScreenForCancel ? handleCancelFlow : undefined}
        />
      )
  }
}
