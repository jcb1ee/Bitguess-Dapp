import { useAccount, useChainId } from 'wagmi'
// import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import logo from './assets/bitguess_logo_white.png'
import { SUPPORTED_CHAINS } from './constants/contracts'

function App() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const contracts = SUPPORTED_CHAINS[chainId]
  const chainName = contracts ? contracts.name : 'Unsupported Chain'

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <header className='sticky top-0 z-50 w-full bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt='Bitguess Logo' className='h-12' />
            <span className='text-xl font-bold text-white'>Bitguess</span>
          </div>

          <ConnectButton />
        </header>

        <main className='flex-1 p-6 text-white'>
          <p className='text-xl'>Bitguess</p>
          <p className='text-sm text-gray-400'>Chain: {chainName}</p>
          {isConnected && <p className='text-green-400'>Wallet connected ✅</p>}
        </main>
      </div>
    </>
  )
}

export default App
