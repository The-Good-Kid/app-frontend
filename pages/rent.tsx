import React, { useEffect, useState } from 'react';
import TGKAppBar from '../components/Appbar';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Container } from '@mui/system';
import { FormControl, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Grid, Button } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';

const Rent: React.FC = () => {
    const router = useRouter();
    const [token, setToken] = useState(Cookies.get('tgk_server_token') as string);
    const [selectedProvider, setSelectedProvider] = useState(1);
    useEffect(() => {
        setToken(Cookies.get('tgk_server_token') as string);
        if (!token) {
            router.push('/');
        }
        fetch('http://{localhost}/api/getProviders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => res.json()).then((res) => {
            setProviders(res);
            fetch('http://{localhost}/api/getAvailableProducts?providerid=1', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => res.json()).then((res) => {
                setList(res);
            });
        });
    }, [router, token,setSelectedProvider]);
    
    const getListAndStore = async (provider:number) => {
        let list1 = await getList(provider);
        setList(list1);
        debugger
    }
    const getList = async (provider:number=1) => {
        debugger;
        let res = await fetch(`http://{localhost}/api/getAvailableProducts?providerid=` + provider, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => res.json());
        return res;
    }
    const [providers, setProviders] = useState([{ id: 0, providerName: '' }]);
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedProvider(event.target.value as number);
        getListAndStore(event.target.value as number);
    };
    const [list, setList] = useState([]);



    return (
        <Container maxWidth="xl">
            <TGKAppBar />
            <Grid container spacing={3} >
                <Grid item xs={12}>
                    <h2>Add Product</h2>
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth style={{ paddingTop: 10 }}>
                        <InputLabel id="provider-name">Providers</InputLabel>
                        <Select
                            labelId="provider-name"
                            id="provider-name-select"
                            value={selectedProvider}
                            onChange={handleChange}
                        >
                            {providers.map(provider => (
                                <MenuItem key={provider.id} value={provider.id}>{provider.providerName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                </Grid>

                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Registration Number</TableCell>
                                <TableCell>Price(INR/hr)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(list) && list.map((item: any, index: number) =>
                                item && <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.uniqueId}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => router.push(`/booking?itemId=${item.id}`)}>Book</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Rent;
