'use strict';

const util = require('../util')

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

//START, RECEBE A PLANILHA E CHAMA OS SERVIÇOS PARA TRATAMENTO
const getDMPLJSON = async (sheets) => {
    return new Promise((resolve, reject) => {
        console.log(sheets)
    })
};

exports.getDMPLJSON = getDMPLJSON;
