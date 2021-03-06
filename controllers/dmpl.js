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
const getDMPLJSON = async (sheets) => {
    return new Promise(async (resolve, reject) => {
        if (!sheets.DMPL) resolve({ contas: [] });
        id = 0;
        referenceNivel = null;
        levels = {}
        console.log("Calculando DMPL...");
        let filtered = [];
        let result = [];
        for (const i of sheets.DMPL) {
            // console.log(i.item, i.Data1, i.Data2, i.Data3, i.Data4, "valores")
            if (i.item && (i.Data1 || i.Data1 == 0) || (i.Data2 || i.Data2 == 0) || (i.Data3 || i.Data3 == 0) || (i.Data4 || i.Data4 == 0)) {
                if (i.item) {
                    i.level = util.calculeInitialWhiteSpaces(i.item);
                    filtered.push(i);
                }
            }
        }


        if (filtered.length > 0) {
            for (const x of filtered) {
                let nextLevel = await calcLevelAndFather(referenceNivel, x.level)
                let obj = {
                    "@id": nextLevel.id + "",
                    "@nivel": nextLevel.nivel + "",
                    "@descricao": x.item.trim(),
                    "@contaPai": nextLevel.father + "",
                    "valoresIndividualizados": []
                }
                if (x.Data1) {
                    obj["valoresIndividualizados"].push({
                        "@dtBase": "dt1",
                        "@valor": x.Data1
                    })
                }
                if (x.Data2) {
                    obj["valoresIndividualizados"].push({
                        "@dtBase": "dt2",
                        "@valor": x.Data2
                    })
                }
                if (x.Data3) {
                    obj["valoresIndividualizados"].push({
                        "@dtBase": "dt3",
                        "@valor": x.Data3
                    })
                }
                if (x.Data4) {
                    obj["valoresIndividualizados"].push({
                        "@dtBase": "dt4",
                        "@valor": x.Data4
                    })
                }
                result.push(obj)
            }
        }
        contas.contas = result
        // console.log(contas);
        resolve(contas)
    });
};

exports.getDMPLJSON = getDMPLJSON;
