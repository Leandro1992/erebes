import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
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
        maxWidth: 1200,
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
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },
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
    buttonGroup: {
        display: 'flex',
        gap: theme.spacing(1.5),
        marginTop: theme.spacing(3),
        flexWrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
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
    downloadButton: {
        background: 'linear-gradient(135deg, #f5c75d 0%, #e6a12c 100%)',
        color: '#12314f',
        fontWeight: 700,
        borderRadius: 12,
        padding: theme.spacing(1.3, 2.6),
        textTransform: 'none',
        '&:hover': {
            background: 'linear-gradient(135deg, #f5d57f 0%, #ed9d1c 100%)',
            boxShadow: '0 8px 20px rgba(245,199,93,0.25)',
        },
    },
    xmlOutput: {
        background: '#f8f9fb',
        borderRadius: 12,
        border: '1px solid rgba(11,59,102,0.08)',
        padding: theme.spacing(2),
        fontFamily: 'Courier New, monospace',
        fontSize: '0.9rem',
        color: '#0d2343',
        overflowX: 'auto',
        maxHeight: 400,
        lineHeight: 1.5,
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
        <div className={classes.header}>
            <Container maxWidth="lg" className={classes.mainContainer}>
                <h1 className={classes.pageTitle}>Arquivos XML ASVR</h1>
                <p className={classes.pageSubtitle}>
                    Gere arquivos XML 9800 e 9805 de acordo com as normas do Banco Central.
                </p>

                <div className={classes.contentGrid}>
                    <Card className={classes.formCard}>
                        <div className={classes.formSection}>
                            <h3 className={classes.sectionTitle}>Geração XML ASVR9800</h3>
                            <Alert severity="info" className={classes.alertBox}>
                                Estrutura XML para operações cambiais
                            </Alert>
                        </div>

                        <div className={classes.formSection}>
                            <TextField
                                label="CNPJ"
                                placeholder="00.000.000/0000-00"
                                fullWidth
                                margin="normal"
                                onChange={(e) => setCNPJif9800(e.target.value)}
                                type="text"
                                value={cnpjif9800}
                                variant="outlined"
                                className={classes.textField}
                            />
                            <FormControl className={classes.formControl} variant="outlined">
                                <InputLabel id="tipo-envio-9800">Tipo de Envio</InputLabel>
                                <Select
                                    labelId="tipo-envio-9800"
                                    id="select-tipo-9800"
                                    fullWidth
                                    value={tipoEnvio9800}
                                    onChange={handleTipoChange9800}
                                    label="Tipo de Envio"
                                >
                                    <MenuItem value={"I"}>Inclusão</MenuItem>
                                    <MenuItem value={"S"}>Substituição</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Data Base"
                                placeholder="202101"
                                fullWidth
                                margin="normal"
                                value={databaseXML9800}
                                onChange={(e) => setdatabaseXML9800(e.target.value)}
                                type="text"
                                variant="outlined"
                                className={classes.textField}
                                helperText="Formato: AAAAMM"
                            />
                            <TextField
                                label="Selecione a planilha 9800"
                                fullWidth
                                margin="normal"
                                onChange={handleImageInputXML9800}
                                type="file"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                className={classes.textField}
                            />
                        </div>

                        <div className={classes.buttonGroup}>
                            <Button className={classes.generateButton} variant="contained" onClick={generateXML9800}>
                                Gerar XML 9800
                            </Button>
                            <Button className={classes.downloadButton} variant="contained" onClick={handleSaveToPC9800}>
                                Baixar XML
                            </Button>
                        </div>
                    </Card>

                    <Card className={classes.formCard}>
                        <div className={classes.formSection}>
                            <h3 className={classes.sectionTitle}>Resultado XML 9800</h3>
                        </div>
                        <pre className={classes.xmlOutput}>{xml9800}</pre>
                    </Card>
                </div>

                <div style={{ marginTop: 32 }} className={classes.contentGrid}>
                    <Card className={classes.formCard}>
                        <div className={classes.formSection}>
                            <h3 className={classes.sectionTitle}>Geração XML ASVR9805</h3>
                            <Alert severity="info" className={classes.alertBox}>
                                Estrutura XML para operações de seguro
                            </Alert>
                        </div>

                        <div className={classes.formSection}>
                            <TextField
                                label="CNPJ"
                                placeholder="00.000.000/0000-00"
                                fullWidth
                                margin="normal"
                                onChange={(e) => setCNPJif9805(e.target.value)}
                                type="text"
                                value={cnpjif9805}
                                variant="outlined"
                                className={classes.textField}
                            />
                            <FormControl className={classes.formControl} variant="outlined">
                                <InputLabel id="tipo-envio-9805">Tipo de Envio</InputLabel>
                                <Select
                                    labelId="tipo-envio-9805"
                                    id="select-tipo-9805"
                                    fullWidth
                                    value={tipoEnvio9805}
                                    onChange={handleTipoChange9805}
                                    label="Tipo de Envio"
                                >
                                    <MenuItem value={"I"}>Inclusão</MenuItem>
                                    <MenuItem value={"S"}>Substituição</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Data Base"
                                placeholder="202101"
                                fullWidth
                                margin="normal"
                                value={databaseXML9805}
                                onChange={(e) => setdatabaseXML9805(e.target.value)}
                                type="text"
                                variant="outlined"
                                className={classes.textField}
                                helperText="Formato: AAAAMM"
                            />
                            <TextField
                                label="Selecione a planilha 9805"
                                fullWidth
                                margin="normal"
                                onChange={handleImageInputXML9805}
                                type="file"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                className={classes.textField}
                            />
                        </div>

                        <div className={classes.buttonGroup}>
                            <Button className={classes.generateButton} variant="contained" onClick={generateXML9805}>
                                Gerar XML 9805
                            </Button>
                            <Button className={classes.downloadButton} variant="contained" onClick={handleSaveToPC9805}>
                                Baixar XML
                            </Button>
                        </div>
                    </Card>

                    <Card className={classes.formCard}>
                        <div className={classes.formSection}>
                            <h3 className={classes.sectionTitle}>Resultado XML 9805</h3>
                        </div>
                        <pre className={classes.xmlOutput}>{xml9805}</pre>
                    </Card>
                </div>
            </Container>
        </div>
    );
}

export default BacenXML;