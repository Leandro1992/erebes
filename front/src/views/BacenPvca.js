import React, { useState } from "react";
import '../App.css';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


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

    const [database, setDatabase] = useState("");
    const [instituicao, setInstituicao] = useState("");
    const [database1, setDatabase1] = useState("");
    const [path, setPath] = useState({});
    const [open, setOpen] = useState(false);
    const [openSucesso, setOpenSucesso] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");


    const handleImageInput = event => {
        setPath(event.target.files[0])
    }

    const generateFile = () => {
        let form = new FormData();
        console.log(path, database, instituicao, database1);
        let errors = [];
        form.append("sheets", path);
        form.append("database", database);
        form.append("instituicao", instituicao);
        form.append("database1", database1);

        if (!path.name) errors.push("Selecione uma planilha!")
        if (!database) errors.push("Preencha a data de geração do arquivo!")
        if (!instituicao) errors.push("Preencha os dados da instituição!")
        if (!database1) errors.push("Preencha a data base para envio dos arquivos!")
        if (database.toString().length > 8) errors.push("Data de geração do arquivo deve seguir o padrão (AAAAMMDD). EX: 20230310")
        if (instituicao.toString().length > 8) errors.push("O CNPJ da Instituição deve seguir o padrão (00000000). EX: 12345678")
        if (database1.toString().length > 6) errors.push("Data base de envio do arquivo deve seguir o padrão (AAAAMM). EX: 202303")

        console.log(errors, "foi?")
        if (errors.length > 0) {
            let stringError = "Erros encontrados: "
            for (let index = 0; index < errors.length; index++) {
                stringError = stringError.concat(errors[index] + " ")
                
            }
            console.log(stringError);
            setErrorMsg(stringError);
            setOpen(true);
        } else {
            setOpenSucesso(true);
            axios.post('/api/upload/pvca', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob'
            }).then(res => {
                setOpenSucesso(false);
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
                setOpenSucesso(false);
                console.error(err);
                setErrorMsg(err);
                setOpen(true);
            });
        }
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
                            <Collapse in={open}>
                                <Alert 
                                    variant="outlined" 
                                    severity="error"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setOpen(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    {errorMsg}
                                </Alert>
                            </Collapse>
                            <Collapse in={openSucesso}>
                                <Alert 
                                    variant="outlined" 
                                    severity="warning"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setOpenSucesso(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    Aguarde o processamento dos arquivos...
                                </Alert>
                            </Collapse>
                        </Box>

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