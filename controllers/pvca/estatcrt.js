const excelToJson = require('convert-excel-to-json');
const Util = require('../../util')
const Validators = require('../../validators/validator');

const convertSheetsToSxcel = (files) => {
    if (files && files.sheets && files.sheets.path) {
        return excelToJson({
            sourceFile: files.sheets.path,
            sheets: [
                {
                    name: 'ESTATCRT',
                    columnToKey: {
                        A: 'ano',
                        B: 'trimestre',
                        C: 'fun_cartao',
                        D: 'bandeira',
                        E: 'qtd_cartoes',
                        F: 'qtd_transacoes',
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
        Util.tempFile('ESTATCRT.TXT').then((path) => {
            console.log(path)
            dados.ESTATCRT.forEach((element, idx, arr) => {
                arr[idx] = {
                    ano : element.ano.toString().trim(),
                    trimestre : element.trimestre.toString().trim(),
                    fun_cartao : element.fun_cartao.trim(),
                    bandeira : Validators.fullFillWithZeros(element.bandeira ? +element.bandeira : 0, 2),
                    qtd_cartoes : Validators.fullFillWithZeros(element.qtd_cartoes ? +element.qtd_cartoes : 0, 12),
                    qtd_transacoes : Validators.fullFillWithZeros(element.qtd_transacoes ? +element.qtd_transacoes : 0, 12),
                    valor : Validators.fullFillWithZeros(element.valor ? +element.valor : 0, 15)
                }
            });
            Util.writeFileTxt(path, header, 'ESTATCRT', Util.calculeRegisters(dados.ESTATCRT.length), dados.ESTATCRT);
            resolve(path)
        }).catch((e) => {
            reject(e);
            console.log("error", e)
        })
    });
};

const getEstatcrt = async (sheets, header) => {
    return new Promise((resolve, reject) => {
        console.log("Calculando ESTATCRT...");
        const dados = convertSheetsToSxcel(sheets);
        if (!dados) {
            reject({ msg: "Não reconhecido na planilha a aba ESTATCRT" });
        }
        generateFile(header, dados).then((data) => {
            resolve(data);
        }).catch((e) => {
            console.log("error", e)
            reject({ msg: "Ocorreu um erro ao processar o arquivo ESTATCRT" });
        })
    });
}

exports.getEstatcrt = getEstatcrt;
