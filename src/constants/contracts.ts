import { getAddress } from 'viem'

type ChainContracts = {
  name: string
  bitguess: string
  usdc: string
}

export const SUPPORTED_CHAINS: Record<number, ChainContracts> = {
  11155111: {
    name: 'Sepolia',
    bitguess: getAddress('0xb5f421de908071e763ea621fc37a61ec4959d242'),
    usdc: getAddress('0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'),
  },
  31337: {
    name: 'Anvil',
    bitguess: getAddress('0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'),
    usdc: getAddress('0x5fbdb2315678afecb367f032d93f642f64180aa3'),
  },
  80002: {
    name: 'PolygonAmoy',
    bitguess: getAddress('0x89abd5077d770f5149428736ac4dd6bF9070580F'),
    usdc: getAddress('0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582'),
  },
}
