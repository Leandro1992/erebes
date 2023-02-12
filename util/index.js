const fs = require('fs');
const os = require('os');
const path = require('path');
const AdmZip = require('adm-zip');

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
    tempFile(name = 'temp_file', data = '', encoding = 'utf8') {
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
        const zip = new AdmZip();
        zip.addLocalFile(path);
        
        return zip.toBuffer();
    }
}

