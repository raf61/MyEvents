
import { Schema, model, models } from 'mongoose'

const ticketPurchaseSchema = new Schema({
    purchaser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    ticket:{
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    event:{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required:true
    },
    amountPayed: {
        type: Number,
        required:true
    },
    code: {
        type: String,
        required: true
    },
    stripeSessionId: {
        type:String,
        required:true
    },
    
}, { timestamps:true })



const TicketPurchase = models.TicketPurchase || model("TicketPurchase", ticketPurchaseSchema)


export default TicketPurchase