import clsx from 'clsx'

export function MarketCard({
  market,
  onStakeYes,
  onStakeNo,
}: {
  market: {
    id: number
    title: string
    deadline: string
    volume: number
    yesQty: number
    noQty: number
    resolved: boolean
    outcome?: 'YES' | 'NO'
  }
  onStakeYes?: () => void
  onStakeNo?: () => void
}) {
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
        <span>⏰ Deadline: {market.deadline}</span>
        <span>💰 Volume: {market.volume} USDC</span>
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
              onClick={onStakeYes}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
            >
              Stake YES
            </button>
            <button
              onClick={onStakeNo}
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