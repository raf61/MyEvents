import './globals.css'
import { Inter } from 'next/font/google'
import Provider from '../context/Provider' 
import TicketCartProvider from '@/context/TicketCartProvider'
import ProgressBarProvider from '@/context/ProgressBarProvider'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    template: "%s | MyEvents",
    default:"MyEvents"
  },
  description: 'MyEvents is your comprehensive solution for organizing and managing events. From ticketing and registration to event management, MyEvents provides you the tools you need to create memorable experiences',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ToastContainer
      pauseOnHover={false}
      autoClose={3000}

      />

        <TicketCartProvider>
          <Provider>
            <ProgressBarProvider>
              {children}
            </ProgressBarProvider>
          </Provider>
        </TicketCartProvider>
      </body>
    </html>
  )
}
