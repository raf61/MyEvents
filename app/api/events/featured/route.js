import Event from "@/models/Event"
import { connectToDB } from "@/utils/database"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export const GET = async(req) => {
    try{
        await connectToDB()
        let events = await Event.find({
            areSalesPaused:false,
            areSalesEnded:{
                $lt: new Date()
            },
            $or: [
                {
                    areSalesStarted: null
                },
                {
                    areSalesStarted:{
                        $gt: new Date()
                    }
                }
                
            ]
        })
        .sort({createdAt: -1})
        .select({ _id: true, name:true, slug:true, image:true })
        .limit(10)
        .lean()
            
        return NextResponse.json({
            ok:true,
            events
        })
    }
    catch(E){
        console.log(E)
        return NextResponse.json({
            ok: false
        })
    }
    
}