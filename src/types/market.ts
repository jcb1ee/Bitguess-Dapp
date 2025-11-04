export type Market = {
  id: string
  question: string
  targetPrice: string
  deadline: string
  resolved: boolean
  outcome: boolean | null
  createdAt: string
  resolvedAt: string | null
  volume: string
  yesQty: string
  noQty: string
}