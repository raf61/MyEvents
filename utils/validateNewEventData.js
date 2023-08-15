import { eventValidator } from "./eventValidator"

export default function validateEventData({
    name,
    startSalesAt,
    stopSalesAt,
    ticketQuantity,
    description,
}) {
    try{
        return eventValidator.validatePartially(['name','startSalesAt','stopSalesAt','ticketQuantity','description'],{
            name,
            startSalesAt,
            stopSalesAt,
            ticketQuantity,
            description,
        })

    }
    catch(e){
        return {ok:false, msg:"An unexpected error ocurred."}
    }
}