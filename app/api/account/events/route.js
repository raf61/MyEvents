import Event from "@/models/Event"
import { connectToDB } from "@/utils/database"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

export const dynamic = "force-dynamic"

export const GET = async (req) => {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session?.user?.isEventManager){
        return new Response(null, {
            status: 403
        })
    }

    try{
        await connectToDB()
        const events = await Event.find({
            creator: session.user.id
        })
        .select({ name: true, description: true, startSalesAt: true, stopSalesAt: true})
        .sort({ createdAt: -1 })
        .lean()
        return NextResponse.json(
            events
        )


    }
    catch(error){
        return new Response(null, {
            status:500
        })
    }
}