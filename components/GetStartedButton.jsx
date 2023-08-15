'use client'
import Link from "next/link";
import { useSession } from "next-auth/react"

const GetStartedButton = () => {
    const {status, data:session} = useSession()
    
  return (
    <Link href={status !== "authenticated" ? '/login' : '/menu' }>
        <button
            className="cta_button"          
            >Get Started
        </button>
      </Link>
  )
}

export default GetStartedButton