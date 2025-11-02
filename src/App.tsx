import { useState } from 'react'
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

  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [deadline, setDeadline] = useState('')

  const handleCreateClick = () => {
    if (!isConnected || chainName === 'Unsupported Chain') {
      alert('Connect wallet and switch to a supported network.')
      return
    }
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!title.trim() || !deadline.trim()) {
      alert('All fields are required.')
      return
    }

    if (!targetPrice || isNaN(Number(targetPrice))) {
      alert('Target price must be a valid number.')
      return
    }

    const deadlineTime = new Date(deadline).getTime()
    const now = Date.now()
    const tenMinutes = 10 * 60 * 1000

    if (deadlineTime - now < tenMinutes) {
      alert('Deadline must be at least 10 minutes from now.')
      return
    }

    // TODO: handle submit
    alert(`Submitting: ${title} @p: ${targetPrice} on ${deadline}`)
    setShowModal(false)
    setTitle('')
    setTargetPrice('')
    setDeadline('')
  }
  
  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <header className='sticky top-0 z-50 w-full bg-gray-800 border-b border-white/10 px-4 sm:px-6 lg:px-26 py-3 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt='Bitguess Logo' className='h-12' />
            <span className='text-xl font-bold text-white'>Bitguess</span>
          </div>
          <ConnectButton />
        </header>

        <main className='flex-1 w-full mx-auto px-4 sm:px-6 lg:px-26 text-white'>
          {/* Create Market Button */}
          <div className='w-full flex justify-center mt-6'>
            <button 
              onClick={handleCreateClick}
              className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition'>
              Create Market
            </button>
          </div>
          {/* All Markets */}
          <div className='flex flex-wrap gap-6 justify-center mt-4'>
            <div className='flex flex-wrap gap-6 justify-center'>
            {/* TODO: fetch and iterate */}
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
          {/* Modal */}
          {showModal && (
          <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50'>
            <div className='bg-neutral-800 p-6 rounded-xl w-full max-w-md shadow-xl'>
              <h2 className='text-lg font-semibold mb-4'>Create New Market</h2>

              <label className='block mb-2 text-sm'>Market Title</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full p-2 rounded bg-neutral-900 text-white border border-white/20 mb-4'
              />

              <label className='block mb-2 text-sm'>Target Price</label>
              <input
                type='number'
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className='w-full p-2 rounded bg-neutral-900 text-white border border-white/20 mb-4'
              />

              <label className='block mb-2 text-sm'>Deadline (UTC)</label>
              <input
                type='datetime-local'
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className='w-full p-2 rounded bg-neutral-900 text-white border border-white/20 mb-6'
              />

              <div className='flex justify-end gap-4'>
                <button
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded'
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </>
  )
}

export default App
