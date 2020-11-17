module.exports = {
    //VERIFICA QUANTOS ESPAÇOS EM BRANCO APENAS NO INICIO DA STRING
    calculeInitialWhiteSpaces(str) {
        let count = 0;
        if(str){
            let array = str.split('');
            for (let i of array){
                if(i == ' '){
                    count++;
                }else{
                    return count;
                }
    
            }
        }else{
            return count;
        }
    }
}

