import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import User from "@/models/User"
import { NextResponse } from "next/server"
import { connectToDB } from "@/utils/database"

export const PUT = async (req, context) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.isEventManager != undefined){
            return new Response(null, {
                status: 404
            })
        }
        await connectToDB()
        await User.updateOne({
               _id: session.user.id
        },{
            isEventManager: true
        })

        return NextResponse.json({
            ok:true
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            ok:false,
            msg: "An unexpected error ocurred"
        })       
    }
}