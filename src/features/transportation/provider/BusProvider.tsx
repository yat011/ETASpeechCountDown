import { Provider, ETADateInformation } from "./Provider";



class BusProvider implements Provider {

    getETAData = async ({ routes, stop }: {routes: string[], stop:string}):Promise<ETADateInformation[]> => {
        const res = await fetch("/busETA", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ routes: routes, stop: stop })
        })

        const result = await res.json()

        let finalResult = result.filter(function (item: any) {
            return !isNaN(Date.parse(item.eta));
        })
        finalResult = finalResult.map(function (item: any) {
            const tempDate = new Date(item.eta)
            const output: ETADateInformation  = {
                name: item['route'],
                eta: tempDate
            }
            return output
        })
        return finalResult
    }

}
export default BusProvider;