import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1 w-full mx-auto px-4 sm:px-6 lg:px-26 text-white'>
        <Outlet />
      </main>

      <footer className='bg-gray-800 text-center p-4'>
        <p className='text-sm'>&copy; {new Date().getFullYear()} Bitguess</p>
      </footer>
    </div>
  )
}

export default Layout