'use client'
import { signOut, useSession } from "next-auth/react";
import Container from "../../layout/Container";
import { useState } from "react";
import Link from "next/link";
import BlackButton from "@/components/BlackButton";
import { toast } from 'react-toastify'
import { useRouter } from "next/navigation";



export default function Account() {
    const router = useRouter()
    const {data:session, update} = useSession()
    const [changingAccountType, setChangingAccountType] = useState(false)

    const handleChangeAccountType = async (e) => {
        e.preventDefault()
        if (!confirm("Are you sure ?")){
            return
        }
        try {
            setChangingAccountType(true)
            
            const API_BASEURL = process.env.API_BASEURL
            let response = await fetch(`${API_BASEURL}/account/change-type`, {
                method: 'PUT'
            })
            response = await response.json()
            if (!response.ok){
                setChangingAccountType(false)
                return toast.error(response.msg)
            }
            
            await update({...session, isEventManager:true})
            router.push("/menu")
            router.refresh()
        } catch (error) {
            setChangingAccountType(false)
            return toast.error("An unexpected error ocurred.")
        }
    }



  return (
    <main>
        <div className="p-4 pb-0">
            <Link href={`/menu`}>
                <BlackButton content={"< Back"}></BlackButton>
            </Link>
        </div>
        <Container>
            <h1 className="text-center text-3xl pb-6 pt-7">Account</h1>
            
            {
                session?.user && (
                    <div className="flex justify-center flex-wrap-reverse mb-52 gap-6">
                        <div className="w-[100%] max-w-xl">
                            <section>
                                <form action="" className="block">
                                    <div className="p-5 border border-gray-200 rounded-md mb-10 mt-0">
                                        <h3 className="font-bold mb-1">Name</h3>
                                        <p className="text-[9pt] text-gray-500">Can`t be changed</p>
                                        <div className="mt-2">
                                            <input type="text" value={session.user.name} readOnly className="form-control
                                            block
                                            w-full
                                            px-3
                                            py-1.5
                                            text-[9pt]
                                            font-normal
                                            text-gray-700
                                            bg-white bg-clip-padding
                                            border border-solid border-gray-300
                                            rounded-lg
                                            transition
                                            ease-in-out
                                            m-0
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-5 border border-gray-200 rounded-md mb-10">
                                        <h3 className="font-bold mb-1">Email</h3>
                                        <p className="text-[9pt] text-gray-500">Can`t be changed</p>
                                        <div className="mt-2">
                                            <input type="email" value={session.user.email} className="form-control
                                            block
                                            w-full
                                            px-3
                                            py-1.5
                                            text-[9pt]
                                            font-normal
                                            text-gray-700
                                            bg-white bg-clip-padding
                                            border border-solid border-gray-300
                                            rounded-lg
                                            transition
                                            ease-in-out
                                            m-0
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            readOnly
                                            />
                                        </div>
                                    </div>
                                    {
                                        session.user.isEventManager == undefined && 
                                        <div className="p-5 border border-gray-200 rounded-md mb-10 mt-0">
                                            <h3 className="font-bold mb-1">Change account type</h3>
                                            <p className="text-[9pt] text-gray-500">This is a irreversible action.</p>
                                            <p className="text-[9pt] text-gray-500">With a Event Producer account you can create and manage your own events.</p>
                                            <button disabled={changingAccountType} onClick={handleChangeAccountType} className="px-3 py-1 bg-black text-white border rounded-md mt-3 disabled:opacity-60">
                                                <span>Get an Event Producer account</span>
                                            </button>

                                        </div>
                                    }
                                </form>
                                <button onClick={() => signOut({
                                    callbackUrl: '/'
                                })} className="bg-red-400 hover:bg-red-500 text-white p-3 py-2 rounded">Sign out</button>
                            </section>
                        </div>

                        
                    </div>
                    )
            }

        </Container>
    </main>
  )
}
