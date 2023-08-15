'use client'

import { signIn} from "next-auth/react"
import Container from "../../layout/Container"
import {FcGoogle} from 'react-icons/fc'
import { useSearchParams } from "next/navigation"



export default function Login(){
    let params = useSearchParams()
    let to = params.get('to')
    if (typeof to != 'string' || to.startsWith("http") || to.startsWith("//")){
        to = null
    }

    const providerIcons = {
        "google": <FcGoogle size={30} />
    }

    

    return (
        <main className="mt-10">
            <Container>

            <div>
                <h1 className="text-center text-3xl mb-5">Sign in</h1>
                <div className="flex justify-center">
                    <button type='button' onClick={() => {
                        signIn('google', {
                            callbackUrl: to || '/menu'
                        })
                    }} className='flex items-center gap-2 p-1 px-2 border rounded-full'>
                        <span>{providerIcons['google']}</span>
                        <span>Login with Google</span>
                    </button>
                </div>

            </div>

            </Container>
        </main>
    )
}