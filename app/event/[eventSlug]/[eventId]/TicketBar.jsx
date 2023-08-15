'use client'
import { TicketCartContext } from '@/context/TicketCartProvider'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import {AiOutlineMinusCircle, AiOutlinePlusCircle, AiOutlineShoppingCart} from 'react-icons/ai'



export default function TicketBar(props) {
    const {tickets} = props
    const {eventId} = useParams()
    const {cart, setCart} = useContext(TicketCartContext)
    const [cartTicketsQuantity, setCartTicketsQuantity] = useState(0)
    const [cartPrice, setCartPrice] = useState(0)
    const [goingToCheckout, setGoingToCheckout] = useState(false)

    useEffect(() => {
        setCartTicketsQuantity(Object.values(cart).reduce((x, y) => !isNaN(x) ? x+y : x, 0))
        
        let cartPrice = 0
        for (const key in cart){
            const ticket = tickets.find(t=>t._id===key)
            cartPrice += (ticket?.price || 0)*cart[key]
        }
        setCartPrice(cartPrice)
    }, [cart])
    const handleClickMinusButton = (ticket) => {
        if (goingToCheckout){
            return
        }
        if (cart[ticket._id] && cart[ticket._id] > 0){
            setCart(state => ({...state, [ticket._id]: state[ticket._id]- 1}))
        }
    }
    const handleClickPlusButton = (ticket) => {
        if(goingToCheckout){
            return
        }
        if (!cart[ticket._id])
            setCart(state => ({...state, [ticket._id]: 0}))
        if (cartTicketsQuantity < ticket.availableQuantity){
            setCart(state => ({...state, [ticket._id]: state[ticket._id] + 1}))
        }
    }
  return (
    <div className='shadow rounded'>
        <div className='bg-[#4c576c] w-[100%] p-4 rounded-t-xl flex items-center justify-between'>
            <span className='text-white'>Tickets</span>
            <div className='flex gap-2 text-white items-center'>
                <span><AiOutlineShoppingCart size={25} /></span>
                <span>{cartPrice.toLocaleString('en-US',{style:'currency', currency:'USD'})}</span>
            </div>
        </div>

        
        {!!tickets.length && 
        <>
        <div className='px-3 pb-2'>
            {
                tickets.map(ticket => (
                    <div key={ticket._id} className='p-1 flex items-center justify-between border-t'>
                        <div>
                            <p className='font-bold text-[11pt] select-none'>{ticket.name}</p>
                            <p className='text-[10pt] select-none'>{ticket.price.toLocaleString('en-US', {style:'currency', currency:'USD'})}</p>
                        </div>
                        {
                            !!ticket.availableQuantity && 
                        <div className='flex items-center gap-2 justify-between'>
                            <button>
                                <AiOutlineMinusCircle  onClick={(e) => handleClickMinusButton(ticket)} className={`${!cart[ticket._id] ? 'text-gray-500' : 'text-blue-500 cursor-pointer'} text-2xl sm:text-xl`} />
                            </button>
                            <span className='select-none w-5 text-center'>
                                {
                                    cart[ticket._id] || 0
                                }
                            </span>
                            <button>
                                <AiOutlinePlusCircle onClick={(e) => handleClickPlusButton((ticket))} className={`${cartTicketsQuantity >= ticket.availableQuantity ? 'text-gray-500' : 'text-blue-500 cursor-pointer'} text-2xl sm:text-xl`} />
                            </button>
                        </div>
                        }
                        {
                            !ticket.availableQuantity && 
                            <span className='text-sm text-gray-500'>Sold out</span>
                        }
                    </div>
                ))
            }
        </div>
        <div className='p-3 select-none'>
            {
                !!cartTicketsQuantity && 
                <Link href={"/api/events/checkout?" + new URLSearchParams({
                    event:eventId,
                    cart: btoa(JSON.stringify(cart)),
                    showedPrice: cartPrice
                }).toString()}>
                    <button onClick={() => {setGoingToCheckout(true)}} className='text-center w-[100%] max-w-[20rem] bg-green-600 hover:bg-green-400 transition text-white p-3 rounded'>
                        <span className='text-[11pt]'>BUY TICKETS</span>
                    </button>
                </Link>
            }
            {
                !cartTicketsQuantity && 
                
                <button className='text-center cursor-default w-[100%] max-w-[20rem] bg-gray-300 text-gray-600 p-3 rounded'>
                    <span>Select a ticket</span>
                </button>
            }
        </div>
        </>
        }
        {
            !tickets.length && (
                <p className='text-center text-[13pt] text-slate-400 p-3'>There are no tickets</p>
            )
        }
    </div>
  )
}
