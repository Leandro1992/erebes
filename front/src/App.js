import React, { useState } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

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
  title: {
    color: 'white',
    flexGrow: 1,
  }
}));

function App() {
  const classes = useStyles();

  const [path, setPath] = useState({});
  const [cnpj, setCNPJ] = useState("");
  const [doc, setDoc] = useState("");
  const [remessa, setRemessa] = useState("");
  const [unidade, setUnindade] = useState("");
  const [database, setDatabase] = useState("");
  const [database1, setDatabase1] = useState("");
  const [database2, setDatabase2] = useState("");
  const [database3, setDatabase3] = useState("");
  const [database4, setDatabase4] = useState("");
  const [json, setJSON] = useState(JSON.stringify({ "Exemple": "Exemple", "Exemple2": "Exemple2" }, null, 2));

  const handleImageInput = event => {
    setPath(event.target.files[0])
  }

  // const handleSaveToPC = (filename) => {
  //   const fileData = json;
  //   const blob = new Blob([fileData], {type: "text/plain"});
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.download = `demonstracoes_financeiras.json`;
  //   link.href = url;
  //   link.click();
  // }

  const handleSaveToPC = (filename) => {
    const dataUrl = `data:application/json,${json}`
    const link = document.createElement('a');
    link.download = `demonstracoes_financeiras.json`;
    link.href = dataUrl;
    link.click();
  }

  const generateJSON = () => {
    let formData = new FormData();
    formData.append("sheets", path);
    formData.append("cnpj", cnpj);
    formData.append("doc", doc);
    formData.append("remessa", remessa);
    formData.append("unidade", unidade);
    formData.append("database", database);
    formData.append("database1", database1);
    formData.append("database2", database2);
    formData.append("database3", database3);
    formData.append("database4", database4);

    axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      setJSON(JSON.stringify(res.data, null, 2))
    }).catch(err => {
      console.error({ err });
    });
  }

  return (
    <div className="App">
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              BACEN JSON
          </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <header className="App-header">
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box>
                <Alert severity="info">Selecione a planilha com os dados para geração</Alert>
              </Box>
              <TextField
                id="filled-full-width"
                label="Arquivo XLSX"
                placeholder="Import file"
                fullWidth
                margin="normal"
                onChange={handleImageInput}
                type="file"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
              />

              <TextField
                label="CNPJ"
                placeholder="CNPJ"
                fullWidth
                margin="normal"
                onChange={(e) => setCNPJ(e.target.value)}
                type="text"
                value={cnpj}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
              />
              <TextField
                label="Cod. Documento"
                placeholder="Cod. Documento"
                fullWidth
                margin="normal"
                onChange={(e) => setDoc(e.target.value)}
                type="text"
                value={doc}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
              />
              <TextField
                label="Tipo Remessa"
                placeholder="Tipo Remessa"
                fullWidth
                margin="normal"
                onChange={(e) => setRemessa(e.target.value)}
                type="text"
                value={remessa}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
              />
              <TextField
                label="Unidade de Medida"
                placeholder="Unidade de Medida"
                fullWidth
                margin="normal"
                onChange={(e) => setUnindade(e.target.value)}
                type="text"
                value={unidade}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
              />
              <TextField
                id="date"
                fullWidth
                label="Data Base (Fomato ex: 062016)"
                margin="normal"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                type="text"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                id="date1"
                fullWidth
                margin="normal"
                value={database1}
                onChange={(e) => setDatabase1(e.target.value)}
                label="Data Referência 1 (Fomato ex: S062016)"
                type="text"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                id="date2"
                fullWidth
                margin="normal"
                label="Data Referência 2 (Fomato ex: S062016)"
                value={database2}
                onChange={(e) => setDatabase2(e.target.value)}
                type="text"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="date3"
                fullWidth
                margin="normal"
                label="Data Referência 3 (Fomato ex: S062016)"
                value={database3}
                onChange={(e) => setDatabase3(e.target.value)}
                type="text"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="date4"
                fullWidth
                margin="normal"
                label="Data Referência 4 (Fomato ex: S062016)"
                value={database4}
                onChange={(e) => setDatabase4(e.target.value)}
                type="text"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button className={classes.myButton} variant="contained" onClick={generateJSON} color="primary">Gerar</Button>
              <Button className={classes.myButton} variant="contained" onClick={handleSaveToPC} color="primary">Download</Button>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Alert severity="info">Verifique aqui o resultado JSON</Alert>
              </Box>
              <TextField
                id="outlined-multiline-static"
                label="JSON"
                fullWidth
                margin="normal"
                multiline
                rowsMax={30}
                value={json}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Container>
      </header>
    </div>
  );
}

export default App;
