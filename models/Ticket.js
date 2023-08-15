
import { Schema, model, models } from 'mongoose'

const ticketSchema = new Schema({
    creator:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    event:{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required:true
    },
    name:{
        type: String,
        maxLength: 50,
        required:true
    },
    price:{
        type: Number,
        required: true
    },
    maxQuantity:{
        type:Number,
        required:false
    }
    
}, { timestamps:true })



const Ticket = models.Ticket || model("Ticket", ticketSchema)


export default Ticket