import React, { useEffect, useState } from 'react';
import TGKAppBar from '../components/Appbar';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Container } from '@mui/system';
import { FormControl, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Grid, Button } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';

const Finances: React.FC = () => {
    const router = useRouter();
    const [token, setToken] = useState(Cookies.get('tgk_server_token') as string);
    const [settled,setSettled] = useState([{id: '',amount_contributed : 0, activity:{activity_name:'',total_amount:0,is_settled:false,created_at:'',description:''},is_settled:false,settled_at:''}]);
    const [dues,setDues] = useState([{id: '',amount_contributed : 0, activity:{activity_name:'',total_amount:0,is_settled:false,created_at:'',description:''},is_settled:false,settled_at:''}]);
    
    const getDuesAndSture = async () => {
        let resp = await fetch('http://{localhost}/api/getAllFinacials', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(async (res) => {
            debugger
            let data = await res.json();
            if(data.settled && data.dues){
                debugger
                setSettled(data.settled);
                setDues(data.dues);
            }
        })
    }

    useEffect(() => {
        if (!token) {
            router.push('/');
        }
        debugger
        getDuesAndSture();
    }, [setDues,setSettled,token]);
    
    const settleDue = async (relationId:string) => {
        debugger;
        let res = await fetch(`http://{localhost}/api/settleDue/`+relationId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.json());
        if (res) {
            alert('Due settled successfully');
        }
        debugger
        console.log(res)
    }

    return (
        <Container maxWidth="xl">
            <TGKAppBar />
            <Button variant="contained" color="primary" onClick={() => router.push('/addExpenses')}>Add Expenses</Button>

            <Grid container spacing={3} >
                <Grid item xs={12}>
                    <h2>History</h2>
                </Grid>


                </Grid>
                <h2>Dues</h2>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Activity Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount Due</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(dues) && dues.map((item: any, index: number) =>
                                item && <TableRow key={item.Id}>
                                    <TableCell>{item.activity.activity_name}</TableCell>
                                    <TableCell>{item.activity.description}</TableCell>
                                    <TableCell>{item.amount_contributed}</TableCell>
                                    <TableCell>{item.activity.total_amount}</TableCell>
                                    <TableCell>{item.activity.created_at}</TableCell>
                                    <TableCell>
                                        <Button onClick={async () => await settleDue(item.id)}>Settle</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Grid>
                <h2>Settled</h2>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Activity Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount Due</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Settled At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(settled) && settled.map((item: any, index: number) =>
                                item && <TableRow key={item.Id}>
                                   <TableCell>{item.activity.activity_name}</TableCell>
                                    <TableCell>{item.activity.description}</TableCell>
                                    <TableCell>{item.amount_contributed}</TableCell>
                                    <TableCell>{item.activity.total_amount}</TableCell>
                                    <TableCell>{item.activity.created_at}</TableCell>
                                    <TableCell>{item.settled_at}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Grid>
        </Container>
    );
};

export default Finances;
