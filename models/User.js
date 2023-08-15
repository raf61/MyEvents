import { Schema, model, models } from 'mongoose'

const userSchema = new Schema({
    email: {
        type:String,
        unique:true,
        required:true
    },
    name: {
        type:String,
        required: true,
        maxLength: 60
    },
    isEventManager: {
        type:Boolean,
        required: false
    },
    stripeCustomerId:{
        type:String,
        required:false
    }
}, { timestamps:true })

const User = models.User || model("User", userSchema)

export default User