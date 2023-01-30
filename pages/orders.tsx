import React, { useEffect, useState } from 'react';
import TGKAppBar from '../components/Appbar';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Container } from '@mui/system';
import { FormControl, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Grid, Button } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';

const Orders: React.FC = () => {
    const router = useRouter();
    const [token, setToken] = useState(Cookies.get('tgk_server_token') as string);
    const [activeOrders, setActiveOrders] = useState([{id:'',createdAt:'',fulfilledAt:'',amount:'',uniqueId:'',items:[{uniqueId:''}]}]);
    const [pastOrders, setPastOrders] = useState([{id:'',createdAt:'',fulfilledAt:'',amount:'',uniqueId:'',items:[{uniqueId:''}]}]);
    const [selectedOrder , setSelectedOrder] = useState();
    useEffect(() => {
        if (!token) {
            router.push('/');
        }
        debugger
        fetch('http://{localhost}/api/getOrderDetails', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(async (res) => {
            debugger
            let data = await res.json()
            if(data.pastOrders && data.activeOrders){
                setPastOrders(data.pastOrders);
                setActiveOrders(data.activeOrders);
            }
            else{
                alert(JSON.stringify(data))
            }
        });
    }, [router,token]);
    const fulFillOrder = async (orderId:number) => {
        let res = await fetch(`http://{localhost}/api/getQuote/` + orderId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then((res) => res.json());
        if(res.id){
            alert('Order fulfilled successfully, Order Id: ' + res.id+ 'Amount: ' + res.amount);
            // reload the page
            router.reload();
        }

    }


    return (
        <Container maxWidth="xl">
            <TGKAppBar />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2>Active Orders</h2>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Rented On</TableCell>
                                <TableCell> Vehicle Registration Number</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeOrders.map(order => ( order.items[0]?.uniqueId ? 
                               (<TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.createdAt}</TableCell>
                                    <TableCell>{order.items[0]?.uniqueId}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => fulFillOrder(+order.id)}>Drop off!</Button>
                                    </TableCell>                                    
                                </TableRow>)
                                : null
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    <h2>Past Orders</h2>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Rented On</TableCell>
                                <TableCell> Vehicle Registration Number</TableCell>
                                <TableCell> ReturnedOn</TableCell>
                                <TableCell> TotalAmount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pastOrders.map(order => (
                                <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.createdAt}</TableCell>
                                    <TableCell>{order.items[0].uniqueId}</TableCell>
                                    <TableCell>{order.fulfilledAt}</TableCell>
                                    <TableCell>{order.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Container>
    );
};
export default Orders;
