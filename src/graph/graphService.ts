import { SUBGRAPH_URLS } from './client'
import { GET_MARKETS, GET_CLAIMED_REWARD } from './queries'
import type { Market } from '../types/market'


type GetMarketsResponse = {
  markets: Market[]
}

export async function fetchAllMarkets(chainId: number): Promise<Market[]> {
  const subgraph = SUBGRAPH_URLS[chainId]

  if (!subgraph || !subgraph.url) {
    throw new Error(`Subgraph client not found for chainId ${chainId}`)
  }

  try {
    const data = await subgraph.url.request<GetMarketsResponse>(GET_MARKETS)
    if (!data || !data.markets) {
      throw new Error(`No markets field in GraphQL response: ${JSON.stringify(data)}`)
    }

    return data.markets
  } catch (err) {
    console.error('❌ Failed to fetch markets:', err)
    throw err
  }
}

export async function fetchClaimedReward(chainId: number, marketId: string, user: string): Promise<number | null> {
  const subgraph = SUBGRAPH_URLS[chainId]
  
  if (!subgraph?.url) return null

  try {
    const data = await subgraph.url.request(GET_CLAIMED_REWARD, {
      marketId,
      user,
    })

    const reward = data?.claimeds?.[0]?.reward
    return reward ? Number(reward) / 1e6 : null
  } catch (err) {
    console.error('Failed to fetch claimed reward:', err)
    return null
  }
}