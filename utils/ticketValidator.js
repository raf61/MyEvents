export const ticketValidator = {
    fields:['name', 'event', 'price', 'maxQuantity'],
    name(name){
        name = name.trim()
        if (typeof name != 'string' || !name.length || name.length > 50){
            return {ok:false, msg:'Invalid name'}
        }
        return {ok:true, data: name}
    },
    price(price){
        if (typeof price != 'number' || price > 100_000 || price < 0){
            return {ok:false, msg: 'Invalid price'}
        }
        return {ok:true, data: price}
    },
    event(event){
        if (typeof event != 'string' || !event.length){
            return {ok:false, msg: "Invalid event ID"}
        }
        return {ok:true, data: event}
    },
    maxQuantity(quantity){
        if (quantity){
            if (typeof quantity != 'number' || quantity > 2_000_000){
                return {ok:false, msg:"Invalid quantity"}
            }
            return {ok:true, data: quantity}
        }
        return {ok:true, data:null}
    },
    validatePartially(fields, data){
        try{
            for (let field of fields){
                if (!this.fields.includes(field)){
                    return {ok:false, msg: "Unknown field"}
                }
                const validated = this[field](data[field])
                if (!validated.ok){
                    return validated
                }
                data[field] = validated.data
            }
            return {
                ok:true,
                ticket: data
            }
        }
        catch(error){
            return {
                ok:false,
                msg:'Could not validate data'
            }
        }
    },
    validateAll(data){
        return this.validatePartially(this.fields, data)
    }
}