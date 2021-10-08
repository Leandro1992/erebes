import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Alert } from '@material-ui/lab';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    myButton: {
        marginRight: theme.spacing(2),
    },
}));


function BacenXML() {
    const classes = useStyles();

    const [xml9800, setxml9800] = useState(JSON.stringify({ "Exemple": "Exemple", "Exemple2": "Exemple2" }, null, 2));
    const [xml9805, setxml9805] = useState(JSON.stringify({ "Exemple": "Exemple", "Exemple2": "Exemple2" }, null, 2));
    const [pathXML9800, setPathXML9800] = useState({});
    const [pathXML9805, setPathXML9805] = useState({});
    const [tipoEnvio9800, settipoEnvio9800] = useState("I");
    const [databaseXML9800, setdatabaseXML9800] = useState("");
    const [cnpjif9800, setCNPJif9800] = useState("");
    const [tipoEnvio9805, settipoEnvio9805] = useState("I");
    const [databaseXML9805, setdatabaseXML9805] = useState("");
    const [cnpjif9805, setCNPJif9805] = useState("");

    const handleImageInputXML9800 = event => {
        setPathXML9800(event.target.files[0])
    }

    const handleImageInputXML9805 = event => {
        setPathXML9805(event.target.files[0])
    }

    const handleTipoChange9800 = (event) => {
        settipoEnvio9800(event.target.value);
    };

    const handleTipoChange9805 = (event) => {
        settipoEnvio9805(event.target.value);
    };

    const generateXML9800 = () => {
        let formData = new FormData();
        formData.append("sheets", pathXML9800);
        formData.append("cnpj", cnpjif9800);
        formData.append("coddoc", "9800");
        formData.append("database", databaseXML9800);
        formData.append("tipoEnvio", tipoEnvio9800);
        axios.post('api/upload9800', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            setxml9800(res.data.data);
        }).catch(err => {
            console.error({ err });
        });
        console.log("Gerar XML")
    }

    const generateXML9805 = () => {
        let formData = new FormData();
        formData.append("sheets", pathXML9805);
        formData.append("cnpj", cnpjif9805);
        formData.append("coddoc", "9805");
        formData.append("database", databaseXML9805);
        formData.append("tipoEnvio", tipoEnvio9805);
        axios.post('api/upload9805', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            setxml9805(res.data.data);
        }).catch(err => {
            console.error({ err });
        });
    }

    const handleSaveToPC9800 = (filename) => {
        const dataUrl = `data:text/plain;charset=utf-8,${xml9800}`
        const link = document.createElement('a');
        link.download = `ASVR9800.xml`;
        link.href = dataUrl;
        link.click();
    }

    const handleSaveToPC9805 = (filename) => {
        const dataUrl = `data:application/xml,${xml9805}`
        const link = document.createElement('a');
        link.download = `ASVR9805.xml`;
        link.href = dataUrl;
        link.click();
    }

    return (
        <header className="App-header">
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Box>
                            <Alert severity="info">Geração XML ASVR9800</Alert>
                        </Box>
                        <TextField
                            label="CNPJ"
                            placeholder="CNPJ"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setCNPJif9800(e.target.value)}
                            type="text"
                            value={cnpjif9800}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Tipo de Envio</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="filled-full-width"
                                fullWidth
                                value={tipoEnvio9800}
                                onChange={handleTipoChange9800}
                            >
                                <MenuItem value={"I"}>Inclusão</MenuItem>
                                <MenuItem value={"S"}>Substituição</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id="date"
                            fullWidth
                            label="Data Base (Fomato AAAAMM ex: 202101)"
                            margin="normal"
                            value={databaseXML9800}
                            onChange={(e) => setdatabaseXML9800(e.target.value)}
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="filled-full-width"
                            label="Selecione a planilha 9800"
                            placeholder="Import file"
                            fullWidth
                            margin="normal"
                            onChange={handleImageInputXML9800}
                            type="file"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <Box>
                            <Alert severity="info">Verifique aqui o resultado XML 9800</Alert>
                        </Box>
                        <TextField
                            id="outlined-multiline-static"
                            label="XML"
                            fullWidth
                            margin="normal"
                            multiline
                            rowsMax={30}
                            value={xml9800}
                            variant="outlined"
                        />
                        <Button className={classes.myButton} variant="contained" onClick={generateXML9800} color="primary">Gerar</Button>
                        <Button className={classes.myButton} variant="contained" onClick={handleSaveToPC9800} color="primary">Download</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Alert severity="info">Geração XML ASVR9805</Alert>
                        </Box>
                        <TextField
                            label="CNPJ"
                            placeholder="CNPJ"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setCNPJif9805(e.target.value)}
                            type="text"
                            value={cnpjif9805}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Tipo de Envio</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="filled-full-width"
                                fullWidth
                                value={tipoEnvio9805}
                                onChange={handleTipoChange9805}
                            >
                                <MenuItem value={"I"}>Inclusão</MenuItem>
                                <MenuItem value={"S"}>Substituição</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id="date"
                            fullWidth
                            label="Data Base (Fomato AAAAMM ex: 202101)"
                            margin="normal"
                            value={databaseXML9805}
                            onChange={(e) => setdatabaseXML9805(e.target.value)}
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="filled-full-width"
                            label="Selecione a planilha 9800"
                            placeholder="Import file"
                            fullWidth
                            margin="normal"
                            onChange={handleImageInputXML9805}
                            type="file"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                        <Box>
                            <Alert severity="info">Verifique aqui o resultado XML 9805</Alert>
                        </Box>
                        <TextField
                            id="outlined-multiline-static"
                            label="XML"
                            fullWidth
                            type="pre"
                            margin="normal"
                            multiline
                            rowsMax={30}
                            value={xml9805}
                            variant="outlined"
                        />
                        <Button className={classes.myButton} variant="contained" onClick={generateXML9805} color="primary">Gerar</Button>
                        <Button className={classes.myButton} variant="contained" onClick={handleSaveToPC9805} color="primary">Download</Button>
                    </Grid>
                </Grid>
            </Container>
        </header>
    );
}

export default BacenXML;