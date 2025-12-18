type ChainContracts = {
  name: string
  bitguess: string
  usdc: string
}

export const SUPPORTED_CHAINS: Record<number, ChainContracts> = {
  11155111: {
    name: 'Sepolia',
    bitguess: '0xb5f421de908071e763ea621fc37a61ec4959d242',
    usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  },
  31337: {
    name: 'Anvil',
    bitguess: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
    usdc: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  },
  80002: {
    name: 'PolygonAmoy',
    bitguess: '0x5E192C6B73b250B729aed610E0D30b452637273A',
    usdc: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
  },
}
