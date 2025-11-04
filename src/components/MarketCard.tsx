import clsx from 'clsx'
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import { parseUnits, formatUnits } from 'viem'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import BitguessAbi from '../abi/BitGuess.json'
import UsdcAbi from '../abi/MockUSDC.json'
import { config } from '../configs'

type MarketCardProps = {
  market: {
    id: string
    title: string
    price: number
    deadline: string
    volume: number
    yesQty: number
    noQty: number
    resolved: boolean
    outcome?: 'YES' | 'NO'
  }
  contracts: {
    bitguess: string
    usdc: string
  }
}

export function MarketCard({ market, contracts }: MarketCardProps) {
  const OUTCOME_YES = 0;
  const OUTCOME_NO = 1;

  async function stakeOnMarket(
    marketId: string,
    outcome: 0 | 1,
    contracts: { bitguess: string; usdc: string }
  ) {
    try {
      const input = prompt(`Enter USDC amount to stake on ${outcome === 0 ? 'YES' : 'NO'}`)
      if (!input) return
      const amount = parseUnits(input, 6) // 6 decimals for USDC

      // Step 1: Approve USDC
      const approveTx = await writeContract(config, {
        abi: UsdcAbi,
        address: contracts.usdc as `0x${string}`,
        functionName: 'approve',
        args: [contracts.bitguess, amount],
      })
      await waitForTransactionReceipt(config, { hash: approveTx })

      // Step 2: Stake on market
      const stakeTx = await writeContract(config, {
        abi: BitguessAbi,
        address: contracts.bitguess as `0x${string}`,
        functionName: 'stakeOnMarket',
        args: [BigInt(marketId), outcome, amount],
      })
      const receipt = await waitForTransactionReceipt(config, { hash: stakeTx })
      console.log('✅ Stake confirmed', receipt)
      alert(`✅ Staked ${input} USDC on ${outcome === 0 ? 'YES' : 'NO'}!`)
    } catch (err) {
      console.error('Error staking on market:', err)
      alert('❌ Staking failed. See console.')
    }
  }

  return (
    <div className='rounded-xl border border-white/10 bg-neutral-800 p-6 shadow-md flex flex-col gap-4 m-4 w-full sm:w-[300px]'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-white'>{market.title}</h2>
        {market.resolved && (
          <span className='px-2 py-1 rounded-full text-xs font-bold bg-green-700 text-white'>
            RESOLVED
          </span>
        )}
      </div>

      {/* Info Row */}
      <div className='text-sm text-gray-400 flex flex-wrap gap-4'>
        <span>⏰ Deadline: {dayjs.unix(Number(market.deadline)).utc().format('YYYY-MM-DD HH:mm')} (UTC)</span>
        <span>🎯 Target Price: {market.price} USDC</span>
        <span>💰 Volume: {formatUnits(BigInt(market.volume), 6)} USDC</span>
        <span>✅ Yes: {market.yesQty}</span>
        <span>❌ No: {market.noQty}</span>
      </div>

      {/* Outcome / Stake Buttons */}
      <div>
        {market.resolved ? (
          <div
            className={clsx(
              'text-lg font-bold mt-2',
              market.outcome === 'YES' ? 'text-green-400' : 'text-red-400'
            )}
          >
            Outcome: {market.outcome}
          </div>
        ) : (
          <div className='flex gap-4 mt-2'>
            <button
              onClick={() => stakeOnMarket(market.id.toString(), OUTCOME_YES, contracts)}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
            >
              Stake YES
            </button>
            <button
             onClick={() => stakeOnMarket(market.id.toString(), OUTCOME_NO, contracts)}
              className='flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition'
            >
              Stake NO
            </button>
          </div>
        )}
      </div>
    </div>
  )
}