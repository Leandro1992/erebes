'use strict';

const util = require('../util')
global.idConta = 1;

//INICIALIZADOR ATIVO E PASSIVO
const contas = {
    '1': [
        {
            "@id": "1",
            "@nivel": "1.0",
            "@descricao": "Ativo",
            "@contaPai": ""
        }
    ],
    '2': [
        {
            "@id": null,
            "@nivel": "2.0",
            "@descricao": "Passivo e patrimônio líquido",
            "@contaPai": "",
        }
    ],
};

//VERIFICA E GERA OS NÍVEIS, ATÉ 4 CAMANDAS EX: 1.0.0.0.0
const checkLastTreeLevel = async (whitespaces, type) => {
    switch (whitespaces) {
        case 0:
            if (type == 1) {
                let lastlevel = null;
                for (let i of contas['1']) {
                    if (i['@nivel'].split(".").length == 2) lastlevel = i;
                }
                return lastlevel;
            } else {
                if (!contas['2'][contas['2'].length - 1]['@id']) {
                    global.idConta++;
                    contas['2'][contas['2'].length - 1]['@id'] = global.idConta + "";
                }
                let lastlevel = null;
                for (let i of contas['2']) {
                    if (i['@nivel'].split(".").length == 2) lastlevel = i;
                }
                return lastlevel;
            }
        case 1:
            if (type == 1) {
                let lastlevel = null;
                for (let i of contas['1']) {
                    if (i['@nivel'].split(".").length == 3) {
                        if ((+contas['1'][contas['1'].length - 1]['@nivel'][2]) > +(i['@nivel'][2])) {
                            lastlevel = {
                                "@id": global.idConta,
                                "@nivel": contas['1'][contas['1'].length - 1]['@nivel'] + ".0",
                                "@descricao": "New",
                            };
                        } else {
                            lastlevel = i;
                        }
                    }
                }
                if (!lastlevel) {
                    return {
                        "@id": global.idConta,
                        "@nivel": contas['1'][contas['1'].length - 1]['@nivel'] + ".0",
                        "@descricao": "New",
                    };
                } else {
                    return lastlevel;
                }
            } else {
                let lastlevel = null;
                for (let i of contas['2']) {
                    if (i['@nivel'].split(".").length == 3) {
                        if ((+contas['2'][contas['2'].length - 1]['@nivel'][2]) > +(i['@nivel'][2])) {
                            lastlevel = {
                                "@id": global.idConta,
                                "@nivel": contas['2'][contas['2'].length - 1]['@nivel'] + ".0",
                                "@descricao": "New",
                            };
                        } else {
                            lastlevel = i;
                        }
                    }
                }
                if (!lastlevel) {
                    return {
                        "@id": global.idConta,
                        "@nivel": contas['2'][contas['2'].length - 1]['@nivel'] + ".0",
                        "@descricao": "New",
                    };
                } else {
                    return lastlevel;
                }
            }
        case 2:
            if (type == 1) {
                let lastlevel = null;
                for (let i of contas['1']) {
                    if (i['@nivel'].split(".").length == 4) {
                        if ((+contas['1'][contas['1'].length - 1]['@nivel'][4]) > +(i['@nivel'][4]) || (+contas['1'][contas['1'].length - 1]['@nivel'][2]) > +(i['@nivel'][2])) {
                            lastlevel = {
                                "@id": global.idConta,
                                "@nivel": contas['1'][contas['1'].length - 1]['@nivel'] + ".0",
                                "@descricao": "New",
                            };
                        } else {
                            lastlevel = i;
                        }
                    };
                }
                if (!lastlevel) {
                    return {
                        "@id": global.idConta,
                        "@nivel": contas['1'][contas['1'].length - 1]['@nivel'] + ".0",
                        "@descricao": "New",
                    };
                } else {
                    return lastlevel;
                }
            } else {
                let lastlevel = null;
                for (let i of contas['2']) {
                    if (i['@nivel'].split(".").length == 4) {
                        if ((+contas['2'][contas['2'].length - 1]['@nivel'][4]) > +(i['@nivel'][4]) || (+contas['2'][contas['2'].length - 1]['@nivel'][2]) > +(i['@nivel'][2])) {
                            lastlevel = {
                                "@id": global.idConta,
                                "@nivel": contas['2'][contas['2'].length - 1]['@nivel'] + ".0",
                                "@descricao": "New",
                            };
                        } else {
                            lastlevel = i;
                        }
                    };
                }
                if (!lastlevel) {
                    return {
                        "@id": global.idConta,
                        "@nivel": contas['2'][contas['2'].length - 1]['@nivel'] + ".0",
                        "@descricao": "New",
                    };
                } else {
                    return lastlevel;
                }
            }
        case 3:
            if (type == 1) {
                let lastlevel = null;
                for (let i of contas['1']) {
                    if (i['@nivel'].split(".").length == 5) {
                        if ((+contas['1'][contas['1'].length - 1]['@nivel'][6]) > +(i['@nivel'][6]) || (+contas['1'][contas['1'].length - 1]['@nivel'][4]) > +(i['@nivel'][4]) || (+contas['1'][contas['1'].length - 1]['@nivel'][2]) > +(i['@nivel'][2])) {
                            lastlevel = {
                                "@id": global.idConta,
                                "@nivel": contas['1'][contas['1'].length - 1]['@nivel'] + ".0",
                                "@descricao": "New",
                            };
                        } else {
                            lastlevel = i;
                        }
                    };
                }
                if (!lastlevel) {
                    return {
                        "@id": global.idConta,
                        "@nivel": contas['1'][contas['1'].length - 1]['@nivel'] + ".0",
                        "@descricao": "New",
                    };
                } else {
                    return lastlevel;
                }
            } else {
                let lastlevel = null;
                for (let i of contas['2']) {
                    if (i['@nivel'].split(".").length == 5) {
                        if ((+contas['2'][contas['2'].length - 1]['@nivel'][6]) > +(i['@nivel'][6]) || (+contas['2'][contas['2'].length - 1]['@nivel'][4]) > +(i['@nivel'][4]) || (+contas['2'][contas['2'].length - 1]['@nivel'][2]) > +(i['@nivel'][2])) {
                            lastlevel = {
                                "@id": global.idConta,
                                "@nivel": contas['2'][contas['2'].length - 1]['@nivel'] + ".0",
                                "@descricao": "New",
                            };
                        } else {
                            lastlevel = i;
                        }
                    };
                }
                if (!lastlevel) {
                    return {
                        "@id": global.idConta,
                        "@nivel": contas['2'][contas['2'].length - 1]['@nivel'] + ".0",
                        "@descricao": "New",
                    };
                } else {
                    return lastlevel;
                }
            }
        default:
            global.messages.push("Erro na quantidade de níveis do arquivo! mais de 4 níveis")
    }
}

