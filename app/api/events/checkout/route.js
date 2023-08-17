import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import Stripe from "stripe"
import { connectToDB } from "@/utils/database"
import Ticket from "@/models/Ticket"
import Event from "@/models/Event"
import User from "@/models/User"
import { NextResponse } from "next/server"
import TicketPurchase from "@/models/TicketPurchase"

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: '2022-11-15'
})
export const dynamic = "force-dynamic"

export const GET = async (req) => {
    try{
        const session = await getServerSession(authOptions)
        if (!session || !session?.user){
            return NextResponse.redirect(new URL(`/login?to=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`, process.env.NEXTAUTH_URL))
        }
        const user = session.user
        const eventId = String(req.nextUrl.searchParams.get('event'))
        const userCart = JSON.parse(Buffer.from(String(req.nextUrl.searchParams.get("cart")), 'base64').toString('ascii'))
        const showedPrice = parseInt(req.nextUrl.searchParams.get('showedPrice'))
        await connectToDB()
        const event = await Event.findById(eventId).lean()
        if (!event || event.areSalesPaused || (event.startSalesAt ? new Date() < event.startSalesAt : false) || new Date() > event.stopSalesAt){
            return new Response(null, {
                status: 404
            })
        }

        
        
        let cartTicketQuantity = 0
        for (const key in userCart){
            if (typeof userCart[key] != 'number' || typeof key != 'string'){
                return new Response(null, {
                    status:500
                })
            }
            cartTicketQuantity += userCart[key]
        }

        const purchaseCount = await TicketPurchase.count({ event: event._id })
        if (purchaseCount >= event.ticketQuantity){
            return new Response("The tickets sold out.", {
                status:500   
            })
        }

        if (purchaseCount + cartTicketQuantity > event.ticketQuantity){
            return new Response("Try reducing the amount of tickets.")
        }

        if (cartTicketQuantity > 5 || cartTicketQuantity == 0 || isNaN(showedPrice)){
            return new Response(null, {
                status:500
            })
        }


        const tickets = await Ticket.find({
            _id:{
                $in: Object.keys(userCart)
            },
            eventId: eventId
        }).lean()

        if (!tickets.length || tickets.length != Object.keys(userCart).length){
            return new Response(null, {
                status:500
            })
        }
        

        for (const ticket of tickets){
            if (ticket.maxQuantity){
                const purchaseCount = await TicketPurchase.count({ticket: ticket._id})
                if (purchaseCount >= ticket.maxQuantity){
                    return new Response(`The ticket "${ticket.name}" sold out.`)
                }
                if (purchaseCount + userCart[ticket._id] > ticket.maxQuantity){
                    return new Response(`Error, try reducing the quantity of "${ticket.name}"`, {
                        status:500
                    })
                }
            }
        }
        

        let stripeCustomerId = user.stripeCustomerId
        if (!user.stripeCustomerId){
            const customer = await stripe.customers.create({
                metadata:{
                    id: user._id
                }
            })
            await User.findByIdAndUpdate(user.id, {
                stripeCustomerId: customer.id
            })
            stripeCustomerId = customer.id
        }

        let line_items = []
        const metadataTickets = {}
        let totalPrice = 0

        line_items = Object.keys(userCart).map(ticketId => {
            const {price, name} = tickets.find(t => t._id == ticketId)
            const quantity = userCart[ticketId]
            totalPrice += price * quantity
            if (!quantity){
                return null
            }
            metadataTickets[ticketId] = {quantity, price}
            return {
                price_data:{
                    unit_amount: price * 100,
                    currency: 'usd',
                    product_data:{
                        name: `${event.name} | ${name}`,
                    }
                },
                quantity: quantity
            }
        }).filter(x=>x)
        if (totalPrice != showedPrice){
            return new Response("The price changed while processing", {
                status:500
            })
        }
        
        const paymentSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: "payment",
            payment_method_types: [
              'card',
            ],
            success_url: `${process.env.NEXTAUTH_URL}/event/checkout/success?qty=${cartTicketQuantity}&event=${eventId}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/event/${event.slug}/${event._id}`,
            line_items,
            metadata: {
                tickets: JSON.stringify(metadataTickets),
                event: eventId
            }

          })

        return NextResponse.redirect(paymentSession.url)
    }
    catch(e){
        console.log(e)
        return new Response(null, {
            status: 500
        })
    }

}