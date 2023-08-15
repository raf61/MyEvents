'use client'

import DefaultInput from "@/layout/DefaultInput";
import { useEffect, useRef, useState } from "react";
import DefaultTextArea from "@/layout/DefaultTextArea";
import {useRouter} from 'next/navigation'
import * as _ from "ramda";
import { toast } from 'react-toastify'


export default function EventForm({ handleSubmit, validateFunction, callbackURL, originalEvent, showCancelButton }) {
    const [sendingForm, setSendingForm] = useState(false)
    const startSalesAtInput = useRef()
    const stopSalesAtInput = useRef()
    const router = useRouter()
    const [primitiveEvent, setPrimitiveEvent] = useState(_.clone(originalEvent) || {})
    const [event, setEvent] = useState(_.clone(originalEvent) || {})
    
    useEffect(() => {
        setPrimitiveEvent(_.clone(originalEvent) || {})
        setEvent(_.clone(originalEvent) || {})
    }, [originalEvent])

    const handleStartImmediately = (e) => {
        if (!event.startSalesAt){
            setEvent(state => ({...state, startSalesAt: e.target.value}))
        }else{
            setEvent(state => ({...state, startSalesAt: ''}))
        }
    }

    const submitForm = async (e) => {
        e.preventDefault()

        setSendingForm(true)
        const {name, description, stopSalesAt, ticketQuantity, startSalesAt} = event
        const validatedData = validateFunction({
            name,
            stopSalesAt,
            startSalesAt,
            ticketQuantity,
            description
        })

        if (!validatedData.ok){
            setSendingForm(false)
            toast.error(validatedData.msg || 'An unexpected error ocurred.')
            return
        }
        
        try{
            const submitAttempt = await handleSubmit(validatedData.event)
            if (!submitAttempt.ok){
                setSendingForm(false)
                return toast.error(submitAttempt.msg)
            }
        }
        catch(E){
            setSendingForm(false)
            return toast.error('An unexpected error ocurred')
        }
        setPrimitiveEvent(_.clone(event))
        if (callbackURL){
            router.push(callbackURL)
            router.refresh()
        }else{
            setSendingForm(false)
        }

    }


  return (
    <form onSubmit={submitForm} className="p-5 block rounded border max-w-md shadow-md">
        <div className="rounded-md mb-5">
            <h3 className="font-bold">Name *</h3>
            <span className="text-[9pt]">The event name (up to 60 characters)</span>
            <div className="mt-1">
                <DefaultInput value={event?.name || ''} maxlength={60} onChange={e => setEvent(event => ({...event, name: e.target.value}))} required />
            </div>
        </div>
        <div className="rounded-md mb-5">
            <h3 className="font-bold">Description</h3>
            <span className="text-[9pt]">The event description</span>
            <div className="mt-1">
                <DefaultTextArea extraClass={"h-[10rem]"} maxlength={4096} value={event?.description || ''} onChange={e => setEvent(event => ({...event, description: e.target.value}))} />
            </div>
        </div>
        <div className="rounded-md mb-6">
            <h3 className="font-bold">Start sales at</h3>
            <div className="flex items-center justify-between">
                <span className="text-[9pt]">When the ticket sales will start</span>
                <div className="flex items-center gap-2">
                    <input checked={ !event.startSalesAt } onChange={handleStartImmediately} type="checkbox" />
                    <span className="text-[10pt]">Start immediately</span>
                </div>
            </div>
            <div className="mt-1">
                <DefaultInput readOnly={!event?.startSalesAt} value={event?.startSalesAt && event?.startSalesAt?.slice(0, 16) || ''} onChange={e => setEvent(event => ({...event, startSalesAt: e.target.value}))} _ref={startSalesAtInput} type="datetime-local" />
            </div>
        </div>
        <div className="rounded-md mb-6">
            <h3 className="font-bold">Stop sales at *</h3>
            <span className="text-[9pt]">When ticket sales will stop</span>
            <div className="mt-1">
                <DefaultInput value={event?.stopSalesAt?.slice(0,16) || ''} onChange={(e) => setEvent(event => ({...event, stopSalesAt: e.target.value}))} _ref={stopSalesAtInput} type="datetime-local" />
            </div>
        </div>
        <div className="rounded-md mb-6">
            <h3 className="font-bold">Ticket quantity *</h3>
            <span className="text-[9pt]">How many tickets are going to be available (max 2.000.000)</span>
            <div className="mt-1">
                <DefaultInput required value={event?.ticketQuantity || 0} onChange={e => setEvent(event => ({...event, ticketQuantity: parseInt(e.target.value)}))} type="number" max="2000000" />
            </div>
        </div>
        <div className="flex items-center gap-6">

            <button disabled={sendingForm || _.equals(primitiveEvent, event)} type="submit" className="rounded disabled:border-none disabled:text-white disabled:bg-blue-300 hover:bg-white hover:text-black transition border border-blue-500 bg-blue-500 text-white p-3 py-2">
                {
                    sendingForm ? 'Saving...' : 'Save'
                }
            </button>
            {
                showCancelButton && 

                <button disabled={ _.equals(primitiveEvent, event) || sendingForm } type="button" onClick={() => setEvent(_.clone(primitiveEvent))} className="rounded  border  bg-red-500 disabled:bg-red-300 text-white p-3 py-2">
                    Cancel
                </button>
            }
        </div>

    </form>
  )
}


