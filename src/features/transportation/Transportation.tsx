import { result, sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BusProvider from './provider/BusProvider';
import { updateETAList, TransportationState } from './transportationSlice';
import {ETADateInformation, Provider} from "./provider/Provider"


type ProviderInputPair ={
    inputArgs: any,
    provider: Provider
}

function Transportation({ providerNames }: {providerNames:string}): JSX.Element {

    const default_inputs = [{ routes: ["81", "82", "106"], stop: "001267" }]; 
    const [providers, setProviders] = useState([new BusProvider()]);
    const dispatch = useDispatch()
    const etaList = useSelector((state: TransportationState | any) => state.transportation.etaList)


    const pairs = createProviderInputPairs(providers, default_inputs);


    useEffect(() => {
        const fetch = async () => {
            const dataList: ETADateInformation[][] = await Promise.all(pairs.map(async function (pair:ProviderInputPair) {
                return await pair.provider.getETAData(pair.inputArgs);
            }));
            if (dataList.length == 0){
                return ;
            }
            const flatDataList: ETADateInformation[] = dataList.reduce((previous, current) => {
                if (previous === null){
                    return current;
                } 
                return previous.slice(0).concat(current)
            });
            console.log(flatDataList);
            dispatch(updateETAList(flatDataList));
        }
        fetch();

        const id = setInterval(() => {
            fetch();
        }, 120 * 1000);
        return () => clearInterval(id)
    }, [providers]);

    const finalETAList:ETADateInformation[] = sortBy(etaList, "eta")
    return (
        <div>
            {
                finalETAList.map((row, i): JSX.Element => {
                    return (
                        <div key={row.name + i} >
                            {row.name} {row.eta.toLocaleString()}
                        </div>
                    )
                })
            }
        </div>

    );


}

function createProviderInputPairs(providers:Provider[], inputs:any[]):ProviderInputPair[]{
    console.assert(providers.length == inputs.length);
    const results = []
    for (let i =0; i< providers.length; i ++ ){
        results.push({
            provider: providers[i],
            inputArgs: inputs[i]
        })
    }
    return results;
}


export default Transportation;