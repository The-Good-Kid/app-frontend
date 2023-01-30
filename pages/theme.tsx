import styled  from 'styled-components'
import  {ThemeProvider}  from 'styled-components';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
  };
}
ThemeProvider
const theme: Theme = {
  colors: {
    primary: '#3f51b5',
    secondary: '#f50057',
  },
};


const GlobalStyle = styled.div`
display: flex;
flex-direction: row;

  `;
  
  

const ThemeWrapper : React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {/* <GlobalStyle /> */}
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;