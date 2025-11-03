import { SUBGRAPH_URLS } from './client'
import { GET_MARKETS } from './queries'
import type { Market } from '../types/market'


type GetMarketsResponse = {
  markets: Market[]
}

export async function fetchAllMarkets(chainId: number): Promise<Market[]> {
  const subgraph = SUBGRAPH_URLS[31337] //TODO: replace with chainId when ready

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