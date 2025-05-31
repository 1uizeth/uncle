export type LoanApplicationData = {
  amount: number
  purpose: string
}

export type LoanFormProps = {
  onSubmit?: (data: LoanApplicationData) => void
  onCancel?: () => void
}
