'use strict';

const util = require('../util')
const js2xmlparser = require("js2xmlparser");

let jsonBase9800 = {
    codDoc: "9800",
    tipoEnvio: null,
    dataBase: null,
    cnpjIf: null,
    valor: []
}

let jsonBase9805 = {
    codDoc: "9805",
    tipoEnvio: null,
    dataBase: null,
    cnpjIf: null,
    valor: []
}

//START, RECEBE A PLANILHA E CHAMA OS SERVIÇOS PARA TRATAMENTO
const GerarXML = async (sheets, fields, tipo) => {
    return new Promise(async (resolve, reject) => {
        if (tipo == "9800") {
            let xmlTemp = jsonBase9800;
            if (!sheets['9800']) resolve({});
            console.log("Gerando XML 9800...");
            let count = 1;
            for (const i of sheets['9800']) {
                let cpfs = i.BenCPF ? i.BenCPF.replace(/\s+/g, '').split(",") : [];
                let cnpjs = i.BenCNPJ ? i.BenCNPJ.replace(/\s+/g, '').split(",") : [];
                let arrayCpfCnpj = [];
                if (cpfs.length > 0) {
                    arrayCpfCnpj.push({ cpf: cpfs });
                }
                if (cnpjs.length > 0) {
                    arrayCpfCnpj.push({ cnpj: cnpjs });
                }
                let valor = {
                    id: count,
                    beneficiarios: arrayCpfCnpj,
                    valorADevolver: i.ValorADevolver,
                    codOrigem: i.codOrigem,
                    infAdicionais: i.InfAdicionais
                }
                xmlTemp.valor.push(valor);
                count++;
            }
            xmlTemp.tipoEnvio = fields.tipoEnvio;
            xmlTemp.dataBase = fields.database;
            xmlTemp.cnpjIf = fields.cnpj;
            resolve(js2xmlparser.parse("asvr9800", xmlTemp, {declaration: {encoding:"UTF-8"}}));
        }

        if (tipo == "9805") {
            let xmlTemp = jsonBase9805;
            if (!sheets['9805']) resolve({});
            console.log("Gerando XML 9805...");
            for (const i of sheets['9805']) {           
                let valor = {
                    origem: i.origem,
                    modalidadePagamento: i.modalidadePagamento,
                    valorDevolvido: i.valorDevolvido,
                    qtdCpfsBeneficiados: i.qtdCpfsBeneficiados
                }
                xmlTemp.valor.push(valor);
            }
            xmlTemp.tipoEnvio = fields.tipoEnvio;
            xmlTemp.dataBase = fields.database;
            xmlTemp.cnpjIf = fields.cnpj;
            resolve(js2xmlparser.parse("asvr9805", xmlTemp, {declaration: {encoding:"UTF-8"}}));
        }
    });
};

exports.GerarXML = GerarXML;
