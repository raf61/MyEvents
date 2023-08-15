'use client'

import DefaultInput from "@/layout/DefaultInput"
import validateTicketData from "@/utils/validateTicketData"
import * as _ from "ramda"
import { useContext, useEffect, useState } from "react"
import { TicketsContext } from "./TicketProvider"
import { useParams } from "next/navigation"
import { toast } from 'react-toastify'


export default function TicketForm({ handleCreate, handleUpdate, _ref }) {
  const {setTickets, tickets, setCurrentTicket, currentTicket} = useContext(TicketsContext)
  const [ticket, setTicket] = useState(_.clone(currentTicket) || {})
  const {eventId} = useParams()


  const [sendingForm, setSendingForm] = useState(false)

  useEffect(() => {
    setTicket(_.clone(currentTicket) || {})
  }, [currentTicket])


  const handleSubmit = async (e) => {
    e.preventDefault()
    ticket.event = eventId
    const validated = validateTicketData(ticket)
    if (!validated.ok){
      return toast.error(validated.msg)
    }
    setSendingForm(true)
    if(currentTicket === null){ // Creating
      const attemptToCreate = await handleCreate(validated.ticket)
      if (!attemptToCreate.ok){
        setSendingForm(false)
        return toast.error(attemptToCreate.msg)
      }
      setTickets([...tickets, attemptToCreate.ticket])
      setCurrentTicket(null)
      setTicket({})
      setSendingForm(false)
      return toast.success('Created!')
    }

    const attemptToUpdate = await handleUpdate(validated.ticket)
    if (!attemptToUpdate.ok){
      setSendingForm(false)
      return toast.error(attemptToUpdate.msg)
    }
    setTickets(tickets.map(ticket => {
      if (ticket._id == validated.ticket._id){
        ticket = _.mergeDeepRight(ticket, validated.ticket)      
      }
      return ticket
    }))
    setTicket({})
    setCurrentTicket(null)
    setSendingForm(false)
  }

    
    
  

  return (
    <form onSubmit={handleSubmit} className="p-5 block rounded border max-w-md" ref={_ref}>
      <div className="rounded-md mb-5 max-w-[20rem]">
          <h3 className="font-bold">Name *</h3>
          <span className="text-[9pt]">The ticket name (up to 50 characters)</span>
          <div className="mt-1">
              <DefaultInput value={ticket?.name || ''} maxlength={50} onChange={e => setTicket(ticket => ({...ticket, name: e.target.value}))} required />
          </div>
      </div>
      <div className="rounded-md mb-5">
          <h3 className="font-bold">Price *</h3>
          <span className="text-[9pt]">The ticket price (not changeable)</span>
          <div className="mt-1">
              <DefaultInput readOnly={!!currentTicket} value={ticket.price ? ticket.price : ''} type="text" max="2000000" min="0" onChange={e => {
                let newValue;
                newValue = e.target.value.replace(/[^0-9]+/g,'')
                setTicket(ticket => ({...ticket, price: parseInt(newValue)}))
                }} required />
          </div>
      </div>
      <div className="rounded-md mb-5">
          <h3 className="font-bold">Sales quantity limit</h3>
          <span className="text-[9pt]">The maximum amount of sales for this ticket</span>
          <div className="mt-1">
              <DefaultInput placeholder={"Leave blank for no limit"} value={ticket?.maxQuantity?.toString() || ''} type="number" max="2000000" min="0" onChange={e => {
                  e.target.value = e.target.value.replace(/[^0-9]+/g,'')
                  setTicket(ticket => ({...ticket, maxQuantity: e.target.value ? parseInt(e.target.value) : null}))
                }} />
          </div>
      </div>
      <div className="flex items-center gap-7">
        <button disabled={sendingForm || _.equals(currentTicket, ticket)} type="submit" className="rounded disabled:border-none disabled:text-white disabled:bg-blue-300 hover:bg-white hover:text-black transition border border-blue-500 bg-blue-500 text-white p-3 py-2">
                  {
                    currentTicket == null ? (sendingForm ? "Creating..." : "Create" ) :
                    sendingForm ? 'Saving...' : 'Save'
                  }
        </button>
        <button disabled={ (_.equals(currentTicket, ticket) || sendingForm) && currentTicket == null } type="button" onClick={
          () => {
            setTicket({})
            setCurrentTicket(null)
          }
        } className="rounded  border  bg-red-500 disabled:bg-red-300 text-white p-3 py-2">
          Cancel
        </button>
      </div>
    </form>
  )
}
