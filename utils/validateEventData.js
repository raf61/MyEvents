import { eventValidator } from "./eventValidator"

export default function validateEventData(data){
    const fields = Object.keys(data)
    return eventValidator.validatePartially(fields, data)
}
