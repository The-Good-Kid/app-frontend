import React, { useEffect,useState } from 'react';
import TGKAppbar from '../components/Appbar';
import Cookies from 'js-cookie';
import { Container } from '@mui/material';
import TGKLoginForm from '../components/Login';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';


const Booking: React.FC = () => {
    const [token, setToken] = useState(Cookies.get('tgk_server_token'))
    const [loginOpen , setLoginOpen] = useState(false);
    const router = useRouter();
    const { itemId } = router.query;
    const [itemDetails, setItemDetails] = useState({name:'', uniqueId:'', provider:{providerName:'',contactNumber:'',address:''}, address:'', price:''});
    useEffect(() => {
        setToken(Cookies.get('tgk_server_token'));
        if(!token){
            setLoginOpen(true);
        }
        debugger
        fetch(`http://{localhost}/api/itemDetails/${itemId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
                }).then((res) => res.json()).then((res) => {
                    console.log(res);
                    if(res.isActive == false){
                        alert('Item is not available');
                        router.push('/');
                    }                   
                    setItemDetails(res);
                }
            );
    }, [router,itemId,token]);
    const handleLoginClose = () => {
        setLoginOpen(false);
    };
    const handleBookNow = async () => {
        if(!token){
            setLoginOpen(true);
        }
        else{
            debugger
           let res = await fetch(`http://{localhost}/api/createOrder/${itemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
                }).then((res) => res.json())
                
                    console.log(res);
                    if(res.id){
                        alert('Item booked successfully, Order Id: ' + res.id);
                        router.push('/orders');
                    }
                    else{
                        alert('Item booking failed');
                    }
                }
        }

    return (
        <Container maxWidth="xl">
            <TGKAppbar>
            </TGKAppbar>
            <TGKLoginForm open = {loginOpen} handleClose = {handleLoginClose} />

            {itemDetails &&
                <Box>
                    <Box>
                        <b>Name:</b> {itemDetails.name}
                    </Box>
                    <Box>
                        <b>Registration Number:</b> {itemDetails.uniqueId}
                    </Box>
                    <Box>
                        <b>Owner Contact:</b> {itemDetails.provider.contactNumber}
                    </Box>
                    <Box>
                        <b>Provider Name:</b> {itemDetails.provider.providerName}
                    </Box>
                    <Box>
                        <b>Address:</b> {itemDetails.provider.address}
                    </Box>
                    <Box>
                        <b>Price:</b> {itemDetails.price}
                    </Box>
                    <Box>
                        <button onClick={() => handleBookNow()}>Book Now</button>
                    </Box>
                </Box>
            }
        </Container>
    );
};

export default Booking;
