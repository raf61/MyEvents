import TicketPurchase from "@/models/TicketPurchase"
import User from "@/models/User"
import { connectToDB } from "@/utils/database"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: '2022-11-15'
})


export const POST = async (req) => {
    const buf = await req.text()
    const sig = req.headers.get('stripe-signature')
    const webhook_secret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET
    let event
    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhook_secret)
        const object = event.data.object
        await connectToDB()
        switch (event.type){
            case "checkout.session.completed":
                const customer = object.customer
                const user = await User.findOne({stripeCustomerId: customer})
                const purchasedTickets = JSON.parse(object.metadata.tickets)
                const eventId = object.metadata.event
                const toBeInsertedTicketPurchases = []


                for (let ticketId in purchasedTickets){
                    for (let i=0;i<purchasedTickets[ticketId].quantity;i++){   
                        toBeInsertedTicketPurchases.push({
                            ticket: ticketId,
                            purchaser: user.id,
                            amountPayed: purchasedTickets[ticketId].price * 100,
                            code: crypto.randomUUID(),
                            stripeSessionId: object.id,
                            event: eventId
                        })   
                    }
                }
                try {
                    await TicketPurchase.insertMany(toBeInsertedTicketPurchases)
                } catch (error) {
                    console.log(error)
                    console.log("There was an error while creating the ticket purchase, on checkout session " + object.id)
                    return new Response(null, {
                        status: 500
                    })
                }
                return NextResponse.json({
                    ok:true
                })
            break
        }

        return NextResponse.json({
            ok:true
        })
    } catch (error) {
        console.log(error)
        return new Response(null, {
            status: 500
        })
    }
}