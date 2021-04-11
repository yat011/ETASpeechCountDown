import { sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BusProvider from './provider/BusProvider';
import { updateETAList, selectETAList } from './transportationSlice';
import { convertToStringETA, ETADateInformation, Provider } from "./provider/Provider"
import { ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import { List } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { useMemo } from 'react';
type ProviderInputPair = {
    inputArgs: any,
    provider: Provider
}

const default_inputs = [{ routes: ["81", "82", "106"], stop: "001267" }];

function Transportation({ providerNames }: { providerNames: string }): JSX.Element {

    const [providers] = useState([new BusProvider()]);
    const dispatch = useDispatch();
    const etaList = useSelector(selectETAList);


    const pairs = useMemo(()=> createProviderInputPairs(providers, default_inputs), [providers]);


    useEffect(() => {
        const fetch = async () => {
            const dataList: ETADateInformation[][] = await Promise.all(pairs.map(async function (pair: ProviderInputPair) {
                return await pair.provider.getETAData(pair.inputArgs);
            }));
            if (dataList.length === 0) {
                return;
            }
            const flatDataList: ETADateInformation[] = dataList.reduce((previous, current) => {
                if (previous === null) {
                    return current;
                }
                return previous.slice(0).concat(current)
            });
            dispatch(updateETAList(convertToStringETA(flatDataList)));
        }
        fetch();

        const id = setInterval(() => {
            fetch();
        }, 120 * 1000);
        return () => clearInterval(id)
    }, [providers, pairs, dispatch]);

    const finalETAList: ETADateInformation[] = sortBy(etaList, "eta")
    return (
        <Paper>
            <Typography variant='h2' >
                ETA
            </Typography>
            <List >
                {
                    finalETAList.map((row, i): JSX.Element => {
                        return (
                            <div>
                                <ListItem key={row.name + ":"+ i} >
                                    <ListItemText primary={row.eta.toLocaleString()} secondary={row.name} />
                                </ListItem>
                                <Divider />
                            </div>
                        )
                    })
                }

            </List>

        </Paper>

    );


}

function createProviderInputPairs(providers: Provider[], inputs: any[]): ProviderInputPair[] {
    console.assert(providers.length === inputs.length);
    const results = []
    for (let i = 0; i < providers.length; i++) {
        results.push({
            provider: providers[i],
            inputArgs: inputs[i]
        })
    }
    return results;
}


export default Transportation;