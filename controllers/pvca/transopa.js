const excelToJson = require('convert-excel-to-json');
const Util = require('../../util')
const Validators = require('../../validators/validator');

const convertSheetsToSxcel = (files) => {
    if (files && files.sheets && files.sheets.path) {
        return excelToJson({
            sourceFile: files.sheets.path,
            sheets: [
                {
                    name: 'TRANSOPA',
                    columnToKey: {
                        A: 'ano',
                        B: 'trimestre',
                        C: 'canal_acesso',
                        D: 'produto',
                        E: 'acesso_atm',
                        F: 'qtd_transa',
                        G: 'valor',
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
        Util.tempFile('TRANSOPA.TXT').then((path) => {
            console.log(path)
            dados.TRANSOPA.forEach(element => {
                element.ano = element.ano.toString().trim();
                element.trimestre = element.trimestre.toString().trim();
                element.canal_acesso = Validators.fullFillWithZeros(element.canal_acesso ? +element.canal_acesso : 0, 2);
                element.produto = Validators.fullFillWithZeros(element.produto ? +element.produto : 0, 2);
                element.acesso_atm = Validators.fullFillWithZeros(element.acesso_atm ? +element.acesso_atm : 0, 2);
                element.qtd_transa = Validators.fullFillWithZeros(element.qtd_transa ? +element.qtd_transa : 0, 12);
                element.valor = Validators.fullFillWithZeros(element.valor ? +element.valor : 0, 15);
            });
            Util.writeFileTxt(path, header, 'TRANSOPA', Util.calculeRegisters(dados.TRANSOPA.length), dados.TRANSOPA);
            resolve(path)
        }).catch((e) => {
            reject(e);
            console.log("error", e)
        })
    });
};

const getTransopa = async (sheets, header) => {
    return new Promise((resolve, reject) => {
        console.log("Calculando TRANSOPA...");
        const dados = convertSheetsToSxcel(sheets);
        if (!dados) {
            reject({ msg: "Não reconhecido na planilha a aba TRANSOPA" });
        }
        generateFile(header, dados).then((data) => {
            resolve(data);
        }).catch((e) => {
            console.log("error", e)
            reject({ msg: "Ocorreu um erro ao processar o arquivo TRANSOPA" });
        })
    });
}

exports.getTransopa = getTransopa;
