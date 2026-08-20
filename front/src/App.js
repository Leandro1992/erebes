import React, { useState } from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import BacenJSON from './views/BacenJson';
import BacenXML from './views/BacenXml';
import BacenPvca from './views/BacenPvca';
import BacenScd from './views/BacenScd';
import BacenApix from './views/BacenApix';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LogoBacen from './logo-bc.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: 'linear-gradient(90deg, #0b3b66 0%, #0c4d85 35%, #113e70 100%)',
    boxShadow: '0 8px 28px rgba(9, 40, 79, 0.18)',
  },
  toolbar: {
    minHeight: 72,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    padding: theme.spacing(1.5, 3),
  },
  brandWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    boxShadow: '0 4px 14px rgba(255,255,255,0.2)',
    background: '#fff',
    padding: 4,
  },
  brandText: {
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontSize: '0.95rem',
  },
  navActions: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  navButton: {
    color: '#edf5ff',
    borderRadius: 999,
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
      background: 'rgba(255,255,255,0.08)',
    },
  },
  menu: {
    maxWidth: 1300,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(4, 2, 6),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  heroPanel: {
    background: 'linear-gradient(135deg, rgba(12,77,133,0.94), rgba(31,107,171,0.87), rgba(19,54,91,0.95))',
    borderRadius: 28,
    padding: theme.spacing(4, 4, 3),
    display: 'grid',
    gridTemplateColumns: '1.5fr 0.9fr',
    gap: theme.spacing(3),
    boxShadow: '0 18px 40px rgba(16, 55, 89, 0.2)',
    color: '#f3f8ff',
    overflow: 'hidden',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: -60,
      top: -80,
      width: 260,
      height: 260,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      padding: theme.spacing(3, 2),
    },
  },
  heroText: {
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.12)',
    color: '#e8f3ff',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontSize: '0.72rem',
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 3.6rem)',
    lineHeight: 1.08,
    margin: 0,
    fontWeight: 800,
    letterSpacing: '-0.04em',
  },
  subtitle: {
    fontSize: '1.03rem',
    lineHeight: 1.7,
    color: 'rgba(243,248,255,0.9)',
    maxWidth: 700,
    marginTop: theme.spacing(2),
  },
  heroActions: {
    marginTop: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  primaryAction: {
    background: 'linear-gradient(135deg, #f5c75d 0%, #e6a12c 100%)',
    color: '#12314f',
    fontWeight: 700,
    borderRadius: 999,
    padding: theme.spacing(1.2, 2.4),
    textTransform: 'none',
    '&:hover': {
      background: 'linear-gradient(135deg, #f5d57f 0%, #ed9d1c 100%)',
    },
  },
  secondaryAction: {
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.35)',
    color: '#f3f8ff',
    fontWeight: 600,
    textTransform: 'none',
    padding: theme.spacing(1.2, 2.4),
  },
  heroImageWrap: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  heroImage: {
    width: 'min(100%, 280px)',
    opacity: 0.96,
    filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.18))',
  },
  modulesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
  modulesTitle: {
    color: '#12314f',
    fontWeight: 800,
    fontSize: '1.7rem',
    margin: 0,
  },
  moduleGrid: {
    width: '100%',
  },
  moduleCard: {
    borderRadius: 22,
    padding: theme.spacing(2.5),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: '#ffffff',
    border: '1px solid rgba(11,59,102,0.08)',
    boxShadow: '0 12px 24px rgba(10, 42, 74, 0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 16px 28px rgba(15, 62, 100, 0.12)',
    },
  },
  moduleTag: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: theme.spacing(1.5),
    width: 'fit-content',
  },
  moduleTitle: {
    fontWeight: 700,
    color: '#0d2343',
    margin: '0 0 10px',
    fontSize: '1.12rem',
  },
  moduleDescription: {
    color: '#49657d',
    lineHeight: 1.6,
    margin: '0 0 18px',
    minHeight: 72,
  },
  moduleButton: {
    width: '100%',
    borderRadius: 14,
    textTransform: 'none',
    fontWeight: 700,
    padding: theme.spacing(1.1, 1.4),
  },
  moduleButtonJson: {
    background: 'linear-gradient(135deg, #0c67b6 0%, #145ea5 100%)',
    color: '#fff',
  },
  moduleButtonXml: {
    background: 'linear-gradient(135deg, #b36d00 0%, #d58a0b 100%)',
    color: '#fff',
  },
  moduleButtonPvca: {
    background: 'linear-gradient(135deg, #2a9d8f 0%, #1fa69e 100%)',
    color: '#fff',
  },
  moduleButtonScd: {
    background: 'linear-gradient(135deg, #0d7f86 0%, #0d5d73 100%)',
    color: '#fff',
  },
  moduleButtonApix: {
    background: 'linear-gradient(135deg, #9e5d7f 0%, #7b4765 100%)',
    color: '#fff',
  },
  aboutWrap: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: theme.spacing(4, 2, 6),
  },
  aboutCard: {
    background: '#ffffff',
    borderRadius: 26,
    border: '1px solid rgba(11,59,102,0.08)',
    boxShadow: '0 18px 32px rgba(15,62,100,0.08)',
    padding: theme.spacing(4),
  },
  aboutTitle: {
    fontSize: 'clamp(2rem, 3vw, 2.8rem)',
    color: '#12314f',
    margin: '0 0 18px',
    fontWeight: 800,
  },
  aboutText: {
    color: '#3d5368',
    lineHeight: 1.8,
    fontSize: '1.04rem',
    margin: 0,
  },
  authorBlock: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2.5),
    borderRadius: 18,
    background: 'linear-gradient(135deg, rgba(11,59,102,0.04), rgba(12,77,133,0.08))',
    border: '1px solid rgba(11,59,102,0.08)',
  },
  authorName: {
    margin: 0,
    color: '#0d2343',
    fontWeight: 700,
    fontSize: '1.2rem',
  },
  authorMeta: {
    margin: '8px 0 0',
    color: '#405872',
    lineHeight: 1.7,
  },
  link: {
    color: '#0b67b3',
    fontWeight: 700,
    textDecoration: 'none',
  },
}));

