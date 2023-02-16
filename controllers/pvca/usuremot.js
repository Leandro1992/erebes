
const excelToJson = require('convert-excel-to-json');
const Util = require('../../util')
const Validators = require('../../validators/validator');

const convertSheetsToSxcel = (files) => {
    if (files && files.sheets && files.sheets.path) {
        return excelToJson({
            sourceFile: files.sheets.path,
            sheets: [
                {
                    name: 'USUREMOT',
                    columnToKey: {
                        A: 'ano',
                        B: 'trimestre',
                        C: 'ib_pf',
                        D: 'ib_pj',
                        E: 'hb',
                        F: 'ob',
                        G: 'mobile_pf',
                        H: 'mobile_pj',
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
        Util.tempFile('USUREMOT.TXT').then((path) => {
            console.log(path)
            dados.USUREMOT.forEach((element, idx, arr) => {
                arr[idx] = {
                    ano: element.ano.toString().trim(),
                    trimestre: element.trimestre.toString().trim(),
                    ib_pf: Validators.fullFillWithZeros(element.ib_pf ? +element.ib_pf : 0, 9),
                    ib_pj: Validators.fullFillWithZeros(element.ib_pj ? +element.ib_pj : 0, 9),
                    hb: Validators.fullFillWithZeros(element.hb ? +element.hb : 0, 9),
                    ob: Validators.fullFillWithZeros(element.ob ? +element.ob : 0, 9),
                    mobile_pf: Validators.fullFillWithZeros(element.mobile_pf ? +element.mobile_pf : 0, 9),
                    mobile_pj: Validators.fullFillWithZeros(element.mobile_pj ? +element.mobile_pj : 0, 9)
                }
            });
            Util.writeFileTxt(path, header, 'USUREMOT', Util.calculeRegisters(dados.USUREMOT.length), dados.USUREMOT);
            resolve(path)
        }).catch((e) => {
            reject(e);
            console.log("error", e)
        })
    });
};

const getUsuremot = async (sheets, header) => {
    return new Promise((resolve, reject) => {
        console.log("Calculando USUREMOT...");
        const dados = convertSheetsToSxcel(sheets);
        if (!dados) {
            reject({ msg: "Não reconhecido na planilha a aba USUREMOT" });
        }
        generateFile(header, dados).then((data) => {
            resolve(data);
        }).catch((e) => {
            console.log("error", e)
            reject({ msg: "Ocorreu um erro ao processar o arquivo USUREMOT" });
        })
    });
}

exports.getUsuremot = getUsuremot;