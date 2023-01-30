import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import TGKAppBar from '../components/Appbar';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { waitForDebugger } from 'inspector';
import { Grid } from '@mui/material';
const AddExpenses: React.FC = () => {
    const [activityName, setActivityName] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    let [user, setUser] = useState({ userId: '', contact_number: '', contribution: 0, description: '' });
    const [userList, setUserList] = useState([user]);
    const [open, setOpen] = useState(false);
    const [addedUser, setAddedUser] = useState(user);
    const [token, setToken] = useState(Cookies.get('tgk_server_token') as string);
    const router = useRouter();

    const toggleAddUser = () => {
        setOpen(!open);
    };
    const openAddUserPopUp = () => {
        setOpen(true)
    }
    const handleSplitEqually = () => {
        userList.forEach((user: any) => {
            user.contribution = (totalAmount / userList.length)
        }
        );
        debugger
    setUserList([...userList]);
    };
    const addUser = async function () {
        debugger
        //add user api call
        const res = await fetch(`http://{localhost}/api/getUserDetails/${addedUser.contact_number}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then((res) => res.json());
        if (res.id) {
            debugger
            addedUser.userId = res.id;
            setAddedUser(addedUser);
            setUserList([...userList, addedUser]);
            console.log(userList);
            alert('User added successfully');
            toggleAddUser();
        } else {
            alert('User Not Found');
            toggleAddUser();
        }
    }

    useEffect(() => {
        setToken(Cookies.get('tgk_server_token') as string);
        if (!token || token.length == 0) {
            router.push('/')
            router.reload();
        }
        if(user.contact_number.length == 0){
            debugger
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
                        let temp = {
                            userId : data.id,
                            contact_number: data.contact_number,
                            contribution: Number(totalAmount),
                            description: 'Paid by me'
                        };
                        setUser(temp);
                        setUserList([temp]);
                        console.log(userList)
                    } else {
                        alert('Error fetching user details');
                        await router.push('/');
                        router.forward();
                    }
                });
        }
    },[open]);


    const handleSubmit = async () => {
        const data = {
            activityName,
            activityDescription,
            totalAmount,
            userList
        };
        debugger
        let resp = await fetch('http://{localhost}/api/addExpenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (resp.ok) {
            alert('Expenses added successfully');
            //navigate to /finances
            window.location.href = '/finances';
        } else {
            alert('Error adding expenses');
        }

    };


    const handleChange = (index: number, key: string, value: string) => {
        debugger
        const list: any = [...userList];
        list[index][key] = value;
        setUserList(list);
        if(key == 'contribution'){
            let total_amount = 0;
             userList.forEach(item=>{
                total_amount += Number(item.contribution);
            })
            setTotalAmount(Math.max(total_amount,totalAmount) as number)
        }
    };
    const handleRemoveClick = (index: number) => {
        const list: any = [...userList];
        list.splice(index, 1);
        setUserList(list);
    };

    return (
        <Container maxWidth='xl'>
            <TGKAppBar></TGKAppBar>
            <Dialog open={open} onClose={toggleAddUser}>
                <><DialogTitle>Add User</DialogTitle><DialogContent>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div>
                            <TextField
                                name='user_contact_number'
                                label="Contact Number"
                                value={addedUser.contact_number}
                                onChange={e => setAddedUser({ ...addedUser, contact_number: e.target.value })}
                            ></TextField>
                        </div>

                    </Box>
                </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleAddUser}>No, Thanks.</Button>
                        <Button onClick={addUser}>Add User</Button>
                    </DialogActions>
                </>
            </Dialog >
            <Grid paddingTop={10} paddingBottom={10}>
            <h1>Add Expenses</h1>
            <Grid >
                <TextField
                    label="Activity Name"
                    value={activityName}
                    onChange={e => setActivityName(e.target.value)}
                /> 
                <div></div>
                <TextField
                    label="Activity Description"
                    value={activityDescription}
                    onChange={e => setActivityDescription(e.target.value)}
                    margin="normal"
                />
                <div></div>
                <TextField
                    label="Total Amount"
                    type="number"
                    value={totalAmount}
                    onChange={e => setTotalAmount(Number(e.target.value))}
                    margin="normal"
                />
            </Grid>
            </Grid>
            <Grid>
            <Button variant="contained" color="primary" onClick={openAddUserPopUp}>
                    Add User
                </Button>
                <Button variant="contained" color="primary" onClick={handleSplitEqually}>
                    Split Equally
            </Button>
            </Grid >
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user, index) => (
                            user.contact_number.length > 0 ? (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.contact_number}</TableCell>
                                    <TableCell>
                                        <TextField
                                            value={user.contribution}
                                            onChange={event => handleChange(index, 'contribution', event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={user.description}
                                            onChange={event => handleChange(index, 'description', event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => { handleRemoveClick(index) }}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>) : null
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </Container>

    );

};

export default AddExpenses;