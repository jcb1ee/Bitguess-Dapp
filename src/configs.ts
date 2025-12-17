// src/configs.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  sepolia,
  polygonAmoy,
  anvil
} from 'wagmi/chains'
import { http } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'Bitguess',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!, // Get this from https://cloud.walletconnect.com
  chains: [sepolia, polygonAmoy, anvil],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
    [polygonAmoy.id]: http(import.meta.env.VITE_AMOY_RPC_URL),
    [anvil.id]: http(import.meta.env.VITE_ANVIL_RPC_URL),
  }
})