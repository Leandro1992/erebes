const BP = require('./bpfix.js');
const DRE = require('./dre.js');
const DFC = require('./dfc.js');
const DRA = require('./dra.js');
const DMPL = require('./dmpl.js');
const XML = require('./xml.js');
const CONGLOME = require('./pvca/conglome');
const USUREMOT = require('./pvca/usuremot.js');
const ESTATCRT = require('./pvca/estatcrt.js');
const ESTATATM = require('./pvca/estatatm.js');
const TRANSOPA = require('./pvca/transopa.js');
const OPEINTRA = require('./pvca/opeintra.js');
const CONTATOS = require('./pvca/contatos.js');
const DATABASE = require('./pvca/database.js');
const AdmZip = require('adm-zip');
const excelToJson = require('convert-excel-to-json');
const formidable = require('formidable');
const util = require('../util/index.js');

exports.initControllers = (app) => {
    app.post('/api/upload9800', (req, res, next) => {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err)
                next(err);
                return;
            }
            let sheets = {};
            if (files && files.sheets && files.sheets.path) {
                sheets = excelToJson({
                    sourceFile: files.sheets.path,
                    sheets: [
                        {
                            name: '9800',
                            columnToKey: {
                                A: 'BenCPF',
                                B: 'BenCNPJ',
                                C: 'ValorADevolver',
                                D: 'codOrigem',
                                E: 'InfAdicionais'
                            },
                            header: {
                                rows: 1
                            }
                        }
                    ]
                });
            }

            XML.GerarXML(sheets, fields, "9800").then((xml) => {
                res.send({ data: xml });
            })
        });
    });

    app.post('/api/upload9805', (req, res, next) => {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err)
                next(err);
                return;
            }
            let sheets = {};
            if (files && files.sheets && files.sheets.path) {
                sheets = excelToJson({
                    sourceFile: files.sheets.path,
                    sheets: [
                        {
                            name: '9805',
                            columnToKey: {
                                A: 'qtdCpfsBeneficiados',
                                B: 'valorDevolvido',
                                C: 'origem',
                                D: 'modalidadePagamento',
                            },
                            header: {
                                rows: 1
                            }
                        }
                    ]
                });
            }
            XML.GerarXML(sheets, fields, "9805").then((xml) => {
                res.send({ data: xml });
            })
        });
    });

    app.post('/api/upload', (req, res, next) => {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err)
                next(err);
                return;
            }
            const sheets = excelToJson({
                sourceFile: files.sheets.path,
                sheets: [
                    {
                        name: 'BP',
                        columnToKey: {
                            C: 'Ativo',
                            D: 'Data1Ativo',
                            E: 'Data2Ativo',
                            F: 'Passivo',
                            G: 'Data1Passivo',
                            H: 'Data2Passivo'
                        },
                        header: {
                            rows: 7
                        }
                    },
                    {
                        name: 'DRE',
                        columnToKey: {
                            B: 'item',
                            C: 'Data1',
                            D: 'Data2',
                        },
                        header: {
                            rows: 5
                        }
                    },
                    {
                        name: 'DFC',
                        columnToKey: {
                            B: 'item',
                            C: 'Data1',
                            D: 'Data2',
                        },
                        header: {
                            rows: 6
                        }
                    },
                    {
                        name: 'DRA',
                        columnToKey: {
                            B: 'item',
                            C: 'Data1',
                            D: 'Data2',
                        },
                        header: {
                            rows: 5
                        }
                    },
                    {
                        name: 'DMPL',
                        columnToKey: {
                            B: 'item',
                            C: 'Data1',
                            D: 'Data2',
                            E: 'Data3',
                            F: 'Data4',
                        },
                        header: {
                            rows: 5
                        }
                    }
                ]
            });
            BP.getBPJSON(sheets, fields).then((bp) => {
                let header = {
                    "@cnpj": fields.cnpj,
                    "@codigoDocumento": fields.doc,
                    "@tipoRemessa": fields.remessa,
                    "@unidadeMedida": parseInt(fields.unidade),
                    "@dataBase": fields.database,
                    "datasBaseReferencia": [
                        {
                            "@id": "dt1",
                            "@data": fields.database1
                        },
                        {
                            "@id": "dt2",
                            "@data": fields.database2
                        },
                        {
                            "@id": "dt3",
                            "@data": fields.database3
                        },
                        {
                            "@id": "dt4",
                            "@data": fields.database4
                        },
                        {
                            "@id": "bp1",
                            "@data": fields.bpdate1
                        },
                        {
                            "@id": "bp2",
                            "@data": fields.bpdate2
                        }
                    ],
                    "BalancoPatrimonial": bp,
                    "DemonstracaoDoResultado": {},
                    "DemonstracaoDoResultadoAbrangente": {},
                    "DemonstracaoDosFluxosDeCaixa": {},
                    "DemonstracaoDasMutacoesDoPatrimonioLiquido": {}

                }
                if (bp.contas.length == 0) {
                    header["BalancoPatrimonial"] = {}
                }
                // if(fields && fields.database3){
                //     header['datasBaseReferencia'].push( {
                //         "@id": "dt3",
                //         "@data": fields.database3
                //     })
                //     if(fields.database4){
                //         header['datasBaseReferencia'].push( {
                //             "@id": "dt4",
                //             "@data": fields.database4
                //         })
                //     }
                // }

                DRE.getDREJSON(sheets).then((data) => {
                    header["DemonstracaoDoResultado"] = data;
                    if (data.contas.length == 0) {
                        header["DemonstracaoDoResultado"] = {};
                    }
                    DFC.getDFCJSON(sheets).then((dfc) => {
                        header["DemonstracaoDosFluxosDeCaixa"] = dfc;
                        if (dfc.contas.length == 0) {
                            header["DemonstracaoDosFluxosDeCaixa"] = {};
                        }
                        DRA.getDRAJSON(sheets).then((dra) => {
                            header["DemonstracaoDoResultadoAbrangente"] = dra;
                            if (dra.contas.length == 0) {
                                header["DemonstracaoDoResultadoAbrangente"] = {};
                            }
                            DMPL.getDMPLJSON(sheets).then((dmpl) => {
                                header["DemonstracaoDasMutacoesDoPatrimonioLiquido"] = dmpl;
                                if (dmpl.contas.length == 0) {
                                    header["DemonstracaoDasMutacoesDoPatrimonioLiquido"] = {};
                                }
                                res.send(header);
                            });
                        });
                    });
                });
            }).catch(e => {
                console.log(e)
                res.send(e)
            });
        });
    });

    app.post('/api/upload/pvca', (req, res, next) => {
        const form = formidable({ multiples: true });
        const zip = new AdmZip();
        let errors = [];
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err)
                next(err);
                return;
            }

            try {
                let conglome = await CONGLOME.getConglome(files, fields);
                let usuremot = await USUREMOT.getUsuremot(files, fields);
                let estatcrt = await ESTATCRT.getEstatcrt(files, fields);
                let estatatm = await ESTATATM.getEstatatm(files, fields);
                let transopa = await TRANSOPA.getTransopa(files, fields);
                let opeintra = await OPEINTRA.getOpeintra(files, fields);
                let contatos = await CONTATOS.getContatos(files, fields);
                let database = await DATABASE.getDatabase(files, fields);
                
                zip.addLocalFile(conglome);
                zip.addLocalFile(usuremot);
                zip.addLocalFile(estatcrt);
                zip.addLocalFile(estatatm);
                zip.addLocalFile(transopa);
                zip.addLocalFile(opeintra);
                zip.addLocalFile(contatos);
                zip.addLocalFile(database);

                // zip.toBuffer();
                util.tempFile('BACEN.ZIP', zip.toBuffer()).then((path) => {
                    console.log(path)
                    res.download(path, 'BACEN.ZIP', (err) => {
                        if (err) {
                            // Handle error, but keep in mind the response may be partially-sent
                            // so check res.headersSent
                            console.log(err, "Erro ao gerar arquivo")
                        } else {
                            // decrement a download credit, etc.
                            console.log("arquivo enviado")
                        }
                    })
                }).catch((e) => {
                    console.log("error", e)
                })
            } catch (error) {
                console.log(error, "deu ruim josé");
                res.send({error})
            }
        })
    });
}