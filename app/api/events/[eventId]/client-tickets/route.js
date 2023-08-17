import Event from "@/models/Event"
import TicketPurchase from "@/models/TicketPurchase"
import { NextResponse } from "next/server"
import User from '@/models/User'
import { connectToDB } from "@/utils/database"
export const dynamic = "force-dynamic"

export const GET = async (req, {params: {eventId}}) => {
    try {
        
        let limit = parseInt(req.nextUrl.searchParams.get("limit")) || 10
        let page = parseInt(req.nextUrl.searchParams.get("page")) || 0
        if (limit > 10_000){
            limit = 10_000
        }
        

        
        const apiKey = req.headers.get("X-Event-Key")
        if (!apiKey || typeof apiKey != 'string'){
            return new Response(null, {
                status:403
            })
        }
        await connectToDB()
        
        const event = await Event.findOne({
            _id:eventId,
            developerApiKey: apiKey
        })
        .select({
            _id:true
        })
        .lean()
        
        if (!event){
            return new Response(null, {
                status: 403
            })
        }
        const purchasesCount = await TicketPurchase.count({
            event: eventId
        })
        const ticketPurchases = await TicketPurchase.find({
            event: eventId
        })
        .select({
            code: true,
            amountPayed: true
        })
        .populate('purchaser', "email -_id")
        .limit(limit)
        .skip(page * limit)
        
        return NextResponse.json({
            ok:true,
            tickets: ticketPurchases,
            totalQuantity: purchasesCount
        })
 
    } catch (error) {
        console.log(error)
        return new Response(null, {
            status: 500
        })     
    }
}