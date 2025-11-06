import { GraphQLClient } from 'graphql-request'

type SubgraphUrl = {
  name: string,
  url: GraphQLClient
}

export const SUBGRAPH_URLS: Record<number, SubgraphUrl> = {
  31337: {
    name: 'Anvil',
    url: new GraphQLClient('http://localhost:8000/subgraphs/name/bitguess-local'),
  },
  11155111: {
    name: 'Sepolia',
    url: new GraphQLClient('https://api.studio.thegraph.com/query/1714670/bitguess/version/latest'),
  },
  // TODO: add Polygon Amoy Subgraph
  80002: {
    name: 'PolygonAmoy',
    url: new GraphQLClient('https://api.studio.thegraph.com/query/48110/bitguess-polygon/version/latest'),
  },
}