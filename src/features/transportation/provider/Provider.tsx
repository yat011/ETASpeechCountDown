
export type ETADateInformation = {
    name: string,
    eta: Date
}
export type ETAStringInformation = {
    name: string,
    eta: string
}

export interface Provider{
    getETAData(args:any): Promise<ETADateInformation[]>;
}

export function convertToStringETA(etaList:ETADateInformation[]) : ETAStringInformation[]{
    return etaList.map((item : ETADateInformation)=>{
        return {...item, eta:item.eta.toISOString()}; 
    });
}

export function convertToDateETA(etaList:ETAStringInformation[]) : ETADateInformation[]{
    return etaList.map((item : ETAStringInformation)=>{
        return {...item, eta:new Date(item.eta)};
    });
}

