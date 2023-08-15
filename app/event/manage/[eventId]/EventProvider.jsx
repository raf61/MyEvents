'use client'

import {createContext, useState} from "react"

export const EventContext = createContext({}) 

export default function EventProvider({children}) {
    const [originalEvent, setOriginalEvent] = useState({})
    return (
        <EventContext.Provider value={{
            originalEvent, setOriginalEvent
        }}>
            {children}
        </EventContext.Provider>        
    )
}

