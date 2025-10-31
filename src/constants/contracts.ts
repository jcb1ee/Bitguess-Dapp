type ChainContracts = {
  name: string
  bitguess: string
  usdc: string
}

export const SUPPORTED_CHAINS: Record<number, ChainContracts> = {
  11155111: {
    name: 'Sepolia',
    bitguess: '0xYourBitGuessAddressOnSepolia',
    usdc: '0xYourUSDCAddressOnSepolia',
  },
  31337: {
    name: 'Anvil',
    bitguess: '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707', // TODO: update
    usdc: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9', // TODO: update
  },
  // TODO: add support for Polygon Amoy
  80002: {
    name: 'PolygonAmoy',
    bitguess: '0xYourBitGuessAddressOnPolygon',
    usdc: '0xYourUSDCAddressOnPolygon',
  },
}
