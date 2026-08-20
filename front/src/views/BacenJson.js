import React, { useState } from "react";
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Card from '@material-ui/core/Card';

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
    outputCard: {
        background: '#ffffff',
        borderRadius: 22,
        border: '1px solid rgba(11,59,102,0.08)',
        boxShadow: '0 12px 28px rgba(15,62,100,0.08)',
        padding: theme.spacing(3.5),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
    },
    outputTitle: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#0d2343',
        margin: 0,
        paddingBottom: theme.spacing(1),
        borderBottom: '2px solid rgba(11,59,102,0.08)',
    },
    jsonOutput: {
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


function BacenJSON() {

        const classes = useStyles();

        const [path, setPath] = useState({});
        const [cnpj, setCNPJ] = useState("");
        const [doc, setDoc] = useState("");
        const [remessa, setRemessa] = useState("");
        const [unidade, setUnindade] = useState(0);
        const [database, setDatabase] = useState("");
        const [database1, setDatabase1] = useState("");
        const [database2, setDatabase2] = useState("");
        const [database3, setDatabase3] = useState("");
        const [database4, setDatabase4] = useState("");
        const [bp1, setBp1] = useState("");
        const [bp2, setBp2] = useState("");
        const [json, setJSON] = useState(JSON.stringify({ "Exemple": "Exemple", "Exemple2": "Exemple2" }, null, 2));

        const handleImageInput = event => {
            setPath(event.target.files[0])
        }

        const handleSaveToPC = (filename) => {
            const dataUrl = `data:application/json,${json}`
            const link = document.createElement('a');
            link.download = `demonstracoes_financeiras.json`;
            link.href = dataUrl;
            link.click();
        }

        const generateJSON = () => {
            let formData = new FormData();
            let errors = [];
            
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
            formData.append("bp1", bp1);
            formData.append("bp2", bp2);

            // Validações obrigatórias
            if (!path || !path.name) errors.push("Selecione uma planilha!");
            if (!cnpj) errors.push("Preencha o CNPJ!");
            if (!doc) errors.push("Preencha o código do documento!");
            if (!remessa) errors.push("Preencha o tipo de remessa!");
            if (!database) errors.push("Preencha a data base!");
            if (!database1) errors.push("Data Referência 1 (dt1) é obrigatória!");
            if (bp1 && bp1.toString().length > 6) errors.push("BP1 deve seguir o padrão (AAAAMM) ou o formato da referência de BP.");
            if (bp2 && bp2.toString().length > 6) errors.push("BP2 deve seguir o padrão (AAAAMM) ou o formato da referência de BP.");

            if (errors.length > 0) {
                alert("Erros encontrados:\n" + errors.join("\n"));
                return;
            }

            axios.post('api/upload', formData, {
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
            <div className={classes.header}>
                <Container maxWidth="lg" className={classes.mainContainer}>
                    <h1 className={classes.pageTitle}>Demonstrações Financeiras</h1>
                    <p className={classes.pageSubtitle}>
                        Gere estruturas JSON para BP, DRE, DFC, DRA e DMPL a partir de planilhas padronizadas.
                    </p>

                    <div className={classes.contentGrid}>
                        <Card className={classes.formCard}>
                            <div className={classes.formSection}>
                                <h3 className={classes.sectionTitle}>Arquivo e Configurações</h3>
                                <Alert severity="info" className={classes.alertBox}>
                                    Selecione a planilha com os dados para geração
                                </Alert>
                                <TextField
                                    label="Arquivo XLSX"
                                    placeholder="Selecione o arquivo..."
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

                            <div className={classes.formSection}>
                                <h3 className={classes.sectionTitle}>Dados da Instituição</h3>
                                <TextField
                                    label="CNPJ"
                                    placeholder="00.000.000/0000-00"
                                    fullWidth
                                    margin="normal"
                                    onChange={(e) => setCNPJ(e.target.value)}
                                    type="text"
                                    value={cnpj}
                                    variant="outlined"
                                    className={classes.textField}
                                />
                                <TextField
                                    label="Código do Documento"
                                    placeholder="Ex: 90x1"
                                    fullWidth
                                    margin="normal"
                                    onChange={(e) => setDoc(e.target.value)}
                                    type="text"
                                    value={doc}
                                    variant="outlined"
                                    className={classes.textField}
                                />
                                <TextField
                                    label="Tipo de Remessa"
                                    placeholder="Ex: E"
                                    fullWidth
                                    margin="normal"
                                    onChange={(e) => setRemessa(e.target.value)}
                                    type="text"
                                    value={remessa}
                                    variant="outlined"
                                    className={classes.textField}
                                />
                                <TextField
                                    label="Unidade de Medida"
                                    placeholder="0"
                                    fullWidth
                                    margin="normal"
                                    onChange={(e) => setUnindade(e.target.value)}
                                    type="number"
                                    value={unidade}
                                    variant="outlined"
                                    className={classes.textField}
                                />
                            </div>

                            <div className={classes.formSection}>
                                <h3 className={classes.sectionTitle}>Datas de Referência</h3>
                                <TextField
                                    label="Data Base"
                                    placeholder="062016"
                                    fullWidth
                                    margin="normal"
                                    value={database}
                                    onChange={(e) => setDatabase(e.target.value)}
                                    type="text"
                                    variant="outlined"
                                    className={classes.textField}
                                />

                                <TextField
                                    label="Data Referência 1 (dt1) *OBRIGATÓRIA*"
                                    placeholder="S062016"
                                    fullWidth
                                    margin="normal"
                                    value={database1}
                                    onChange={(e) => setDatabase1(e.target.value)}
                                    type="text"
                                    variant="outlined"
                                    className={classes.textField}
                                    helperText="Usada para todos os demonstrativos"
                                />

                                <TextField
                                    label="Data Referência 2 (dt2)"
                                    placeholder="S062016"
                                    fullWidth
                                    margin="normal"
                                    value={database2}
                                    onChange={(e) => setDatabase2(e.target.value)}
                                    type="text"
                                    variant="outlined"
                                    className={classes.textField}
                                    helperText="Opcional"
                                />

                                <TextField
                                    label="Data Referência 3 (dt3)"
                                    placeholder="S062016"
                                    fullWidth
                                    margin="normal"
                                    value={database3}
                                    onChange={(e) => setDatabase3(e.target.value)}
                                    type="text"
                                    variant="outlined"
                                    className={classes.textField}
                                    helperText="Opcional"
                                />

                                <TextField
                                    label="Data Referência 4 (dt4)"
                                    placeholder="S062016"
                                    fullWidth
                                    margin="normal"
                                    value={database4}
                                    onChange={(e) => setDatabase4(e.target.value)}
                                    type="text"
                                    variant="outlined"
                                    className={classes.textField}
                                    helperText="Opcional"
                                />

                                <TextField
                                    label="Data Referência BP1 (bp1)"
                                    placeholder="S062016"
                                    fullWidth
                                    margin="normal"
                                    value={bp1}
                                    onChange={(e) => setBp1(e.target.value)}
                                    type="text"
                                    variant="outlined"
                                    className={classes.textField}
                                    helperText="Opcional, exclusiva do Balanço Patrimonial"
                                />

                                <TextField
                                    label="Data Referência BP2 (bp2)"
                                    placeholder="S062016"
                                    fullWidth
                                    margin="normal"
                                    value={bp2}
                                    onChange={(e) => setBp2(e.target.value)}
                                    type="text"
                                    variant="outlined"
                                    className={classes.textField}
                                    helperText="Opcional, exclusiva do Balanço Patrimonial"
                                />
                            </div>

                            <div className={classes.buttonGroup}>
                                <Button className={classes.generateButton} variant="contained" onClick={generateJSON}>
                                    Gerar JSON
                                </Button>
                                <Button className={classes.downloadButton} variant="contained" onClick={handleSaveToPC}>
                                    Baixar JSON
                                </Button>
                            </div>
                        </Card>

                        <Card className={classes.outputCard}>
                            <h3 className={classes.outputTitle}>Resultado JSON</h3>
                            <pre className={classes.jsonOutput}>{json}</pre>
                        </Card>
                    </div>
                </Container>
            </div>
        );

}

export default BacenJSON;