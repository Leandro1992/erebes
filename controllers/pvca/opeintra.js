
const excelToJson = require('convert-excel-to-json');
const Util = require('../../util')
const Validators = require('../../validators/validator');

const convertSheetsToSxcel = (files) => {
    if (files && files.sheets && files.sheets.path) {
        return excelToJson({
            sourceFile: files.sheets.path,
            sheets: [
                {
                    name: 'OPEINTRA',
                    columnToKey: {
                        A: 'ano',
                        B: 'trimestre',
                        C: 'operacao',
                        D: 'qtd_transa',
                        E: 'valor',
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
        Util.tempFile('OPEINTRA.TXT').then((path) => {
            console.log(path)
            dados.OPEINTRA.forEach(element => {
                element.ano = element.ano.toString().trim();
                element.trimestre = element.trimestre.toString().trim();
                element.operacao = Validators.fullFillWithZeros(element.operacao ? +element.operacao : 0, 2);
                element.qtd_transa = Validators.fullFillWithZeros(element.qtd_transa ? +element.qtd_transa : 0, 12);
                element.valor = Validators.fullFillWithZeros(element.valor ? +element.valor : 0, 15);
            });
            Util.writeFileTxt(path, header, 'OPEINTRA', Util.calculeRegisters(dados.OPEINTRA.length), dados.OPEINTRA);
            resolve(path)
        }).catch((e) => {
            reject(e);
            console.log("error", e)
        })
    });
};

const getOpeintra = async (sheets, header) => {
    return new Promise((resolve, reject) => {
        console.log("Calculando OPEINTRA...");
        const dados = convertSheetsToSxcel(sheets);
        if (!dados) {
            reject({ msg: "Não reconhecido na planilha a aba OPEINTRA" });
        }
        generateFile(header, dados).then((data) => {
            resolve(data);
        }).catch((e) => {
            console.log("error", e)
            reject({ msg: "Ocorreu um erro ao processar o arquivo OPEINTRA" });
        })
    });
}

exports.getOpeintra = getOpeintra;

