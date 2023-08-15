
export const eventValidator = {
    fields:['name','description','startSalesAt','stopSalesAt','areSalesPaused','ticketQuantity','image'],
    name(name){
        name = name.trim()
        if (typeof name != 'string' || !name.length || name.length > 60){
            return {ok:false, msg:'Invalid name'}
        }
        return {ok:true, data: name}
    },
    description(description){
        if (!description){
            return {ok:true, data:null}
        }
        description = description.trim()
        if (typeof description != 'string' || description.length > 4096){
            return {ok:false, msg: 'Description should be up to 4096 characters'}
        }
        return {ok:true, data: description}

    },
    ticketQuantity(ticketQuantity){
        if (typeof ticketQuantity != 'number' || ticketQuantity <= 0 || ticketQuantity > 2_000_000){
            return {ok:false, msg:'Invalid ticket quantity'}
        }
        return {ok:true, data: ticketQuantity}

    },
    areSalesPaused(areSalesPaused){
        if (typeof areSalesPaused != 'boolean'){
                return {ok:false, msg: 'Invalid information'}
            }
        return {ok:true, data: areSalesPaused}
    },
    startSalesAt(startSalesAt){
        if (startSalesAt){
            const dateStartSalesAt = new Date(startSalesAt)
            if (isNaN(dateStartSalesAt)){
                return {ok:false, msg:'Invalid "Start sales at" date'}
            }
            return {ok:true, data: startSalesAt}
        }
        return {ok:true, data:null}
    },
    stopSalesAt(stopSalesAt){
        const dateStopSalesAt = new Date(stopSalesAt)
        if (isNaN(dateStopSalesAt)){
            return {ok:false, msg:'Invalid "Stop sales at" date'}
        }
        return {ok:true, data: stopSalesAt}
    },
    startSalesAt_stopSalesAt(startSalesAt, stopSalesAt){
        const dateStartSalesAt = new Date(startSalesAt)
        const dateStopSalesAt = new Date(stopSalesAt)
        if (dateStartSalesAt > dateStopSalesAt){
            return {ok:false, msg:'The "Stop" date should be after than the "Start" date.'}
        }
        return {ok:true}
    },
    image(imageURL){
        if (imageURL){
            if (typeof imageURL != 'string'){
                return {ok:false, msg: 'Invalid image URL'}
            }
            return {ok:true, data: imageURL}
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
            if (data.startSalesAt){
                const validated = this.startSalesAt_stopSalesAt(data.startSalesAt, data.stopSalesAt)
                if (!validated.ok){
                    return validated
                }
            }
            return {
                ok:true,
                event: data
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