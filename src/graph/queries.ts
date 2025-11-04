import { gql } from 'graphql-request'

export const GET_MARKETS = gql`
  query {
    markets(orderBy: id, orderDirection: desc) {
      id
      question
      targetPrice
      deadline
      resolved
      outcome
      createdAt
      resolvedAt
      volume
      yesQty
      noQty
    }
  }
`