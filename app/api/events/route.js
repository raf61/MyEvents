import Event from "@/models/Event"
import { connectToDB } from "@/utils/database"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import validateNewEventData from "@/utils/validateNewEventData"


export async function POST(req){
    const session = await getServerSession(authOptions)
    if (!session?.user || !session.user.isEventManager){
        return new Response(null, {
            status:403
        })
    }

    const { name, startSalesAt, stopSalesAt, ticketQuantity, description } = await req.json()

    const validatedData = validateNewEventData({
        name, 
        startSalesAt,
        stopSalesAt,
        ticketQuantity,
        description
    })

    if (!validatedData.ok){
        return NextResponse.json({
            ok:false,
            msg: validatedData.msg || 'Internal server error'
        })
    }
    try{
        await connectToDB()
        await Event.create({
            creator: session.user.id,
            ...validatedData.event
        })
    }
    
    catch(error){
        return NextResponse.json({
            ok:false,
            msg:'Internal server error'
        })
    }
        
    return NextResponse.json({
        ok:true         
    })
}