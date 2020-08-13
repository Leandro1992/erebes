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
            levels[level].push({ nivel: "1", id, father: null })
            referenceNivel = { nivel: "1", id, father: null };
            resolve(referenceNivel)
        } else {
            if (!levels[level]) {
                levels[level] = []
                let nivel = lastnivel.nivel + ".1"
                id += 1;
                let father = lastnivel.id
                levels[level].push({ nivel, id, father })
                referenceNivel = { nivel, id, father };
                resolve(referenceNivel)
            } else {
                let lastLevelNivel = levels[level][levels[level].length - 1];
                let split = lastLevelNivel.nivel.split(".");
                if (level == 0) {
                    split[split.length - 1] = ((+split[split.length - 1]) + 1) + "";
                    let nivel = split.join(".");
                    let father = null
                    id += 1;
                    levels[level].push({ nivel, id, father })
                    referenceNivel = { nivel, id, father };
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
                    referenceNivel = { nivel: nivel1, id, father };
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
const getDFCJSON = async (sheets) => {
    return new Promise(async (resolve, reject) => {
        if (!sheets.DFC) resolve({});
        console.log("Calculando DFC...");
        let filtered = [];
        let result = [];
        for (const i of sheets.DFC) {
            if (i.item && (i.Data1 || i.Data1 == 0) && (i.Data2 || i.Data2 == 0)) {
                i.level = util.calculeInitialWhiteSpaces(i.item);
                filtered.push(i);
            }
        }

        if (filtered.length > 0) {
            for (const x of filtered) {
                let nextLevel = await calcLevelAndFather(referenceNivel, x.level)
                result.push({
                    "@id": nextLevel.id,
                    "@nivel": nextLevel.nivel,
                    "@descricao": x.item.trim(),
                    "@contaPai": nextLevel.father,
                    "valoresIndividualizados": [
                        {
                            "@dtBase": "dt1",
                            "@valor": x.Data1
                        },
                        {
                            "@dtBase": "dt2",
                            "@valor": x.Data2
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

exports.getDFCJSON = getDFCJSON;
