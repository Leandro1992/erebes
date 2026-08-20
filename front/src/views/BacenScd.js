import React, { useState } from "react";
import '../App.css';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
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
    header: {
        background: '#ffffff',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(3, 2, 4),
    },
    mainContainer: {
        maxWidth: 900,
        width: '100%',
    },
    pageTitle: {
        fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
        color: '#12314f',
        fontWeight: 800,
        margin: '0 0 12px',
        letterSpacing: '-0.02em',
    },
    pageSubtitle: {
        color: '#49657d',
        fontSize: '1.05rem',
        margin: '0 0 28px',
        lineHeight: 1.6,
    },
    formCard: {
        background: '#ffffff',
        borderRadius: 22,
        border: '1px solid rgba(11,59,102,0.08)',
        boxShadow: '0 12px 28px rgba(15,62,100,0.08)',
        padding: theme.spacing(3.5),
    },
    formSection: {
        marginBottom: theme.spacing(2.5),
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#0d2343',
        margin: '0 0 18px',
        paddingBottom: theme.spacing(1),
        borderBottom: '2px solid rgba(11,59,102,0.08)',
    },
    textField: {
        marginBottom: theme.spacing(2),
        '& .MuiOutlinedInput-root': {
            borderRadius: 12,
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(11,59,102,0.15)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(11,59,102,0.25)',
        },
    },
    formControl: {
        marginBottom: theme.spacing(2),
        width: '100%',
        '& .MuiOutlinedInput-root': {
            borderRadius: 12,
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(11,59,102,0.15)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(11,59,102,0.25)',
        },
    },
    alertBox: {
        marginBottom: theme.spacing(2),
        borderRadius: 14,
        border: '1px solid rgba(11,59,102,0.1)',
    },
    buttonGroup: {
        display: 'flex',
        gap: theme.spacing(1.5),
        marginTop: theme.spacing(3),
        flexWrap: 'wrap',
    },
    generateButton: {
        background: 'linear-gradient(135deg, #0c67b6 0%, #145ea5 100%)',
        color: '#fff',
        fontWeight: 700,
        borderRadius: 12,
        padding: theme.spacing(1.3, 2.6),
        textTransform: 'none',
        '&:hover': {
            background: 'linear-gradient(135deg, #0d5fa5 0%, #134d93 100%)',
            boxShadow: '0 8px 20px rgba(12,103,182,0.25)',
        },
    },
}));

function BacenScd() {

    const classes = useStyles();

    const [database, setDatabase] = useState("");
    const [instituicao, setInstituicao] = useState("");
    const [path, setPath] = useState(null);
    const [open, setOpen] = useState(false);
    const [openSucesso, setOpenSucesso] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [remessa, setRemessa] = useState("");

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
        form.append("remessa", remessa);

        if (!path || !path.name) errors.push("Selecione uma planilha!");
        if (!database) errors.push("Preencha a data de geração do arquivo!");
        if (!instituicao) errors.push("Preencha o ISPB ou CNPJ!");
        if (!remessa) errors.push("Selecione o tipo de envio!");
        if (database.toString().length !== 10) errors.push("Data deve seguir o padrão AAAA-MM-DD.");
        if (instituicao.toString().length > 8) errors.push("CNPJ deve seguir o padrão 00000000.");

        if (errors.length > 0) {
            let stringError = "Erros encontrados:\n" + errors.join("\n");
            setErrorMsg(stringError);
            setOpen(true);
        } else {
            setOpenSucesso(true);
            axios.post('/api/upload/scd', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                setOpenSucesso(false);
                if (res.data && !res.data.err) {
                    handleSaveXml(instituicao, res.data.data);
                    resetForm()
                }
                if (res.data.err) {
                    setErrorMsg(res.data.err);
                    setOpen(true);
                }
            }).catch(err => {
                resetForm();
                setOpenSucesso(false);
                console.error(err);
                setErrorMsg(err);
                setOpen(true);
            });
        }
    }

    return (
        <div className={classes.header}>
            <Container maxWidth="sm" className={classes.mainContainer}>
                <h1 className={classes.pageTitle}>Saldos Contábeis Diários</h1>
                <p className={classes.pageSubtitle}>
                    Gere arquivos XML SCD conforme o Documento 4111 do Banco Central.
                </p>

                <Card className={classes.formCard}>
                    <div className={classes.formSection}>
                        <h3 className={classes.sectionTitle}>Configurações</h3>
                        <Alert severity="info" className={classes.alertBox}>
                            Saldos Contábeis Diários - Documento 4111
                        </Alert>
                    </div>

                    <Collapse in={open}>
                        <Alert
                            variant="outlined"
                            severity="error"
                            className={classes.alertBox}
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
                            className={classes.alertBox}
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

                    <div className={classes.formSection}>
                        <h3 className={classes.sectionTitle}>Dados Obrigatórios</h3>
                        <TextField
                            fullWidth
                            margin="normal"
                            value={instituicao}
                            onChange={(e) => setInstituicao(e.target.value)}
                            label="ISPB ou os 8 primeiros dígitos do CNPJ"
                            placeholder="12345678"
                            type="text"
                            variant="outlined"
                            className={classes.textField}
                            helperText="Formato: 00000000"
                        />

                        <TextField
                            label="Data-base da informação"
                            placeholder="2023-03-10"
                            fullWidth
                            margin="normal"
                            value={database}
                            onChange={(e) => setDatabase(e.target.value)}
                            type="text"
                            variant="outlined"
                            className={classes.textField}
                            helperText="Formato: AAAA-MM-DD"
                        />

                        <FormControl className={classes.formControl} variant="outlined">
                            <InputLabel id="tipo-envio-scd">Tipo de Envio</InputLabel>
                            <Select
                                labelId="tipo-envio-scd"
                                id="select-tipo-scd"
                                fullWidth
                                value={remessa}
                                onChange={(e) => setRemessa(e.target.value)}
                                label="Tipo de Envio"
                            >
                                <MenuItem value={"I"}>Inclusão</MenuItem>
                                <MenuItem value={"S"}>Substituição</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Selecione a planilha"
                            fullWidth
                            margin="normal"
                            onChange={handleImageInput}
                            type="file"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            className={classes.textField}
                        />
                    </div>

                    <div className={classes.buttonGroup}>
                        <Button className={classes.generateButton} variant="contained" onClick={generateFile}>
                            Gerar Arquivo SCD
                        </Button>
                    </div>
                </Card>
            </Container>
        </div>
    );

}

export default BacenScd;