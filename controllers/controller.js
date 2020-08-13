const BP = require('./bp.js');
const DRE = require('./dre.js');
const DFC = require('./dfc.js');
const DRA = require('./dfc.js');
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
                DRE.getDREJSON(sheets).then((data) => {
                    header["DemonstracaoDoResultado"] = data;
                    DFC.getDFCJSON(sheets).then((dfc) => {
                        header["DemonstracaoDosFluxosDeCaixa"] = dfc;
                        DRA.getDRAJSON(sheets).then((dra) => {
                            header["DemonstracaoDoResultadoAbrangente"] = dra;
                            res.send(header);
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