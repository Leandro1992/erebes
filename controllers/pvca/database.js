const Util = require('../../util');
const fs = require('fs');

const generateFile = async (header) => {
    return new Promise((resolve, reject) => {
        Util.tempFile('DATABASE.TXT').then((path) => {
            // Util.writeFileTxt(path, header, 'DATABASE', Util.calculeRegisters(dados.CONTATOS.length), dados.CONTATOS);
            let headerDatabase = {}
            try {
                headerDatabase.arquivo = 'DATABASE';
                headerDatabase.dataPadrao = header.database.trim();
                headerDatabase.instituicao = header.instituicao.trim();
                headerDatabase.database = header.database1.trim();
                const result = Object.values(headerDatabase).join("");
                fs.appendFileSync(path, result, { encoding: "latin1"});
            } catch (error) {
                fs.appendFileSync(path, 'Ocorreu um erro ao gerar arquivo, estão faltando informações (Data ou instituição)', 'latin1');
            }
            resolve(path)
        }).catch((e) => {
            reject(e);
            console.log("error", e)
        })
    });
};

const getDatabase = async (sheets, header) => {
    return new Promise((resolve, reject) => {
        console.log("Calculando DATABASE...", header);
        if (!header) {
            reject({ msg: "Não reconhecido informações sobre DATABASE" });
        }else{
            if(header.database && header.database1 && header.instituicao){
                generateFile(header).then((data) => {
                    resolve(data);
                }).catch((e) => {
                    console.log("error", e)
                    reject({ msg: "Ocorreu um erro ao processar o arquivo DATABASE" });
                })
            }else{
                reject({ msg: "Faltando informações sobre o arquivo DATABASE" });
            }
        }
    });
}

exports.getDatabase = getDatabase;
