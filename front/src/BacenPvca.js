import React, { useState } from "react";
import './App.css';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
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
    },
    formControl: {
        margin: theme.spacing(0),
        marginBottom: '30px',
        minWidth: '100%',
    },
}));

function BacenPvca() {

    const classes = useStyles();

    const [tipoLayout, setTipoLayout] = useState("");
    const [database, setDatabase] = useState("");
    const [instituicao, setInstituicao] = useState("");
    const [database1, setDatabase1] = useState("");
    const [path, setPath] = useState({});

    const handleImageInput = event => {
        setPath(event.target.files[0])
    }

    const generateFile = () => {
        let form = new FormData();
        console.log(path, database, instituicao, database1, tipoLayout);
        form.append("sheets", path);
        form.append("database", database);
        form.append("instituicao", instituicao);
        form.append("database1", database1);
        form.append("database1", tipoLayout);

        axios.post('/api/upload/pvca', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob'
        }).then(res => {
            console.log(res, "resposta")
            const href = URL.createObjectURL(res.data);

            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'BACEN.ZIP'); //or any other extension
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        }).catch(err => {
            console.error({ err });
        });
    }

    const handleTipoLayout = event => {
        console.log(event.target.value, "vou deixar aqui caso eu precise!")
        setTipoLayout(event.target.value);
    }

    return (
        <header className="App-header">
            <Container >
                <Grid container spacing={2}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        <Box>
                            <Alert severity="info"> Informações referentes a pagamentos de varejo e canais de atendimento , definidas pela Instrução Normativa BCB nº 335, de 8 de dezembro de 2022.
                            </Alert>
                        </Box>

                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Selecione um layout</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="filled-full-width"
                                fullWidth
                                value={tipoLayout}
                                onChange={handleTipoLayout}
                            >
                                <MenuItem value={"CONGLOME"}>CONGLOME</MenuItem>
                                <MenuItem value={"CONTATOS"}>CONTATOS</MenuItem>
                                <MenuItem value={"DATABASE"}>DATABASE</MenuItem>
                                <MenuItem value={"ESTATATM"}>ESTATATM</MenuItem>
                                <MenuItem value={"ESTATCRT"}>ESTATCRT</MenuItem>
                                <MenuItem value={"OPEINTRA"}>OPEINTRA</MenuItem>
                                <MenuItem value={"TRANSOPA"}>TRANSOPA</MenuItem>
                                <MenuItem value={"USUREMOT"}>USUREMOT</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            id="date"
                            fullWidth
                            label="Data de geração do arquivo (AAAAMMDD)"
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
                            value={instituicao}
                            onChange={(e) => setInstituicao(e.target.value)}
                            label="ISPB ou os 8 (oito) primeiros dígitos do CNPJ da instituição (ou da instituição líder do conglomerado financeiro)"
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            id="date"
                            fullWidth
                            label="Data-base dos arquivos enviados (AAAAMM)"
                            margin="normal"
                            value={database1}
                            onChange={(e) => setDatabase1(e.target.value)}
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            id="filled-full-width"
                            label="Planilha base"
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
                        <Button className={classes.myButton} variant="contained" onClick={generateFile} color="primary">Gerar</Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
            </Container>
        </header>
    );

}

export default BacenPvca;