import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { InputLabel, FormControl, Select, MenuItem } from '@mui/material';

interface Props {
    open: boolean;
    handleClose: () => void;
}
const TGKLoginForm: React.FC<Props> = (pageProps) => {
    const router = useRouter();
    const [openSignUp, setOpenSignUp] = useState(false);
    const [token, setToken] = useState(Cookies.get('tgk_server_token'));
    const [userDetails, setUserDetails] = useState({
        contact_number: '',
        verification_code: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role_name: 'USER',
        username: ''
    });
    let [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
    useEffect(() => {
        console.log(isVerificationCodeSent);

    }, [isVerificationCodeSent, openSignUp, token]);
    const sendOTP = async function () {
        debugger
        console.log(userDetails);
        let res = await fetch('http://{localhost}/api/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ contact_number: userDetails.contact_number, verification_code: 'verification_pending' })
        }).then((res) => res.json());
        if (res.success) {
            setIsVerificationCodeSent(true);
            alert('OTP sent successfully')
        }
        else {
            alert('please try again or signUp');
        }
    }
    const login = async function () {
        debugger
        console.log(userDetails);
        const res = await fetch('http://{localhost}/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetails)
        }).then((res) => res.json());
        if (res.success) {
            console.log('tgk_server_token', res.token.access_token);
            Cookies.set('tgk_server_token', res.token.access_token);
            pageProps.handleClose();
        } else {
            alert('Invalid Credentials');
        }

    }
    const toggleSignUp = () => {
        setOpenSignUp(!openSignUp);
    }
    const signup = async function () {
        debugger
        let res = await fetch('http://{localhost}/api/auth/signUp', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(userDetails)
        }).then((res) => res.json());
        if (res.access_token) {
            alert('User created successfully')
            Cookies.set('tgk_server_token', res.access_token);
            toggleSignUp();
            pageProps.handleClose();
        }
        else {
            alert(JSON.stringify(res));
        }
    }




    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value
        });
    }

    return (
        <Dialog open={pageProps.open} onClose={pageProps.handleClose}>
            {!openSignUp ? (
                <><DialogTitle>Login</DialogTitle><DialogContent>
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
                                name='contact_number'
                                label="Contact Number"
                                value={userDetails.contact_number}
                                onChange={handleChange} />
                            <TextField
                                name='verification_code'
                                label="Verification Code"
                                value={userDetails.verification_code}
                                disabled={isVerificationCodeSent ? false : true}
                                onChange={handleChange} />
                        </div>

                    </Box>
                </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleSignUp}>Sign Up.</Button>
                        <Button onClick={pageProps.handleClose}>No, Thanks.</Button>
                        <Button onClick={sendOTP}>send OTP</Button>
                        <Button onClick={login} disabled={!isVerificationCodeSent || userDetails.contact_number?.length !== 10}>Login</Button>
                    </DialogActions>
                </>) : <><DialogTitle>Sign Up</DialogTitle><DialogContent>
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
                                name='first_name'
                                label="First Name"
                                value={userDetails.first_name}

                                onChange={handleChange} />
                            <TextField
                                name='last_name'
                                label="Last Name"
                                value={userDetails.last_name}
                                onChange={handleChange} />
                        </div>
                        <div>
                            <TextField
                                name='contact_number'
                                label="Contact Number"
                                value={userDetails.contact_number}
                                onChange={handleChange} />
                            <TextField
                                name='email'
                                label="email"
                                value={userDetails.email}
                                onChange={handleChange} />
                        </div>
                        <div>
                            <TextField
                                name='password'
                                label="password"
                                value={userDetails.password}
                                onChange={handleChange} />
                            <TextField
                                name='username'
                                label="username"
                                value={userDetails.username}

                                onChange={handleChange} />
                            <FormControl fullWidth style={{ paddingTop: 10 }}>
                                <InputLabel id="role-select-label">Role</InputLabel>
                                <Select
                                    name="role_name"
                                    labelId="role-select-label"
                                    value={userDetails.role_name}
                                    onSelect={handleChange}
                                >
                                    <MenuItem value="USER">User</MenuItem>
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleSignUp}>No, Thanks.</Button>
                    <Button onClick={signup} >Sign Up</Button>
                </DialogActions></>}
        </Dialog >

    );
}

export default TGKLoginForm;