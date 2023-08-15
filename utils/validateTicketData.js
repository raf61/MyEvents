import { ticketValidator } from "./ticketValidator"

export default function validateTicketData(data) {
    try{
        return ticketValidator.validateAll(data)
    }
    catch(e){
        return {ok:false, msg:"An unexpected error ocurred."}
    }
}