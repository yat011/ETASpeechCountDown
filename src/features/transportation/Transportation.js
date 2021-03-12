import { sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BusProvider from './provider/BusProvider';
import { updateETAList } from './transportationSlice';


function Transportation ({providerNames}){

    const [providers, setProviders] = useState([new BusProvider()]);
    const dispatch = useDispatch()

    const etaList = useSelector(state => state.transportation.etaList)
    // console.log(etaList);
    //TODO
    const tmp_input =  {routes:["81", "82", "106"], stop: "001267"};
    useEffect(() => {
        const fetch = async () => {
            const dataList = await Promise.all(providers.map(async function(provider){
                return await provider.getETAData(tmp_input);
            }));
            const flatDataList = [].concat(... dataList);
            console.log(flatDataList);
            dispatch(updateETAList(flatDataList));
        }
        return fetch();
    },[providers]);

    const formattedETAList = etaList.map((item)=>{
        const newItem = {
            ...item,
            eta: new Date(item.eta)
        }
        return newItem;
    });

    const finalETAList = sortBy(formattedETAList, "eta")

    return (
        <div>{finalETAList.length > 0 ?
            finalETAList[finalETAList.length-1].name +" " + finalETAList[finalETAList.length-1].eta.toLocaleString():
            "None"}</div>
    )
}
export default Transportation;