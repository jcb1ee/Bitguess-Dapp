import { Outlet } from 'react-router-dom'

import Header from './Header'
import { useLoading } from '../context/LoadingContext'



function Layout() {
  const { loadingMessage } = useLoading()
  
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1 w-full mx-auto px-4 sm:px-6 lg:px-26 text-white'>
          <>
            {loadingMessage && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-neutral-900 p-6 rounded-lg text-white text-center shadow-lg'>
                  <div className='animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full mx-auto mb-4'></div>
                  <p className='text-lg font-medium'>{loadingMessage}</p>
                </div>
              </div>
            )}
            <Outlet />
          </>
      </main>

      <footer className='bg-gray-800 text-center p-4'>
        <p className='text-sm'>&copy; {new Date().getFullYear()} Bitguess</p>
      </footer>
    </div>
  )
}

export default Layout