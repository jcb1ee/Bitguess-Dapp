// src/configs.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  sepolia,
  polygonAmoy,
  anvil
} from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'BitGuess',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!, // Get this from https://cloud.walletconnect.com
  chains: [sepolia, polygonAmoy, anvil],
})