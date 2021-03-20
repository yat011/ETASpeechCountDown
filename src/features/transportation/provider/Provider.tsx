
export type ETADateInformation = {
    name: string,
    eta: Date
}

export interface Provider{
    getETAData(args:any): Promise<ETADateInformation[]>;
}


