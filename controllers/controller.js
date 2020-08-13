const BP = require('./bp.js');
const DRE = require('./dre.js');
const DFC = require('./dfc.js');
const DRA = require('./dra.js');
const DMPL = require('./dmpl.js');
const excelToJson = require('convert-excel-to-json');
const formidable = require('formidable');

exports.initControllers = (app) => {
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
                            E: 'Data2',
                        },
                        header: {
                            rows: 5
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
            BP.getBPJSON(sheets).then((data) => {
                let header = {
                    "@cnpj": fields.cnpj,
                    "@codigoDocumento": fields.doc,
                    "@tipoRemessa": fields.remessa,
                    "@unidadeMedida": fields.unidade,
                    "@dataBase": fields.database.split("-").reverse().join(""),
                    "datasBaseReferencia": [
                        {
                            "@id": "dt1",
                            "@data": fields.database1.split("-").reverse().join("")
                        },
                        {
                            "@id": "dt2",
                            "@data": fields.database2.split("-").reverse().join("")
                        }
                    ],
                    "BalancoPatrimonial": data,
                    "DemonstracaoDoResultado": {},
                    "DemonstracaoDoResultadoAbrangente": {},
                    "DemonstracaoDosFluxosDeCaixa": {},
                    "DemonstracaoDasMutacoesDoPatrimonioLiquido": {},
                    "DemonstracaoDosRecursosDeConsorcioConsolidada": {},
                    "DemonstracaoDeVariacoesNasDisponibilidadesDeGruposConsolidada": {}

                }

                if(fields && fields.database3){
                    header['datasBaseReferencia'].push( {
                        "@id": "dt3",
                        "@data": fields.database3.split("-").reverse().join("")
                    })
                    if(fields.database4){
                        header['datasBaseReferencia'].push( {
                            "@id": "dt4",
                            "@data": fields.database4.split("-").reverse().join("")
                        })
                    }
                }

                DRE.getDREJSON(sheets).then((data) => {
                    header["DemonstracaoDoResultado"] = data;
                    DFC.getDFCJSON(sheets).then((dfc) => {
                        header["DemonstracaoDosFluxosDeCaixa"] = dfc;
                        DRA.getDRAJSON(sheets).then((dra) => {
                            header["DemonstracaoDoResultadoAbrangente"] = dra;
                            DMPL.getDMPLJSON(sheets).then((dmpl) => {
                                header["DemonstracaoDasMutacoesDoPatrimonioLiquido"] = dmpl;
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
}