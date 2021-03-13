

class BusProvider{

    constructor(){
        console.log("create new")
    }

    getETAData = async ({routes, stop})=>{
        const res = await fetch("/busETA", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({routes:routes, stop: stop})
            })
        
        const result = await res.json()

        let finalResult = result.filter(function(item){
            return !isNaN(Date.parse(item.eta));
        })
        finalResult = finalResult.map(function(item){
            const tempDate = new Date(item.eta).toISOString()
            const output = {
                name: item['route'],
                eta: tempDate
            }
            return output
        })
        return finalResult
    }

}
export default BusProvider;