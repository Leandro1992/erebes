'use strict';

const excelToJson = require('convert-excel-to-json');
const util = require('../../util')

const convertSheetsToSxcel = (files) => {
    if (files && files.sheets && files.sheets.path) {
        return excelToJson({
            sourceFile: files.sheets.path,
            sheets: [
                {
                    name: 'CONGLOME',
                    columnToKey: {
                        A: 'data',
                        B: 'instituicao',
                    },
                    header: {
                        rows: 1
                    }
                }
            ]
        });
    } else {
        return false;
    }
}

const generateHeader = async (header) => {
    return new Promise((resolve, reject) => {
        util.tempFile('CONGLOME.TXT', JSON.stringify(header)).then((path) => {
            console.log(path)
            resolve(path)
        }).catch((e) => {
            reject(e);
            console.log("error", e)
        })
    });
};

const getConglome = async (sheets, header) => {
    return new Promise((resolve, reject) => {
        console.log("Calculando CONGLOME...");
        const dados = convertSheetsToSxcel(sheets);
        if (!dados) {
            reject({ msg: "Não reconhecido na planilha a aba CONGLOME" });
        }
        generateHeader(header).then((data) => {
            resolve(data);
        }).catch((e) => {
            console.log("error", e)
            reject({ msg: "Ocorreu um erro ao processar o arquivo" });
        })
    });
}

exports.getConglome = getConglome;