import React, { useState } from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BacenJSON from './views/BacenJson';
import BacenXML from './views/BacenXml';
import BacenPvca from './views/BacenPvca';
import BacenScd from './views/BacenScd';
import BacenApix from './views/BacenApix';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LogoBacen from './logo-bc.png';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  myButton: {
    marginRight: theme.spacing(2),
  },
  button_pvca: {
    backgroundColor: 'bisque'
  },
  button_scd: {
    backgroundColor: 'darkcyan',
    color: 'white'
  },
  button_apix: {
    backgroundColor: 'bisque',
  },
  menu: {
    height: '90vh',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-around'
  },
  imagebc: {
    width: '25%',
    marginLeft: '-11%',
    display: 'initial',
    position: 'absolute',
    marginTop: '100px'
  },
  title: {
    color: 'white',
    flexGrow: 1,
  }
}));

function App() {

  const classes = useStyles();

  //MODULES
  const [home, setHome] = useState(true);
  const [json, setJson] = useState(false);
  const [xml, setXML] = useState(false);
  const [pvca, setPvca] = useState(false);
  const [scd, setScd] = useState(false);
  const [apix, setApix] = useState(false);

  const goTo = (module) => {
    if(module === 'home'){ 
      setHome(true);
      setJson(false);
      setXML(false);
      setPvca(false)
      setScd(false)
      setApix(false);
    }
    if(module === 'xml'){
      setHome(false);
      setJson(false);
      setXML(true);
      setPvca(false);
      setScd(false);
      setApix(false);
    }
    if(module === 'json'){
      setHome(false);
      setJson(true);
      setXML(false);
      setPvca(false);
      setScd(false);
      setApix(false);
    }
    if(module === 'pvca'){
      setHome(false);
      setJson(false);
      setXML(false);
      setPvca(true);
      setScd(false);
      setApix(false);
    }
    if(module === 'scd'){
      setHome(false);
      setJson(false);
      setXML(false);
      setPvca(false);
      setScd(true);
      setApix(false);
    }
    if(module === 'apix'){
      setHome(false);
      setJson(false);
      setXML(false);
      setPvca(false);
      setScd(false);
      setApix(true);
    }
  }


  const getHome = () => {
    if(home){
      return (
        <div className={classes.menu}>
          <Button size="large" onClick={(e) => goTo('json')} variant="contained" color="primary">
          Demonstrações Financeiras em JSON Documento 90x1 (BP, DRE, DMPL, DRA, DFC)
          </Button>
          <Button size="large" onClick={(e) => goTo('xml')} variant="contained" color="secondary">
          SVR - Sistema de Informações de Valores a Receber - 9800/9805 (XML)
          </Button>
          <Button size="large" onClick={(e) => goTo('pvca')} variant="contained" className={classes.button_pvca}>
            Pagamentos de Varejo e a Canais de Atendimento
          </Button>
          <Button size="large" onClick={(e) => goTo('scd')} variant="contained" className={classes.button_scd}>
            Saldos Contábeis Diários - Documento 4111 (XML)
          </Button>
          <Button size="large" onClick={(e) => goTo('apix')} variant="contained" className={classes.button_apix}>
            APIX - Documento 1201 (XML)
          </Button>
        </div>
      )
    }else{
      return null;
    }
  }

  return (
    <div className="App">
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {/* <Typography variant="h6" className={classes.title}>
              BACEN Generator
            </Typography> */}
            <Button onClick={(e) => goTo('home')} color="inherit">Página inicial</Button>
          </Toolbar>
        </AppBar>
      </div>
      <div >
        {home ? <img className={classes.imagebc} alt="Bacen Logo" src={LogoBacen} /> : null}
      </div>
      {getHome()}
      {/* {json ? <BacenJSON /> : null}
      {xml ? <BacenXML /> : null}
      {pvca ? <BacenPvca /> : null} */}
      {scd ? <BacenScd /> : null}
      {apix ? <BacenApix /> : null}
    </div >
  );
}

export default App;
