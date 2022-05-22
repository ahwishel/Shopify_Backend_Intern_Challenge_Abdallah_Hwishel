import './App.css';
import logo from './media/logo.png'
import {Grid} from '@mui/material'
import Tracker from './Components/Tracker/Tracker';


function App() {

  return (
    <div className="App">
      <Grid container justifyContent="center">
        <img className="logo" src={logo} alt="Shopify Logo"/>
      </Grid>
      <Tracker/>
    </div>
  );
}

export default App;
