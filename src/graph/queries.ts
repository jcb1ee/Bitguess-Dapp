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

export const GET_CLAIMED_REWARD = gql`
  query ($marketId: BigInt!, $user: Bytes!) {
    claimeds(
      where: { marketId: $marketId, user: $user }
      orderBy: blockTimestamp
      orderDirection: desc
      first: 1
    ) {
      reward
    }
  }
`