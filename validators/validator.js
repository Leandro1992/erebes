const fs = require('fs');
const os = require('os');
const path = require('path');
const AdmZip = require('adm-zip');

module.exports = {
    calculeSpaces(data, qtd, total, dataFill) {
        // console.log(data, qtd, total, dataFill)
        let tempString = data;
        let number = total - qtd;
        for (let index = 0; index < number; index++) {
            tempString = tempString.concat(dataFill);
        }
        return tempString;
    },

    fullFillWithZeros(qtd, max) {
        let value = qtd.toString();
        let tempString = "";
        let number = max - qtd.toString().length;
        for (let index = 0; index < number; index++) {
            tempString = tempString.concat("0");
        }
        return tempString.concat(value);
    },
}