import { sortBy } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BusProvider from './provider/BusProvider';
import { updateETAList } from './transportationSlice';


function Transportation({ providerNames }) {

    const [providers, setProviders] = useState([new BusProvider()]);
    const dispatch = useDispatch()

    const etaList = useSelector(state => state.transportation.etaList)

    const tmp_input = { routes: ["81", "82", "106"], stop: "001267" };
    useEffect(() => {
        const fetch = async () => {
            const dataList = await Promise.all(providers.map(async function (provider) {
                return await provider.getETAData(tmp_input);
            }));
            const flatDataList = [].concat(...dataList);
            console.log(flatDataList);
            dispatch(updateETAList(flatDataList));
        }
        const id = setInterval(() => {
            fetch();
        }, 120 * 1000);
        fetch();
        return ()=>clearInterval(id)
    }, [providers]);

let finalETAList = etaList.map((item) => ({ ...item, eta: new Date(item.eta).toLocaleString() }))
finalETAList = sortBy(finalETAList, "eta")
return (
    finalETAList.map((row, i) => {
        // console.log(row)
        return (
            <div key={row.name + i} >
                {row.name} {row.eta}
            </div>
        )
    })
);
        
}
export default Transportation;