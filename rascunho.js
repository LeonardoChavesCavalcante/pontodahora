
var getSaldo = () => {
    let dataSaldo = '30/10/2018 - TER';
    return getValueTableByHeader(dataSaldo, 'BSaldo');

}

var getIndexByValue = (value, list) => {
    Array.from(list).forEach(element => {
        if (element.innerText.trim() === value.trim()) {
            return element.cellIndex;
        }
    });    
}

var getValueTableByHeader = (lineName, columnName) => {
    let headerCells = document.querySelector('#tabela-cartao-ponto > table > thead > tr').cells;
    let dataRows = document.querySelector('#tabela-cartao-ponto > table > thead').rows;
    console.log('meu teste: ',dataRows );
   
    return dataRows[getIndexByValue(lineName, dataRows)].cells[getIndexByValue(columnName, headerCells)];
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

POST
https://www.secullum.com.br/Ponto4Web/api/1185328083/Login
{"usuario":"232","senha":"l30n4rd0!","acesso":"0","continuarConectado":false,"nomeEmpresa":"ELOTECH"}
{"usuario":"232","senha":"l30n4rd0!","acesso":"0","continuarConectado":false,"nomeEmpresa":"XXXXXXX"}
LER O COOKIE AUTH


https://www.secullum.com.br/Ponto4Web/api/1185328083/Sessao/GetIdFuncionarioSessao

HEADER 
   Authorization:Basic  MC0yMzI6bDMwbjRyZDAh

https://www.secullum.com.br/Ponto4Web/api/1185328083/CartaoPonto?funcionarioId=60&periodoId=3
HEADER 
   Authorization:Basic  MC0yMzI6bDMwbjRyZDAh
   
GET   https://www.secullum.com.br/Ponto4Web/api/1185328083/Periodos?funcionarioId=60
RESPONSE   {"lista":[{"id":4,"nome":"Novembro/2018"},{"id":3,"nome":"Outubro/2018"},{"id":1,"nome":"Setembro/2018"}],"periodoAtual":4}

dados.colunas.filter( x => x.conteudo =='BSaldo')[0].id

dados.linhas.filter( x => x[0].conteudo ==  '01/11/2018 - QUI')[0][dados.colunas.indexOf(dados.colunas.filter( x => x.conteudo =='BSaldo')[0])]

dados.linhas.filter( x => x[0].conteudo ==  '01/11/2018 - QUI')[0][dados.colunas.indexOf(dados.colunas.filter( x => x.conteudo =='Ent. 2')[0])].conteudo;

https://www.treinaweb.com.br/blog/requisicoes-ajax-no-javascript-com-a-fetch-api/

var d = new Date();
var n = d.getDay();

   // Utilizaremos as "Page Actions" e registramos isso aqui
   "page_action": {
    "default_icon": {
        "19" : "icon19.png"
    },
    "default_title": "Ponto ELotech"
},
