'use client'

import {createContext, useState} from "react"

export const TicketCartContext = createContext({}) 

export default function TicketCartProvider({children}) {
    const [cart, setCart] = useState({})
    return (
        <TicketCartContext.Provider value={{
            cart, setCart
        }}>
            {children}
        </TicketCartContext.Provider>        
    )
}

