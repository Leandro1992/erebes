const excelToJson = require('convert-excel-to-json');
const Util = require('../../util')
const Validators = require('../../validators/validator');

const convertSheetsToSxcel = (files) => {
    if (files && files.sheets && files.sheets.path) {
        return excelToJson({
            sourceFile: files.sheets.path,
            sheets: [
                {
                    name: 'CONTATOS',
                    columnToKey: {
                        A: 'ano',
                        B: 'trimestre',
                        C: 'tipo_contato',
                        D: 'nome',
                        E: 'cargo',
                        F: 'telefone',
                        G: 'email',
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
        Util.tempFile('CONTATOS.TXT').then((path) => {
            console.log(path)
            dados.CONTATOS.forEach((element, idx, arr) => {
                arr[idx] = {
                    ano : element.ano.toString().trim(),
                    trimestre : element.trimestre.toString().trim(),
                    tipo_contato : Validators.calculeSpaces(element.tipo_contato, element.tipo_contato.length, 1, " "),
                    nome : Validators.calculeSpaces(element.nome ? element.nome : "", element.nome ? element.nome.length : 0, 50, " "),
                    cargo : Validators.calculeSpaces(element.cargo ? element.cargo : "", element.cargo ? element.cargo.length : 0, 50, " "),
                    telefone : Validators.calculeSpaces(element.telefone ? element.telefone.toString() : "", element.telefone ? element.telefone.toString().length : 0, 50, " "),
                    email : Validators.calculeSpaces(element.email, element.email.length, 50, " ")
                }
            });
            Util.writeFileTxt(path, header, 'CONTATOS', Util.calculeRegisters(dados.CONTATOS.length), dados.CONTATOS);
            resolve(path)
        }).catch((e) => {
            reject(e);
            console.log("error", e)
        })
    });
};

const getContatos = async (sheets, header) => {
    return new Promise((resolve, reject) => {
        console.log("Calculando CONTATOS...");
        const dados = convertSheetsToSxcel(sheets);
        if (!dados) {
            reject({ msg: "Não reconhecido na planilha a aba CONTATOS" });
        }
        generateFile(header, dados).then((data) => {
            resolve(data);
        }).catch((e) => {
            console.log("error", e)
            reject({ msg: "Ocorreu um erro ao processar o arquivo CONTATOS" });
        })
    });
}

exports.getContatos = getContatos;


