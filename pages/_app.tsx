import ThemeWrapper from './theme';
import { FC } from 'react';
import { useRouter } from 'next/router';

interface MyAppProps {
    Component: FC;
    pageProps: object;
}


const MyApp: FC<MyAppProps> = ({ Component, pageProps }) => {
    const router = useRouter();
  
    return (
      <ThemeWrapper>
        <Component {...pageProps} />
      </ThemeWrapper>
    );
  };
export default MyApp;