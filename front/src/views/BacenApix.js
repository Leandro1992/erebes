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
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';


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

function BacenApix() {

    const classes = useStyles();

    const [database, setDatabase] = useState("");
    const [instituicao, setInstituicao] = useState("");
    const [path, setPath] = useState(null);
    const [open, setOpen] = useState(false);
    const [openSucesso, setOpenSucesso] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [remessa, setRemessa] = useState("");
    const [ano, setAno] = useState("");
    const [mes, setMes] = useState("");
    const [nomeResp, setNomeResp] = useState("");
    const [emailResp, setEmail] = useState("");
    const [telResp, setTelResp] = useState("");

    const handleSaveXml = (filename, dataXml) => {
        let dataUrl = `data:application/xml;charset=utf-8,${dataXml}`
        let link = document.createElement('a');
        link.download = `${filename}.xml`;
        link.href = dataUrl;
        link.click();
    }

    const resetForm = () => {
        setDatabase("");
        setInstituicao("");
        setPath(null);
        setOpen(false);
        setRemessa("");
        setAno("");
        setNomeResp("");
        setEmail("");
        setAno("");
        setTelResp("");
    }

    const handleImageInput = event => {
        setPath(event.target.files[0])
    }

    const generateFile = () => {
        setOpenSucesso(false);
        setOpen(false);
        let form = new FormData();
        let errors = [];
        form.append("sheets", path);
        form.append("database", database);
        form.append("instituicao", instituicao);
        form.append("mes", mes);
        form.append("ano", ano);
        form.append("nome", nomeResp);
        form.append("email", emailResp);
        form.append("telefone", telResp);
        form.append("remessa", remessa);

        if (!path || !path.name) errors.push("Selecione uma planilha!")
        if (!database) errors.push("Preencha a data de geração do arquivo!")
        if (!instituicao) errors.push("Preencha os dados da instituição!")
        if (!remessa) errors.push("Preencha o tipo de envio!")
        if (!mes) errors.push("Preencha os dados do mês do registro!")
        if (!ano) errors.push("Preencha os dados do ano do registro!")
        if (!nomeResp) errors.push("Preencha os dados do nome do responsável!")
        if (!emailResp) errors.push("Preencha os dados do email do responsável!")
        if (!telResp) errors.push("Preencha os dados do telefone do responsável!")
        if (database.toString().length > 10) errors.push("Data de geração do arquivo deve seguir o padrão (AAAA-MM-DD). EX: 2023-03-10")
        if (database.toString().length < 10) errors.push("Data de geração do arquivo deve seguir o padrão (AAAA-MM-DD). EX: 2023-03-10")
        if (instituicao.toString().length > 8) errors.push("O CNPJ da Instituição deve seguir o padrão (00000000). EX: 12345678")
        if (telResp.toString().length != 11) errors.push("O campo telefone aceita apenas 11 dígitos. EX: 99999999999")
        if (ano.toString().length != 4) errors.push("O campo ano aceita apenas 4 dígitos. EX: 2024")
        if (mes.toString().length != 2) errors.push("O campo mes aceita apenas 2 dígitos. EX: 10")

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
            console.log(path, database, instituicao, remessa, form);
            axios.post('/api/upload/apix', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log(res, "Retornou")
                setOpenSucesso(false);
                if (res.data && !res.data.err) {
                    //PROCESSA DOWNLOAD
                    handleSaveXml(instituicao, res.data.data);
                    resetForm()
                }
                if (res.data.err) {
                    setErrorMsg(res.data.err);
                    setOpen(true);
                }
            }).catch(err => {
                console.log(err, "Retornou erro")
                resetForm();
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
                            <Alert severity="info"> APIX - Documento 1201
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
                            label="Data-base da informação (AAAA-MM-DD)"
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
                            id="ano"
                            fullWidth
                            margin="normal"
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                            label="Ano referência (Fomato ex: 2024)"
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            id="mes"
                            fullWidth
                            margin="normal"
                            value={mes}
                            onChange={(e) => setMes(e.target.value)}
                            label="Mês referência (01 - 12) (Fomato ex: 10)"
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            id="nome"
                            fullWidth
                            margin="normal"
                            value={nomeResp}
                            onChange={(e) => setNomeResp(e.target.value)}
                            label="Nome do responsável (Fomato ex: Fulano de tal)"
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            id="email"
                            fullWidth
                            margin="normal"
                            value={emailResp}
                            onChange={(e) => setEmail(e.target.value)}
                            label="E-mail do responsável (Fomato ex: fulano@dominio.com)"
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            id="telefone"
                            fullWidth
                            margin="normal"
                            value={telResp}
                            onChange={(e) => setTelResp(e.target.value)}
                            label="Telefone do responsável (Fomato ex: 99999999999)"
                            type="text"
                            variant="filled"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Tipo de Envio</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="filled-full-width"
                                fullWidth
                                value={remessa}
                                onChange={(e) => setRemessa(e.target.value)}
                            >
                                <MenuItem value={"I"}>Inclusão</MenuItem>
                                <MenuItem value={"S"}>Substituição</MenuItem>
                            </Select>
                        </FormControl>

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

export default BacenApix;