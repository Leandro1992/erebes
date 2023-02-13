'use strict';

const excelToJson = require('convert-excel-to-json');
const Util = require('../../util')
const Validators = require('../../validators/validator');

const convertSheetsToSxcel = (files) => {
    if (files && files.sheets && files.sheets.path) {
        return excelToJson({
            sourceFile: files.sheets.path,
            sheets: [
                {
                    name: 'CONGLOME',
                    columnToKey: {
                        A: 'ano',
                        B: 'trimestre',
                        C: 'nome',
                        D: 'ispb',
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

const generateFile = async (header, dados) => {
    return new Promise((resolve, reject) => {
        Util.tempFile('CONGLOME.TXT').then((path) => {
            console.log(path)
            dados.CONGLOME.forEach(element => {
                element.ano = element.ano.toString().trim();
                element.trimestre = element.trimestre.toString().trim();
                element.nome = Validators.calculeSpaces(element.nome, element.nome.length, 50, " ");
            });
            Util.writeFileTxt(path, header, 'CONGLOME', Util.calculeRegisters(dados.CONGLOME.length), dados.CONGLOME);
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
        generateFile(header, dados).then((data) => {
            resolve(data);
        }).catch((e) => {
            console.log("error", e)
            reject({ msg: "Ocorreu um erro ao processar o arquivo" });
        })
    });
}

exports.getConglome = getConglome;