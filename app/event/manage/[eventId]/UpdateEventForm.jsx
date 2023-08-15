'use client'

import EventForm from "@/components/EventForm"
import validateEventData from "@/utils/validateEventData"
import { useContext } from "react"
import { EventContext } from "./EventProvider"

export default function UpdateEventForm() {
    
    const {originalEvent, setOriginalEvent} = useContext(EventContext)

    const handleSubmit = async (initialPostData) => {
        try{
            const postData = {}
            for (let key in initialPostData){
                if (initialPostData[key] != originalEvent[key]){
                    postData[key] = initialPostData[key]
                }
            }
            const API_BASEURL = process.env.API_BASEURL
            const response = await fetch(`${API_BASEURL}/events/${originalEvent._id}`,{
                method: 'PUT',
                body:JSON.stringify(postData)
            })
            const data = await response.json()
            if (!data.ok){
                return {ok:false, msg: data.msg || 'An unexpected error ocurred.'}
            }
            setOriginalEvent(state => {
                const newOriginalEvent = {}
                for (let key in state){
                    if (key in postData){
                        newOriginalEvent[key] = postData[key]
                    }else{
                        newOriginalEvent[key] = state[key]
                    }
                }
                return newOriginalEvent
            })

            return {ok:true}
        }
        catch(error){
            return {ok:false, msg:'An unexpected error ocurred.' }
        }
        
    }
    

  return (
    <div>
        <EventForm showCancelButton={true} originalEvent={originalEvent} handleSubmit={handleSubmit} validateFunction={validateEventData}/>
    </div>
  )
}