//APOS VERIFICAR O PRÓXIMO NÍVEL ATUALIZA O VALOR DO NÍVEL E A REFERENCIA DE ID GLOBAL
const calcNewLevel = async (whitespaces, type, item) => {

    let checkLastTree = await checkLastTreeLevel(whitespaces, type)
    if (checkLastTree) {
        let nivel = checkLastTree['@nivel'];
        global.idConta++;
        let nextId = (global.idConta) + "";
        let contaPai = (checkLastTree['@contaPai'] ? checkLastTree['@contaPai'] : checkLastTree['@id']) + "";
        let split = nivel.split(".");
        split[split.length - 1] = ((+split[split.length - 1]) + 1) + "";
        nivel = split.join(".");

        if (type == 1) {
            contas['1'].push(
                {
                    "@id": nextId,
                    "@nivel": nivel,
                    "@descricao": item.item,
                    "@contaPai": contaPai,
                    "valoresIndividualizados": [
                        {
                            "@dtBase": "dt1",
                            "@valor": item.valueD1
                        },
                        {
                            "@dtBase": "dt2",
                            "@valor": item.valueD2
                        }
                    ]
                }
            )
        } else {
            contas['2'].push(
                {
                    "@id": nextId,
                    "@nivel": nivel,
                    "@descricao": item.item,
                    "@contaPai": contaPai,
                    "valoresIndividualizados": [
                        {
                            "@dtBase": "dt1",
                            "@valor": item.valueD1
                        },
                        {
                            "@dtBase": "dt2",
                            "@valor": item.valueD2
                        }
                    ]
                }
            )
        }

        return {
            nivel,
            nextId,
            contaPai
        };
    } else {
        global.messages.push("Níveis incopatíveis, verifique o espaçamento da tabela")
    }
}

//ORGANIZA AS CHAMADAS DOS ATIVOS ANTES DOS PASSIVOS E FAZ A JUNÇÃO DOS DADOS DAS CONTAS
const nivelGerenate = async (data) => {
    if (data.ativo.items.length) {
        for (let e of data.ativo.items) {
            await calcNewLevel(e.level, 1, e)
        }
        if (data.passivo.items.length) {
            for (let p of data.passivo.items) {
                await calcNewLevel(p.level, 2, p)
            }
        }

        let allItems = contas['1'].concat(contas['2'])
        
        //RESULTADO FINAL!
        // console.log(JSON.stringify(allItems, null, 4));
        return allItems;
    }
};

//START, RECEBE A PLANILHA E CHAMA OS SERVIÇOS PARA TRATAMENTO
const getBPJSON = async (sheets) => {
    return new Promise((resolve, reject) => {
        const data = {
            ativo: {
                data1: null,
                data2: null,
                items: []
            },
            passivo: {
                data1: null,
                data2: null,
                items: []
            }
        }
        if (sheets.BP && sheets.BP.length) {
            sheets.BP.forEach(async (el, i, buff) => {
                if (i == 0) {
                    data.ativo.data1 = el.Data1Ativo;
                    data.ativo.data2 = el.Data2Ativo;
                    data.passivo.data1 = el.Data1Passivo;
                    data.passivo.data2 = el.Data2Passivo;
                } else {
                    if (el.Ativo && (el.Data1Ativo >= 0 || el.Data1Ativo) && (el.Data2Ativo >= 0 || el.Data2Ativo) && el.Ativo.indexOf("Total") == -1 && el.Ativo.indexOf("TOTAL") == -1) {
                        data.ativo.items.push({
                            item: el.Ativo,
                            valueD1: el.Data1Ativo,
                            valueD2: el.Data2Ativo,
                            level: util.calculeInitialWhiteSpaces(el.Ativo)
                        })
                    }
                    if (el.Passivo && (el.Data1Passivo >= 0 || el.Data1Passivo) && (el.Data2Passivo >= 0 || el.Data2Passivo) && el.Passivo.indexOf("Total") == -1 && el.Passivo.indexOf("TOTAL") == -1) {
                        data.passivo.items.push({
                            item: el.Passivo,
                            valueD1: el.Data1Passivo,
                            valueD2: el.Data2Passivo,
                            level: util.calculeInitialWhiteSpaces(el.Passivo)
                        })
                    }
                }
    
                if (i == buff.length - 1) {
                   let info = await nivelGerenate(data);
                    let result = {'contas': info}
                   resolve(result);
                }
            })
        }else{
            resolve({contas: []});
        }
    })
};

exports.getBPJSON = getBPJSON;

