import uploadImage from "@/utils/uploadImage";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import path from 'path'
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req) => {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.isEventManager){
        return new Response(null, {
            status:403
        })
    }
    try {
        const formData = await req.formData();
        const file = formData.get('image');
        const allowedExtensions = ['.jpg', '.jpeg', '.png']
        if (!file || !allowedExtensions.includes(path.extname(file.name))){
            return NextResponse.json({
                ok:false,
                msg: 'Invalid file'
            })
        }
        let newFileURL = await uploadImage(file)
        if (!newFileURL){
            return NextResponse.json({
                ok:false,
                msg: 'Invalid file'
            })
        }
        
        return NextResponse.json({
            ok:true,
            url: newFileURL
        })
        
    } catch (error) {
        console.log(error)
        return new Response(null, {
            status:500
        })
    }

}