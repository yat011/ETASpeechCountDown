

class BusProvider{

    constructor(){
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
        // console.log(result);
        const finalResult =result.map(function(item){
            const output = {
                name: item['route'],
                eta: new Date(item.eta).toLocaleString()
            }
            return output
        })
        return finalResult
    }

}
export default BusProvider;