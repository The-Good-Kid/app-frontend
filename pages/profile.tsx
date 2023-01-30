import React, { useEffect, useState } from 'react';
import TGKAppBar from '../components/Appbar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Grid } from '@material-ui/core';
import { Container } from '@mui/system';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow, Modal, Dialog } from '@material-ui/core';
import QRCode from 'react-qr-code';
import Image from 'next/image';

const Profile: React.FC = () => {
    const router = useRouter();
    const [userDetails, setUserDetails] = useState({ id: '', username: '', contact_number: '', role_id: 0, email: '', is_contact_number_verified: false });
    const [token, setToken] = useState(Cookies.get('tgk_server_token') as string);
    const [providers, setProviders] = useState([{ id: 0, providerName: 'null' }]);
    const [selectedProvider, setSelectedProvider] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [list , setList] = useState([{id:0, name:'', price:0, uniqueId:'', description:''}]);
    const [barcodeUrl, setBarcodeUrl] = useState('')
    const [itemDetails, setItemDetails] = React.useState({ item_name: '', hourly_rate: '', registration_number: '', description: '' });
    const tools = [
        { name: 'Rent a Car!', img: './mcqueen.png', link: '/rent' },
        { name: 'Manage Finances', img: './money.png', link: '/finances' },
    ]
    const getListAndStore = async () => {
        let list1 = await getList();
        setList(list1);
        console.log(list1);
        console.log(list);
        debugger
    }
    const getList = async () => {
        debugger;
        let res = await fetch(`http://{localhost}/api/getAvailableProducts?providerid=` + selectedProvider, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then((res) => res.json());
        return res;
    }
    useEffect(() => {
        setToken(Cookies.get('tgk_server_token') as string);
        if (!token) { router.push('/'); }
        debugger
        if (userDetails.username.length === 0) {
            fetch('http://{localhost}/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(async res => {
                    debugger
                    if (res.ok) {
                        let data = await res.json();
                        console.log(data);
                        setUserDetails(data);
                        if (data.role_id == 2) {
                            fetch('http://{localhost}/api/getProviders', {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                            })
                                .then(async res => {
                                    debugger
                                    if (res.ok) {
                                        let data = await res.json();
                                        console.log(data);
                                        setProviders(data);
                                        await getListAndStore();
                                    } else {
                                        alert('Provider fetch failed : ' + JSON.stringify(res));
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                    alert('Provider fetch failed : ' + JSON.stringify(error));
                                });
                        }
                    } else {
                        alert('Profile fetch failed : ' + JSON.stringify(res));
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert('Profile fetch failed : ' + JSON.stringify(error));
                    Cookies.remove('tgk_server_token');
                    router.push('/');
                });
        }
    }, [list,setList,token,userDetails,router,getListAndStore]);
    const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedProvider(e.target.value as number);
        // Fetch products for the selected provider
        getListAndStore()

    };
    const handleFormChange = (e: any) => {
        const { name, value } = e.target;
        setItemDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const addVehicle = async () => {
        let res = await fetch('http://{localhost}/api/addItem', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item_name: itemDetails.item_name,
                hourly_rate: itemDetails.hourly_rate,
                registration_number: itemDetails.registration_number,
                owner_contact_number: userDetails.contact_number,
                provider_id: selectedProvider,
                user_id: userDetails.id
            })
        });
        if (res.ok) {
            let temp = await res.json()
            setBarcodeUrl(`http://tgk-prod.s3-website.ap-south-1.amazonaws.com/booking?itemId=${temp.id}`)
            setShowModal(true);
        } else {
            alert('Vehicle addition failed');
        }
    }

    if (userDetails.role_id === 2) {
        return (
            <Container maxWidth="xl">
                <TGKAppBar />
                <Grid container spacing={3} >
                    <Grid item xs={12}>
                        <h2>Add Product</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <Dialog open={showModal}
                            onClose={() => setShowModal(false)}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <QRCode value={barcodeUrl} />
                            <button onClick={() => { setShowModal(false) }}>Close</button>
                        </Dialog>

                        <form>
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
                            <TextField name='item_name' label="Vehicle Name" variant="outlined" margin="normal" fullWidth onChange={handleFormChange} />
                            <TextField name='hourly_rate' label="Rate" variant="outlined" margin="normal" fullWidth onChange={handleFormChange} />
                            <TextField name='registration_number' label="Registration Number" variant="outlined" margin="normal" fullWidth onChange={handleFormChange} />
                            <TextField name='contact_number' label="Owner Contact Number" variant="outlined" margin="normal" fullWidth onChange={handleFormChange} />
                            <Button variant="contained" color="primary" onClick={addVehicle}>
                                Submit
                            </Button>
                        </form>


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
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Container>
        );
    } else {
        return (
            <Container maxWidth="xl">
                <TGKAppBar />
                <Grid container spacing={3} style={{ paddingTop: '200px' }}>
                    {tools.map((tool, index) => (
                        <Grid item xs={3} key={index}>
                            <Link href={tool.link}><Image width={50} height={50} src={tool.img} alt={tool.name} /></Link>
                            <p>{tool.name}</p>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    };
}
export default Profile;
