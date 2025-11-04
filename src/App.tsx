import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { fetchAllMarkets } from './graph/graphService'
// import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import logo from './assets/bitguess_logo_white.png'
import { SUPPORTED_CHAINS } from './constants/contracts'
import {MarketCard} from './components/MarketCard'
import type { Market } from './types/market'
import BitguessAbi from './abi/BitGuess.json'
import UsdcAbi from './abi/MockUSDC.json'
import { config } from './configs'
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function App() {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const contracts = SUPPORTED_CHAINS[chainId]
  const chainName = contracts ? contracts.name : 'Unsupported Chain'

  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [deadline, setDeadline] = useState('')

  const [markets, setMarkets] = useState<Market[]>([])
    useEffect(() => {
    fetchAllMarkets(chainId)
      .then(setMarkets)
      .catch(err => {
        console.error('Failed to fetch markets:', err)
      })
  }, [chainId])

  const handleCreateClick = () => {
    if (!isConnected || chainName === 'Unsupported Chain') {
      alert('Connect wallet and switch to a supported network.')
      return
    }
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !deadline.trim()) {
      alert('All fields are required.')
      return
    }

    if (!targetPrice || isNaN(Number(targetPrice))) {
      alert('Target price must be a valid number.')
      return
    }

    const deadlineTime = dayjs(deadline).utc().valueOf(); // UTC timestamp in ms
    const now = dayjs().utc().valueOf();
    const tenMinutes = 10 * 60 * 1000;

    if (deadlineTime - now < tenMinutes) {
      alert('Deadline must be at least 10 minutes from now.');
      return;
    }

    try {
      const approveTx = await  writeContract(config, {
        abi: UsdcAbi,
        address: contracts.usdc as `0x${string}`,
        functionName: 'approve',
        args: [contracts.bitguess, BigInt(1e6)], // 1 USDC
        account: address,
      })
      const approveReceipt = await waitForTransactionReceipt(config, { hash: approveTx })
      console.log('✅ USDC approved receipt:', approveReceipt)

      const createTx = await writeContract(config, {
        abi: BitguessAbi,
        address: contracts.bitguess as `0x${string}`,
        functionName: 'createMarket',
        args: [
          title,
          BigInt(targetPrice), // TODO: handle decimals
          BigInt(dayjs(deadline).unix())  // convert to UNIX timestamp,
        ],
      })
      const receipt = await waitForTransactionReceipt(config, { hash: createTx })
      console.log('✅ Market created:', receipt)

      console.log('tx hash', createTx)
      alert('Market submitted!')
      
    } catch (err) {
      console.error('Error creating market:', err)
    }

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
            {markets.map((market) => (
              <MarketCard
                key={market.id}
                market={{
                  id: market.id,
                  price: Number(market.targetPrice),
                  title: market.question,
                  deadline: market.deadline, // convert UNIX timestamp
                  volume: Number(market.volume),
                  yesQty: Number(market.yesQty),
                  noQty: Number(market.noQty),
                  resolved: market.resolved,
                }}
                contracts={contracts}
              />
            ))}
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
