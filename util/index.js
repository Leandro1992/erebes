const fs = require('fs');
const os = require('os');
const path = require('path');
const AdmZip = require('adm-zip');
const Validators = require('../validators/validator');

module.exports = {
    //VERIFICA QUANTOS ESPAÇOS EM BRANCO APENAS NO INICIO DA STRING
    calculeInitialWhiteSpaces(str) {
        let count = 0;
        if (str) {
            let array = str.split('');
            for (let i of array) {
                if (i == ' ') {
                    count++;
                } else {
                    return count;
                }
            }
        } else {
            return count;
        }
    },

    //CRIA OS ARQUIVOS TEMPORÁRIOS 
    tempFile(name = 'temp_file', data = '', encoding = 'latin1') {
        let time = new Date().getTime();
        return new Promise((resolve, reject) => {
            const tempPath = path.join(os.tmpdir(), 'bacen-generator-' + time);
            fs.mkdtemp(tempPath, (err, folder) => {
                if (err)
                    return reject(err)

                const file_name = path.join(folder, name);

                fs.writeFile(file_name, data, encoding, error_file => {
                    if (error_file)
                        return reject(error_file);

                    resolve(file_name)
                })
            })
        })
    },

    zipFiles(path) {
        
    },

    calculeRegisters(qtd) {
        let value = qtd.toString();
        let tempString = "";
        let number = 8 - qtd.toString().length;
        for (let index = 0; index < number; index++) {
            tempString = tempString.concat("0");
        }
        return tempString.concat(value);
    },

    writeFileTxt(path, header, filename, qtdRegistersHeader, dados) {
        let valid = true;
        let dataPadrao;
        let instituicao;
        let nomeArquivo;
        let registros;
        try {
            dataPadrao = header.database.trim();
            instituicao = header.instituicao.trim();
            nomeArquivo = filename.trim();
            registros = qtdRegistersHeader.trim();
        } catch (error) {
            valid = false;
            fs.appendFileSync(path, 'Ocorreu um erro ao gerar arquivo, estão faltando informações (Data ou instituição)', 'latin1');
        }


        if (!dataPadrao || !instituicao || !nomeArquivo) {
            valid = false;
            fs.appendFileSync(path, 'Ocorreu um erro ao gerar arquivo, estão faltando informações (Data ou instituição)', 'latin1');
        }

        if (valid) {
            fs.appendFileSync(path, filename.concat(dataPadrao, instituicao, registros) + "\r\n", 'latin1');
        }
        console.log(dados, dados.length)
        if(dados.length > 0){
            dados.forEach((element, idx, arr) => {
                const result = Object.values(element).join("");
                if(arr.length - 1 == idx){
                    fs.appendFileSync(path, result, 'latin1');
                }else{
                    fs.appendFileSync(path, result+ "\r\n", 'latin1');
                }
                
            });
        }

        return valid;
    }
}

