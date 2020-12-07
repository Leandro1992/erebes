'use strict';

const util = require('../util')
let id = 0;
let referenceNivel = null;
let levels = {}


const checkLevel = (last, lastnivel, level) => {
    return new Promise((resolve, reject) => {
        let splitLast = last.nivel.split(".");
        let splitLastnivel = lastnivel.nivel.split(".");
        let result = lastnivel;

        for (let x = 0; x < level; x++) {
            if (+(splitLast[x]) > +(splitLastnivel[x])) {
                result = last;
            }
        }

        resolve(result)
    })
}


const calcLevelAndFather = (lastnivel, level) => {
    return new Promise(async (resolve, reject) => {
        if (!lastnivel) {
            levels[level] = [];
            id += 1;
            levels[level].push({ nivel: "1", id, father: "", level })
            referenceNivel = { nivel: "1", id, father: "", level };
            resolve(referenceNivel)
        } else {
            if (!levels[level] || (lastnivel.level != level && level > lastnivel.level)) {
                levels[level] = []
                let nivel = lastnivel.nivel + ".1"
                id += 1;
                let father = lastnivel.id
                levels[level].push({ nivel, id, father })
                referenceNivel = { nivel, id, father, level };
                resolve(referenceNivel)
            } else {
                let lastLevelNivel = levels[level][levels[level].length - 1];
                let split = lastLevelNivel.nivel.split(".");
                if (level == 0) {
                    split[split.length - 1] = ((+split[split.length - 1]) + 1) + "";
                    let nivel = split.join(".");
                    let father = ""
                    id += 1;
                    levels[level].push({ nivel, id, father })
                    referenceNivel = { nivel, id, father, level };
                    resolve(referenceNivel)
                } else {
                    let lastValidLevel = await checkLevel(referenceNivel, lastLevelNivel, level)
                    let split1 = lastValidLevel.nivel.split(".");
                    if (split1.length == 1) {
                        split1.push(".0");
                    }
                    split1[split1.length - 1] = ((+split1[split1.length - 1]) + 1) + "";
                    let nivel1 = split1.join(".");
                    let father = lastValidLevel.father ? lastValidLevel.father : lastValidLevel.id
                    id += 1;
                    levels[level].push({ nivel: nivel1, id, father })
                    referenceNivel = { nivel: nivel1, id, father, level };
                    resolve(referenceNivel)

                }
            }
        }
    })
}

//INICIALIZADOR ATIVO E PASSIVO
const contas = {
    'contas': [

    ],
};

//START, RECEBE A PLANILHA E CHAMA OS SERVIÇOS PARA TRATAMENTO
const getBPJSON = async (sheets) => {
    return new Promise(async (resolve, reject) => {
        if (!sheets.BP) resolve({contas: []});
        console.log("Calculando BP...");
        // C: 'Ativo',
        // D: 'Data1Ativo',
        // E: 'Data2Ativo',
        // F: 'Passivo',
        // G: 'Data1Passivo',
        // H: 'Data2Passivo'
        let filtered = [];
        let result = [];
        for (const i of sheets.BP) {
            if (i.Ativo && (i.Data1Ativo || i.Data1Ativo == 0) && (i.Data2Ativo || i.Data2Ativo == 0)) {
                i.level = util.calculeInitialWhiteSpaces(i.Ativo);
                filtered.push(i);
            }
        }

        if (filtered.length > 0) {
            for (const x of filtered) {
                let nextLevel = await calcLevelAndFather(referenceNivel, x.level)
                result.push({
                    "@id": nextLevel.id + "",
                    "@nivel": nextLevel.nivel + "",
                    "@descricao": x.Ativo.trim(),
                    "@contaPai": nextLevel.father + "",
                    "valoresIndividualizados": [
                        {
                            "@dtBase": "bp1",
                            "@valor": x.Data1Ativo
                        },
                        {
                            "@dtBase": "bp2",
                            "@valor": x.Data2Ativo
                        }
                    ]
                })
            }
        }
        contas.contas = result
        // console.log(contas);
        resolve(contas)
    });
};

exports.getBPJSON = getBPJSON;