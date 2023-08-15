import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Event from "@/models/Event"
import { connectToDB } from "@/utils/database"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(req, context) {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session?.user?.isEventManager){
        return new Response(null, {
            status:403
        })
    }
    
    const { eventId } = context.params
    if (typeof eventId != 'string')
        return new Response(null, {
            status: 500
        })

    try{

        await connectToDB()
        const event = await Event.findOne({
            _id: eventId,
            creator: session.user.id
        })
        .select({
            developerApiKey:true
        })
        .lean()
        
        if (!event){
            return new Response(null, {
                status:404
            })
        }
    
        return NextResponse.json({
            key: event.developerApiKey
        }, {
            status: 200
        })
    }
    catch(err){
        console.log(err)
        return new Response(null, {
            status:500
        })
    }
}


