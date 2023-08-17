import validateEventData from "@/utils/validateEventData"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import Event from "@/models/Event"
import { connectToDB } from "@/utils/database"
import Ticket from "@/models/Ticket"
import TicketPurchase from "@/models/TicketPurchase"

export const PUT = async (req, {params: {eventId}}) => {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session?.user?.isEventManager){
        return new Response(null, {
            status: 403
        })
    }
    try{
        await connectToDB()
        const event = await Event.findOne({
            _id: eventId,
            creator: session.user.id
        })
        if (!event){
            return new Response(null, {
                status: 404
            })
        }
        
        const postData = await req.json()
        const validated = validateEventData(postData)
        if (!validated.ok){
            return NextResponse.json({
                ok:false,
                msg: validated.msg
            })
        }
        let biggestMaxTicketQuantity = 0;
        
        (await Ticket.find({
            event: event._id,
        })
        .select({_id:false, maxQuantity:true})
        .lean())
        .forEach(({maxQuantity}) => {
            if (typeof maxQuantity == 'number' && maxQuantity > biggestMaxTicketQuantity)
                biggestMaxTicketQuantity = maxQuantity
        })

        if (validated.event.ticketQuantity && validated.event.ticketQuantity < biggestMaxTicketQuantity){
            return NextResponse.json({
                ok:false, 
                msg: `The number of tickets must be at least ${biggestMaxTicketQuantity} because you set it in the tickets management page.`
            })
        }

        if (validated.event.ticketQuantity){
            if (!event.areSalesPaused){
                return NextResponse.json({
                    ok:false,
                    msg: `You cannot change the ticket quantity while "Allow Purchases" is set to "ON". First, disable this option.`
                })
            }
            const purchaseCount = await TicketPurchase.count({ event: event._id })

            if (validated.event.ticketQuantity < purchaseCount){
                return NextResponse.json({
                    ok:false,
                    msg: `Invalid ticket quantity. ${purchaseCount} tickets have been sold for this event, so the ticket quantity must be greater or equal to this number.`
                })
            }

        }
        
        Object.keys(validated.event).map(field => {
            event[field] = validated.event[field]
        })
        
        await event.save()
        return NextResponse.json({
            ok:true
        })
    }
    catch(error){
        return NextResponse.json({
            ok:false,
            msg: 'Internal server error'
        })
    }
}

export const dynamic = "force-dynamic"

export const GET = async (req, {params:{eventId}}) => {
    try{

        await connectToDB()
        const event = await Event.findOne({
            _id: eventId,
        })
        .select({
            _id: true,
            name: true,
            description:true,
            slug: true,
            startSalesAt:true,
            stopSalesAt:true,
            areSalesPaused:true,
            image:true
        })
        .lean()
        
        if (!event){
            return new Response(null, {
                status:404
            })
        }
    
        return NextResponse.json(event, {
            status: 200
        })
    }
    catch(err){
        return new Response(null, {
            status:500
        })
    }
}