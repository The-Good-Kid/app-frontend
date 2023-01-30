import React from 'react';
import TGKAppbar from '../components/Appbar';
import Footer from '../components/footer';
import styles from './index.module.css'
import Cookies from 'js-cookie';


const Home: React.FC = () => {
  const [token, setToken] = React.useState(Cookies.get('tgk_server_token'))
  React.useEffect(() => {
    setToken(Cookies.get('tgk_server_token'));
  }, []);
  return (
   <TGKAppbar>
    </TGKAppbar>
  );
};

export default Home;
