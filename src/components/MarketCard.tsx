import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { writeContract, waitForTransactionReceipt, readContract } from 'wagmi/actions'
import { parseUnits, formatUnits } from 'viem'
import BitguessAbi from '../abi/BitGuess.json'
import UsdcAbi from '../abi/MockUSDC.json'
import { config } from '../configs'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
dayjs.extend(utc)
dayjs.extend(duration)

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
  const { isConnected, address } = useAccount()
  const OUTCOME_YES = 0;
  const OUTCOME_NO = 1;

  const deadline = dayjs.unix(Number(market.deadline)).utc()
  const now = dayjs.utc()
  const isStakingDisabled = now.isAfter(deadline) || market.resolved

  const [claimable, setClaimable] = useState<bigint>(0n)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    if (market.resolved && isConnected && address) {
      (async () => {
        try {
          // Check if user already claimed
          const hasClaimed = await readContract(config, {
            abi: BitguessAbi,
            address: contracts.bitguess as `0x${string}`,
            functionName: 's_claimed',
            args: [BigInt(market.id), address],
          })

          setClaimed(hasClaimed as boolean)

          // Check claimable amount (optional if already claimed)
          const claimableAmount = await readContract(config, {
            abi: BitguessAbi,
            address: contracts.bitguess as `0x${string}`,
            functionName: 'claimableAmount',
            args: [BigInt(market.id), address],
          })

          setClaimable(claimableAmount as bigint)
        } catch (err) {
          console.error('Error checking claim status:', err)
        }
      })()
    }
  }, [market.id, market.resolved, isConnected, address, config, contracts.bitguess])

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

  function getTimeLeft(deadline: number): string {
    const now = dayjs.utc()
    const end = dayjs.unix(deadline).utc()
    const diff = end.diff(now)

    if (diff <= 0) return 'Deadline passed'

    const dur = dayjs.duration(diff)
    const days = dur.days()
    const hours = dur.hours()
    const minutes = dur.minutes()

    const parts = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)

    return parts.join(' ') || 'Less than a minute'
  }

  async function handleClaim() {
    try {
      const txHash = await writeContract(config, {
        abi: BitguessAbi,
        address: contracts.bitguess as `0x${string}`,
        functionName: 'claimWinnings',
        args: [market.id],
      })

      const receipt = await waitForTransactionReceipt(config, { hash: txHash })
      console.log('✅ Claimed winnings:', receipt)
      alert('Rewards claimed!')

      setClaimed(true)
    } catch (err) {
      console.error('❌ Error claiming winnings:', err)
      alert('Error claiming winnings.')
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
        <span className='text-sm text-gray-400'>
          🕒 Time Left: {getTimeLeft(Number(market.deadline))}
        </span>
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
              disabled={isStakingDisabled}
              onClick={() => stakeOnMarket(market.id.toString(), OUTCOME_YES, contracts)}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-500'
            >
              Stake YES
            </button>
            <button
              disabled={isStakingDisabled}
              onClick={() => stakeOnMarket(market.id.toString(), OUTCOME_NO, contracts)}
              className='flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-500'
            >
              Stake NO
            </button>
          </div>
        )}
        {market.resolved && (
          <>
            {claimed ? (
              <p className='text-green-400 font-medium mt-2'>
                ✅ You claimed your winnings of {Number(claimable) / 1e6} USDC.
              </p>
            ) : claimable && claimable > 0n ? (
              <button
                onClick={handleClaim}
                className='w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition'
              >
                🎉 Claim Reward ({Number(claimable) / 1e6} USDC)
              </button>
            ) : (
              <p className='text-gray-400 mt-2 italic'>You have no winnings to claim for this market.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}