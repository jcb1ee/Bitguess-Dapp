import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import logo from '../assets/bitguess_logo_white.png'

function Header() {
  return (
    <header className='sticky top-0 z-50 w-full bg-gray-800 border-b border-white/10 px-4 sm:px-6 lg:px-26 py-3 flex items-center justify-between'>
      <Link to='/'  className='flex items-center space-x-2'>
        <img src={logo} alt='Bitguess Logo' className='h-12' />
        <span className='text-xl font-bold text-white'>Bitguess</span>
      </Link>
      <ConnectButton />
    </header>
  )
}

export default Header

