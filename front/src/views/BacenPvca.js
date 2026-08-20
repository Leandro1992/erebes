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
        let errors = [];
        form.append("sheets", path);
        form.append("database", database);
        form.append("instituicao", instituicao);
        form.append("database1", database1);

        if (!path.name) errors.push("Selecione uma planilha!");
        if (!database) errors.push("Preencha a data de geração do arquivo!");
        if (!instituicao) errors.push("Preencha os dados da instituição!");
        if (!database1) errors.push("Preencha a data base para envio dos arquivos!");

        if (errors.length > 0) {
            let stringError = "Erros encontrados:\n" + errors.join("\n");
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

                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', 'BACEN.ZIP');
                document.body.appendChild(link);
                link.click();

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
        <div className={classes.header}>
            <Container maxWidth="sm" className={classes.mainContainer}>
                <h1 className={classes.pageTitle}>Pagamentos de Varejo e Canais</h1>
                <p className={classes.pageSubtitle}>
                    Gere arquivos PVCA conforme a Instrução Normativa BCB nº 335.
                </p>

                <Card className={classes.formCard}>
                    <div className={classes.formSection}>
                        <h3 className={classes.sectionTitle}>Configurações</h3>
                        <Alert severity="info" className={classes.alertBox}>
                            Informações referentes a pagamentos de varejo e canais de atendimento.
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
                            label="Data de geração do arquivo"
                            placeholder="20230310"
                            fullWidth
                            margin="normal"
                            value={database}
                            onChange={(e) => setDatabase(e.target.value)}
                            type="text"
                            variant="outlined"
                            className={classes.textField}
                            helperText="Formato: AAAAMMDD"
                        />

                        <TextField
                            label="ISPB ou os 8 primeiros dígitos do CNPJ"
                            placeholder="12345678"
                            fullWidth
                            margin="normal"
                            value={instituicao}
                            onChange={(e) => setInstituicao(e.target.value)}
                            type="text"
                            variant="outlined"
                            className={classes.textField}
                            helperText="Formato: 00000000"
                        />

                        <TextField
                            label="Data-base dos arquivos"
                            placeholder="202303"
                            fullWidth
                            margin="normal"
                            value={database1}
                            onChange={(e) => setDatabase1(e.target.value)}
                            type="text"
                            variant="outlined"
                            className={classes.textField}
                            helperText="Formato: AAAAMM"
                        />

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
                            Gerar Arquivo PVCA
                        </Button>
                    </div>
                </Card>
            </Container>
        </div>
    );

}

export default BacenPvca;