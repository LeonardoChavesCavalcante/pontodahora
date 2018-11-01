let saidaPrevista = "0:00";
let saidaLimite = "0:00";
let saldoGeral = "0:00";
let htmlBox = "";

let seletorPrincipal = "#nav-container";
function setHeader() {

    if (document.querySelector(seletorPrincipal) != null) {

        saldoGeral = getSaldo();
        htmlBox += " <div id='elo' class='eloPonto'> ";

        htmlBox += ` Saída: ${saidaPrevista}`;
        htmlBox += `<br> Limite:${saidaLimite} `;
        htmlBox += ` <br> Saldo: ${saldoGeral} `;
        htmlBox += "</div>";

        document.querySelector(seletorPrincipal).innerHTML += htmlBox;
    }
}
setTimeout(setHeader, 2000);

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