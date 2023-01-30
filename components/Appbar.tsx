import React, { useEffect, useState } from 'react';
import { AppBar } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link'
import AccountCircle from '@material-ui/icons/AccountCircle';
import TGKLoginForm from './Login';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Logout from './Logout';



const TGKAppBar: React.FC = () => {
    let [open, setOpen] = useState(false);
    const router = useRouter();
    const [token, setToken] = useState(Cookies.get('tgk_server_token'));
    const handleLoginClose = () => {
        setOpen(false);
    };
    useEffect(() => {
       setToken(Cookies.get('tgk_server_token'));
       console.log(token);
    }, [open,token]);
    const handleLoginOpen = () => {
        setOpen(true);
    };
    const openDashboard = () => {
        router.push('/profile');
    }
    const openOrderDetails = () => {
        router.push('/orders');
    }

    const handleLogout = () => {
        Cookies.remove('tgk_server_token');
        setToken(Cookies.get('tgk_server_token'));
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "rgba(0,0,0,0.5)", }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Blogs
                    </Typography>
                    {token && token.length > 0 ? (
                        <>
                        <Button onClick={openDashboard}>
                        <p>Dashboard</p>
                    </Button>
                    <Button onClick={openOrderDetails}>
                        <p>Orders</p>
                    </Button>
                        <Button onClick={handleLogout}>
                            <p>Logout</p>
                            </Button>
                            </>
                    ) : (
                        <Button
                            aria-label="login"
                            onClick={handleLoginOpen}
                        >
                            <AccountCircle />
                        </Button>
                    )}

                    <TGKLoginForm open={open} handleClose={handleLoginClose} />
                </Toolbar>
            </AppBar>
        </Box>
    );

}
export default TGKAppBar;


