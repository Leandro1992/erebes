module.exports = {
    //VERIFICA QUANTOS ESPAÇOS EM BRANCO APENAS NO INICIO DA STRING
    calculeInitialWhiteSpaces(str) {
        let count = 0;
        let array = [];
        if(str){
            str.split('');
        }
        for (let i of array){
            if(i == ' '){
                count++;
            }else{
                return count;
            }

        }

    }
}

