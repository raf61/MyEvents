'use client'

import {createContext, useState} from "react"

export const TicketsContext = createContext() 

export default function TicketProvider({children}) {
    const [tickets, setTickets] = useState([])
    const [currentTicket, setCurrentTicket] = useState(null)

    return (
        <TicketsContext.Provider value={{
            tickets, setTickets,
            currentTicket, setCurrentTicket
        }}>
            {children}
        </TicketsContext.Provider>        
    )
}

