'use strict';

const util = require('../util')
const js2xmlparser = require("js2xmlparser");

let jsonBase9800 = {
    codDoc: "9800",
    tipoEnvio: null,
    dataBase: null,
    cnpjIf: null,
    valor: []
}

let jsonBase9805 = {
    codDoc: "9805",
    tipoEnvio: null,
    dataBase: null,
    cnpjIf: null,
    valor: []
}

//START, RECEBE A PLANILHA E CHAMA OS SERVIÇOS PARA TRATAMENTO
const GerarXML = async (sheets, fields, tipo) => {
    return new Promise(async (resolve, reject) => {

        if (tipo == "1201") {
            let finalxml = {
                "@": {
                    DtArquivo: fields.database,
                    Ano: fields.ano,
                    Mes: fields.mes,
                    ISPB: fields.instituicao,
                    NomeResp: fields.nome,
                    EmailResp: fields.email,
                    TelResp: fields.telefone,
                    TipoEnvio: fields.remessa,
                },
                Transacoes: {
                    Transacao:[]
                },
                Devolucoes: {
                    "@": {
                        QtdDevolucoes: 0,
                        ValorDevolucoes:0
                    }
                },
                BloqueiosCautelares: {
                    BloqueioCautelar: []
                },
                Receitas: {
                    Receita :[]
                },
                TemposTransacoes: {
                    "@": {
                        Perc50TempoExpUsuarioLiqSPI: 0,
                        Perc99TempoExpUsuarioLiqSPI:0,
                        Perc50TempoExpUsuarioLiqForaSPI: 0,
                        Perc99TempoExpUsuarioLiqForaSPI:0,
                        TempoMaxBloqueioCautelar: 0
                    }
                },
                TemposDict: {
                    "@": {
                        Perc99TempoUsuarioConsulta: 0,
                        PercTempoEnvioRegistro:0,
                        PercTempoExpUsuarioRegistro: 0,
                        PercTempoExpUsuarioExclusao:0,
                        PercTempoNotificacaoPortabilidade: 0,
                        PercTempoEnvioPortabilidade: 0
                    }
                },
                ConsultasDict: {
                    "@": {
                        QtdConsultas: 0,
                    }
                },
                Disponibilidade: {
                    "@": {
                        IndiceDisponibilidade: 0,
                    }
                }
                
            };
            for (const i of sheets.Transacoes) {
                if (!i.processar || i.processar != 'N') {
                    finalxml.Transacoes.Transacao.push(
                        {
                            QtdTransacoes: i.QtdTransacoes,
                            ValorTransacoes: i.ValorTransacoes,
                            ValorEspecie: i.ValorEspecie,
                            DetalhamentoTransacoes: i.DetalhamentoTransacoes,
                            FinalidadeTransacoes: i.FinalidadeTransacoes
                        }
                    )
                }
            }

            for (const i of sheets.Devolucoes) {
                if (!i.processar || i.processar != 'N') {
                    finalxml.Devolucoes["@"].QtdDevolucoes = i.QtdDevolucoes
                    finalxml.Devolucoes["@"].ValorDevolucoes = i.ValorDevolucoes
                }
            }

            for (const i of sheets["Bloqueios Cautelares"]) {
                if (!i.processar || i.processar != 'N') {
                    finalxml.BloqueiosCautelares.BloqueioCautelar.push(
                        {
                            QtdeBloqCaut: i.QtdeBloqCaut,
                            ValorBloqCaut: i.ValorBloqCaut,
                            DetalhamentoTransacoesBloqCaut: i.DetalhamentoTransacoesBloqCaut,
                        }
                    )
                }
            }

            for (const i of sheets.Receitas) {
                if (!i.processar || i.processar != 'N') {
                    finalxml.Receitas.Receita.push(
                        {
                            ValorReceita: i.ValorReceita,
                            FonteReceita: i.FonteReceita,
                        }
                    )
                }
            }
            console.log("Temmm", sheets["Tempos Consultas"])
            // TemposTransacoes
            finalxml.TemposTransacoes["@"].Perc50TempoExpUsuarioLiqSPI = sheets["Tempos Consultas"][0].Valores
            finalxml.TemposTransacoes["@"].Perc99TempoExpUsuarioLiqSPI = sheets["Tempos Consultas"][1].Valores
            finalxml.TemposTransacoes["@"].Perc50TempoExpUsuarioLiqForaSPI = sheets["Tempos Consultas"][2].Valores
            finalxml.TemposTransacoes["@"].Perc99TempoExpUsuarioLiqForaSPI = sheets["Tempos Consultas"][3].Valores
            finalxml.TemposTransacoes["@"].TempoMaxBloqueioCautelar = sheets["Tempos Consultas"][4].Valores

            // TemposDict
            finalxml.TemposDict["@"].Perc99TempoUsuarioConsulta = sheets["Tempos Consultas"][5].Valores
            finalxml.TemposDict["@"].PercTempoEnvioRegistro = sheets["Tempos Consultas"][6].Valores
            finalxml.TemposDict["@"].PercTempoExpUsuarioRegistro = sheets["Tempos Consultas"][7].Valores
            finalxml.TemposDict["@"].PercTempoExpUsuarioExclusao = sheets["Tempos Consultas"][8].Valores
            finalxml.TemposDict["@"].PercTempoNotificacaoPortabilidade = sheets["Tempos Consultas"][9].Valores
            finalxml.TemposDict["@"].PercTempoEnvioPortabilidade = sheets["Tempos Consultas"][10].Valores

             // ConsultasDict
             finalxml.ConsultasDict["@"].QtdConsultas = sheets["Tempos Consultas"][11].Valores

             // Disponibilidade
             finalxml.Disponibilidade["@"].IndiceDisponibilidade = sheets["Tempos Consultas"][12].Valores

            resolve(js2xmlparser.parse("APIX001", finalxml, { declaration: { encoding: "UTF-8" } }));
        }
       
        if (tipo == "4111") {
            let finalxml = {
                "@": {
                    codigoDocumento: "4111",
                    cnpj: fields.instituicao,
                    dataBase: fields.database,
                    tipoRemessa: fields.remessa,
                },
                contas: {
                    conta:[]
                }
            };
            for (const i of sheets[fields.instituicao]) {
                if (!i.processar || i.processar != 'N') {
                    finalxml.contas.conta.push({
                        '@': {
                            codigoConta: i.conta,
                            saldoDia: i.saldo
                        }
                    })
                }
            }
            resolve(js2xmlparser.parse("documento", finalxml, { declaration: { encoding: "UTF-8" } }));
        }

        if (tipo == "9800") {
            let xmlTemp = JSON.parse(JSON.stringify(jsonBase9800));
            xmlTemp.tipoEnvio = fields.tipoEnvio;
            xmlTemp.dataBase = fields.database;
            xmlTemp.cnpjIf = fields.cnpj;
            if (!sheets['9800']) {
                delete xmlTemp['valor'];
                xmlTemp.semValores = "";
                resolve(js2xmlparser.parse("asvr9800", xmlTemp, { declaration: { encoding: "UTF-8" } }));
            } else {
                console.log("Gerando XML 9800...");
                let count = 1;
                for (const i of sheets['9800']) {
                    let cpfs = i.BenCPF ? i.BenCPF.replace(/\s+/g, '').split(",") : [];
                    let cnpjs = i.BenCNPJ ? i.BenCNPJ.replace(/\s+/g, '').split(",") : [];
                    let arrayCpfCnpj = [];
                    if (cpfs.length > 0) {
                        arrayCpfCnpj.push({ cpf: cpfs });
                    }
                    if (cnpjs.length > 0) {
                        arrayCpfCnpj.push({ cnpj: cnpjs });
                    }
                    let valor = {
                        id: count,
                        beneficiarios: arrayCpfCnpj,
                        valorADevolver: i.ValorADevolver,
                        codOrigem: i.codOrigem,
                        infAdicionais: i.InfAdicionais
                    }
                    xmlTemp.valor.push(valor);
                    count++;
                }
                resolve(js2xmlparser.parse("asvr9800", xmlTemp, { declaration: { encoding: "UTF-8" } }));
            }
        }

        if (tipo == "9805") {
            let xmlTemp = JSON.parse(JSON.stringify(jsonBase9805));
            if (!sheets['9805']) {
                delete xmlTemp['valor'];
                xmlTemp.semValores = "";
                resolve(js2xmlparser.parse("asvr9805", xmlTemp, { declaration: { encoding: "UTF-8" } }));
            } else {
                console.log("Gerando XML 9805...");
                for (const i of sheets['9805']) {
                    let valor = {
                        origem: i.origem,
                        modalidadePagamento: i.modalidadePagamento,
                        valorDevolvido: i.valorDevolvido,
                        qtdCpfsBeneficiados: i.qtdCpfsBeneficiados
                    }
                    xmlTemp.valor.push(valor);
                }
                xmlTemp.tipoEnvio = fields.tipoEnvio;
                xmlTemp.dataBase = fields.database;
                xmlTemp.cnpjIf = fields.cnpj;
                resolve(js2xmlparser.parse("asvr9805", xmlTemp, { declaration: { encoding: "UTF-8" } }));
            }
        }
    });
};

exports.GerarXML = GerarXML;
