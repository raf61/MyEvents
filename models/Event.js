import { Schema, model, models } from 'mongoose'
import slugify from 'slugify'

const eventSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    name:{
        type:String,
        required:true,
        maxLength: 60
    },
    slug: {
        type:String,
        required:false
    },
    description:{
        type:String,
        required: false,
        maxLength: 4096
    },
    startSalesAt:{
        type:Date,
        required: false
    },
    stopSalesAt:{
        type:Date,
        required: true
    },
    ticketQuantity:{
        type:Number,
        required:true
    },
    areSalesPaused:{
        type:Boolean,
        required:true,
        default:true
    },
    image:{
        type:String,
        required:false
    },
    developerApiKey:{
        type:String,
        required:false
    }

}, { timestamps:true })

eventSchema.pre('save', function(next){
    this.slug = slugify(this.name, { strict: true, lower: true })
    if(!this.developerApiKey){
        this.developerApiKey = crypto.randomUUID()
    }
    next()
})

const Event = models.Event || model("Event", eventSchema)


export default Event