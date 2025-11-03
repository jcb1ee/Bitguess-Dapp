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
    bitguess: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0', // TODO: update
    usdc: '0x5fbdb2315678afecb367f032d93f642f64180aa3', // TODO: update
  },
  // TODO: add support for Polygon Amoy
  80002: {
    name: 'PolygonAmoy',
    bitguess: '0xYourBitGuessAddressOnPolygon',
    usdc: '0xYourUSDCAddressOnPolygon',
  },
}
