const excelToJson = require('convert-excel-to-json');
const Util = require('../../util')
const Validators = require('../../validators/validator');

const convertSheetsToSxcel = (files) => {
    if (files && files.sheets && files.sheets.path) {
        return excelToJson({
            sourceFile: files.sheets.path,
            sheets: [
                {
                    name: 'ESTATATM',
                    columnToKey: {
                        A: 'ano',
                        B: 'trimestre',
                        C: 'fun_terminal',
                        D: 'localizacao',
                        E: 'tipo_compart',
                        F: 'uf',
                        G: 'qtd_atm',
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
        Util.tempFile('ESTATATM.TXT').then((path) => {
            console.log(path)
            dados.ESTATATM.forEach((element, idx, arr) => {
                arr[idx] = {
                    ano: element.ano.toString().trim(),
                    trimestre: element.trimestre.toString().trim(),
                    fun_terminal: Validators.fullFillWithZeros(element.fun_terminal ? +element.fun_terminal : 0, 2),
                    localizacao: Validators.fullFillWithZeros(element.localizacao ? +element.localizacao : 0, 2),
                    tipo_compart: Validators.fullFillWithZeros(element.tipo_compart ? +element.tipo_compart : 0, 2),
                    uf: element.uf.trim(),
                    qtd_atm: Validators.fullFillWithZeros(element.qtd_atm ? +element.qtd_atm : 0, 9)
                }
            });
            Util.writeFileTxt(path, header, 'ESTATATM', Util.calculeRegisters(dados.ESTATATM.length), dados.ESTATATM);
            resolve(path)
        }).catch((e) => {
            reject(e);
            console.log("error", e)
        })
    });
};

const getEstatatm = async (sheets, header) => {
    return new Promise((resolve, reject) => {
        console.log("Calculando ESTATATM...");
        const dados = convertSheetsToSxcel(sheets);
        if (!dados) {
            reject({ msg: "Não reconhecido na planilha a aba ESTATATM" });
        }
        generateFile(header, dados).then((data) => {
            resolve(data);
        }).catch((e) => {
            console.log("error", e)
            reject({ msg: "Ocorreu um erro ao processar o arquivo ESTATATM" });
        })
    });
}

exports.getEstatatm = getEstatatm;
