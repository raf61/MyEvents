'use client'

import EventForm from "@/components/EventForm"
import validateEventData from "@/utils/validateNewEventData"
import { useState } from "react"
export default function NewEventForm() {
    
    const handleSubmit = async (postData) => {
        try{

            const API_BASEURL = process.env.API_BASEURL
            const response = await fetch(`${API_BASEURL}/events`,{
                method: 'POST',
                body:JSON.stringify(postData)
            })
            const data = await response.json()
            if (!data.ok){
                return {ok:false, msg: data.msg || 'An unexpected error ocurred.'}
            }
            return {ok:true}
        }
        catch(error){
            return {ok:false, msg:'An unexpected error ocurred.' }
        }
        
    }
    

  return (
    <EventForm callbackURL={'/account/events'} handleSubmit={handleSubmit} validateFunction={validateEventData}/>
  )
}
