'use client'

import { useContext, useEffect, useRef } from "react"
import TicketForm from "./TicketForm"
import { TicketsContext } from "./TicketProvider"
import { toast } from 'react-toastify'

export default function ManageTickets({originalTickets}) {
    const {setTickets, tickets, setCurrentTicket, currentTicket} = useContext(TicketsContext)
    const ticketFormRef = useRef()
    useEffect(() => {
        setTickets(originalTickets)
    }, [])
    const handleCreateTicket = async (ticket) => {
        const API_BASEURL = process.env.API_BASEURL
        let response = await fetch(`${API_BASEURL}/tickets`, {
            method: 'POST',
            body: JSON.stringify(ticket)
        })
        response = await response.json()
        if (!response.ok){
            return {
                ok:false,
                msg: response.msg
            }
        }

        return {
            ok:true,
            ticket:response.ticket
        }
    }

    const handleUpdateTicket = async (ticket) => {
        const API_BASEURL = process.env.API_BASEURL
        let response = await fetch(`${API_BASEURL}/tickets/${ticket._id}`, {
            method: 'PUT',
            body: JSON.stringify(ticket)
        })
        response = await response.json()
        if (!response.ok){
            return {
                ok:false,
                msg: response.msg
            }
        }

        return {
            ok:true,
            ticket:response.ticket
        }
    }

    const handleDeleteTicket = async (ticket) => {
        if (!confirm(`Are you sure you want to delete "${ticket.name}" ?`)){
            return
        }
        const API_BASEURL = process.env.API_BASEURL
        let response = await fetch(`${API_BASEURL}/tickets/${ticket._id}`, {
            method: 'DELETE'
        })
        response = await response.json()
        if (!response.ok){
            toast.error(response.msg)
            return
        }

        setTickets(state => state.filter(t => t._id != ticket._id))
    }

    return (
        <div className="flex gap-5 flex-wrap md:flex-nowrap justify-center items-start mb-20">
            <div className="grow max-w-[21rem]">
                <h3 className="text-xl mb-3">Available ticket types</h3>
                {
                    tickets.map(ticket => (
                        <div key={ticket._id} className="px-3 py-1 mb-3 border flex rounded-xl shadow-md justify-between items-center">
                            <div className="min-w-0">
                                <div>
                                    <abbr title={ticket.name} className="no-underline">
                                        <span className="block truncate font-bold text-[14pt]">{ticket.name}</span>
                                    </abbr>
                                </div>
                                <div>
                                    <span className="text-sm">
                                        <span className="font-bold">Price: </span>
                                        <span>{ticket.price.toLocaleString('en-US', {style:'currency', currency: 'USD'})}</span>
                                    </span>
                                </div>
                                {
                                    ticket.maxQuantity &&
                                    <div>
                                        <span className="text-sm">
                                            <span className="font-bold">Limit of quantity to be sold: </span>
                                            <span>{ticket.maxQuantity}</span>
                                        </span>
                                    </div>
                                }
                            </div>
                            <div>
                                <div>
                                    <button
                                    onClick={() => {
                                        setCurrentTicket(ticket)
                                        ticketFormRef.current.scrollIntoView()
                                    }}
                                    >Edit
                                    </button>
                                </div>
                                <div className="pt-2">
                                    <button className="text-red-500" onClick={() => handleDeleteTicket(ticket)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="min-w-0">
                <abbr title={currentTicket ? currentTicket.name || '' : "New ticket"} className="no-underline">
                    <h3 className="text-xl mb-3 truncate">
                        {currentTicket ? currentTicket.name || '' : "New ticket"}
                    </h3>
                </abbr>
                <TicketForm _ref={ticketFormRef} handleUpdate={handleUpdateTicket} handleCreate={handleCreateTicket} />
            </div>
        </div>
    )
}
