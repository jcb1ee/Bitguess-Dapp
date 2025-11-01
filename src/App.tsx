import { useAccount, useChainId } from 'wagmi'
// import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import logo from './assets/bitguess_logo_white.png'
import { SUPPORTED_CHAINS } from './constants/contracts'
import {MarketCard} from './components/MarketCard'

function App() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const contracts = SUPPORTED_CHAINS[chainId]
  const chainName = contracts ? contracts.name : 'Unsupported Chain'

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <header className='sticky top-0 z-50 w-full bg-black border-b border-white/10 px-4 sm:px-6 lg:px-26 py-3 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt='Bitguess Logo' className='h-12' />
            <span className='text-xl font-bold text-white'>Bitguess</span>
          </div>

          <ConnectButton />
        </header>

        <main className='flex-1 w-full mx-auto px-4 sm:px-6 lg:px-26 text-white'>
          <div className='flex flex-wrap gap-6 justify-center mt-4'>
            <div className='flex flex-wrap gap-6 justify-center'>

            <MarketCard
              market={{
                id: 1,
                title: 'Will BTC close above $35,000 on Dec 15?',
                deadline: 'Dec 15, 2025',
                volume: 1200,
                yesQty: 34,
                noQty: 22,
                resolved: false,
              }}
              onStakeYes={() => console.log('YES')}
              onStakeNo={() => console.log('NO')}
            />
            <MarketCard
              market={{
                id: 1,
                title: 'Will BTC close above $35,000 on Dec 15?',
                deadline: 'Dec 15, 2025',
                volume: 1200,
                yesQty: 34,
                noQty: 22,
                resolved: true,
                outcome: 'YES',
              }}
              onStakeYes={() => console.log('YES')}
              onStakeNo={() => console.log('NO')}
            />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default App
