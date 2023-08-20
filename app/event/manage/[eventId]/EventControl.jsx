'use client'
import { useContext, useEffect, useState } from "react"
import { EventContext } from "./EventProvider"
import ManagementArea from "./ManagementArea"
import UpdateEventForm from "./UpdateEventForm"
import ShareLinkButton from "@/layout/ShareLinkButton"
import slugify from "slugify"
import Link from "next/link"
export default function EventControl({fetchedEvent}) {
    const {originalEvent, setOriginalEvent} = useContext(EventContext)
    const [ticketsLink, setTicketsLink] = useState('')
    useEffect(() => {
        setOriginalEvent(fetchedEvent)
    }, [])

    useEffect(() => {
        setTicketsLink(`${process.env.BASEURL}/event/${slugify(originalEvent.name || '', {lower:true, strict:true})}/${originalEvent?._id}`)
    }, [originalEvent])

  return (
    <>
        <div className="flex mt-10 sm:mt-0 flex-wrap items-center gap-5 justify-between">
            <h1 className="text-3xl font-bold mt-4">
                {originalEvent.name}
            </h1>
            <p className="flex items-center gap-3">
                <a target="_blank" href={ticketsLink}>
                    <span className="underline">Purchases page link</span> 
                </a>
                <ShareLinkButton link={ticketsLink}/>
            </p>
        </div>
        <div className="flex items-start justify-end flex-row-reverse flex-wrap mt-5 gap-7">
            <ManagementArea />
            <UpdateEventForm />
        </div>
    </>
  )
}