function App() {
  const classes = useStyles();

  const [home, setHome] = useState(true);
  const [json, setJson] = useState(false);
  const [xml, setXML] = useState(false);
  const [pvca, setPvca] = useState(false);
  const [scd, setScd] = useState(false);
  const [apix, setApix] = useState(false);
  const [about, setAbout] = useState(false);

  const goTo = (module) => {
    const states = {
      home: () => { setHome(true); setJson(false); setXML(false); setPvca(false); setScd(false); setApix(false); setAbout(false); },
      xml: () => { setHome(false); setJson(false); setXML(true); setPvca(false); setScd(false); setApix(false); setAbout(false); },
      json: () => { setHome(false); setJson(true); setXML(false); setPvca(false); setScd(false); setApix(false); setAbout(false); },
      pvca: () => { setHome(false); setJson(false); setXML(false); setPvca(true); setScd(false); setApix(false); setAbout(false); },
      scd: () => { setHome(false); setJson(false); setXML(false); setPvca(false); setScd(true); setApix(false); setAbout(false); },
      apix: () => { setHome(false); setJson(false); setXML(false); setPvca(false); setScd(false); setApix(true); setAbout(false); },
      about: () => { setHome(false); setJson(false); setXML(false); setPvca(false); setScd(false); setApix(false); setAbout(true); },
    };

    if (states[module]) states[module]();
  };

  const getHome = () => {
    if (!home) return null;

    const modules = [
      {
        key: 'json',
        label: 'Demonstrações Financeiras',
        tag: 'JSON / 90x1',
        description: 'Geração de BP, DRE, DFC, DRA e DMPL em estrutura padronizada para documentos do Bacen.',
        buttonClass: classes.moduleButtonJson,
      },
      {
        key: 'xml',
        label: 'SVR / ASVR 9800 e 9805',
        tag: 'XML',
        description: 'Transforme planilhas em XML dos documentos 9800 e 9805 com mapeamento e validação do fluxo de devoluções.',
        buttonClass: classes.moduleButtonXml,
      },
      {
        key: 'pvca',
        label: 'PVCA',
        tag: 'ZIP / TXT',
        description: 'Gera o pacote Padronizado de Pagamentos de Varejo e Canais de Atendimento em layout oficial.',
        buttonClass: classes.moduleButtonPvca,
      },
      {
        key: 'scd',
        label: 'Saldos Contábeis Diários',
        tag: '4111',
        description: 'Cria o XML do documento 4111 a partir de contas e saldos da planilha-base.',
        buttonClass: classes.moduleButtonScd,
      },
      {
        key: 'apix',
        label: 'APIX',
        tag: '1201',
        description: 'Prepara as abas de transações, bloqueios, receitas e tempos para o documento 1201.',
        buttonClass: classes.moduleButtonApix,
      },
    ];

    return (
      <div className={classes.menu}>
        <div className={classes.heroPanel}>
          <div className={classes.heroText}>
            <span className={classes.badge}>Sistema regulatório</span>
            <h1 className={classes.title}>Erebes</h1>
            <p className={classes.subtitle}>
              Automatiza a geração de arquivos do Banco Central com foco em demonstrativos financeiros,
              relatórios regulatórios e layouts em XML, JSON e TXT, integrando Excel e processos operacionais em um só ambiente.
            </p>
            <div className={classes.heroActions}>
              <Button className={classes.primaryAction} onClick={() => goTo('json')} variant="contained">
                Gerar demonstrações
              </Button>
              <Button className={classes.secondaryAction} onClick={() => goTo('about')} variant="outlined">
                Sobre o sistema
              </Button>
            </div>
          </div>
          <div className={classes.heroImageWrap}>
            <img className={classes.heroImage} src={LogoBacen} alt="Logo do Banco Central" />
          </div>
        </div>

        <div className={classes.modulesHeader}>
          <h2 className={classes.modulesTitle}>Módulos disponíveis</h2>
        </div>

        <Grid container spacing={3} className={classes.moduleGrid}>
          {modules.map((module) => (
            <Grid item xs={12} sm={6} lg={4} key={module.key}>
              <div className={classes.moduleCard}>
                <div>
                  <span className={classes.moduleTag} style={{ background: 'rgba(11,59,102,0.08)', color: '#0d2343' }}>
                    {module.tag}
                  </span>
                  <h3 className={classes.moduleTitle}>{module.label}</h3>
                  <p className={classes.moduleDescription}>{module.description}</p>
                </div>
                <Button
                  className={`${classes.moduleButton} ${module.buttonClass}`}
                  variant="contained"
                  onClick={() => goTo(module.key)}
                >
                  Acessar módulo
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  return (
    <div className="App">
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.brandWrap} onClick={() => goTo('home')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goTo('home'); }} style={{ cursor: 'pointer' }}>
              <img className={classes.brandLogo} src={LogoBacen} alt="Logo do Banco Central" />
              <span className={classes.brandText}>Erebes</span>
            </div>
            <div className={classes.navActions}>
              <Button className={classes.navButton} onClick={() => goTo('home')}>Página inicial</Button>
              <Button className={classes.navButton} onClick={() => goTo('about')}>Sobre o sistema</Button>
            </div>
          </Toolbar>
        </AppBar>
      </div>

      {about && (
        <div className={classes.aboutWrap}>
          <div className={classes.aboutCard}>
            <h1 className={classes.aboutTitle}>Sobre o Erebes</h1>
            <p className={classes.aboutText}>
              O Erebes foi criado para simplificar a transformação de dados financeiros em arquivos padronizados para o
              Banco Central do Brasil. A ferramenta centraliza o fluxo de geração de documentos e relatórios regulatórios,
              permitindo que planilhas em Excel sejam convertidas em estruturas finais em JSON, XML e TXT com consistência,
              rapidez e menor risco de erro operacional.
            </p>
            <p className={classes.aboutText} style={{ marginTop: 18 }}>
              O sistema foi pensado para atender necessidades recorrentes de instituições e equipes que lidam com layouts
              específicos do Bacen, apoiando a manutenção de prazos, organização dos dados e qualidade na entrega dos
              arquivos de envio.
            </p>

            <div className={classes.authorBlock}>
              <p className={classes.authorName}>Leandro Marques</p>
              <p className={classes.authorMeta}>
                Florianópolis - SC<br />
                <a className={classes.link} href="https://www.linkedin.com/in/leandromarques1992" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/leandromarques1992
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {getHome()}
      {json ? <BacenJSON /> : null}
      {xml ? <BacenXML /> : null}
      {pvca ? <BacenPvca /> : null}
      {scd ? <BacenScd /> : null}
      {apix ? <BacenApix /> : null}
    </div>
  );
}

export default App;