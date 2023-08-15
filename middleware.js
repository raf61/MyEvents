import * as _ from "ramda";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// This middleware only covers guard for non api routes.
// Api endpoints should take care of this on it`s on

const authRequiredPaths = [
    '/menu',
    '/account', 
    '/account/events', 
    '/account/tickets',
    '/account/events/new',
    '/event/manage/:eventId',
    '/event/manage/:eventId/tickets',
    '/event/manage/:eventId/financial'
]

const unAuthRequiredPaths = [
    '/login'
]

function extractParamNames(path){
    return path.match(/(?<=\:).+?(?=\/|$)/g)
}

function extractParamPositions(paramnames, path){
    let returned = path.split('/').slice(1).map((val, index)=>{

        for (let name of paramnames){
            if (':' + name == val){
                return index
            }
        }
    }).filter(val=>typeof val == 'number')
    return returned
}

export async function middleware(request){
    const res = NextResponse.next()
    const pathName = request.nextUrl.pathname
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    if (token){
        if (unAuthRequiredPaths.includes(pathName)){
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
    
    if (!token){
        for (let path of authRequiredPaths){
            if (pathName == path){
                return NextResponse.redirect(new URL('/login', request.url))
            }
            let paramNames = extractParamNames(path)
            if (paramNames){
                let paramPositions = extractParamPositions(paramNames, path)
                let splittedPath = path.split('/').slice(1)
                let splittedPathName = pathName.split('/').slice(1)
                if (splittedPath.length != splittedPathName.length){
                    continue
                }
                paramPositions.map(pos=>{
                    splittedPathName[pos] = ':' + paramNames[0]
                    paramNames.push(paramNames.shift())
                })
                if (_.equals(splittedPath, splittedPathName)){
                    return NextResponse.redirect(new URL('/login', request.url))
                }
            }
            
        }
    }
    
    return res

}