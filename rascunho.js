
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

const myInterval = setInterval(() => {
    if (document.querySelector(seletor)) {
        clearInterval(myInterval);
        main();
    }
}, 10);

main = () => {
    //setHeader();

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


let idFuncionario;

let saidaPrevista = "0:00";
let saidaLimite = "0:00";
let saldoGeral = "0:00";


const htmlLogin = `<div id="login-form-campos">
                    <h3>Login do Ponto</h3>
                   <p>
                      <input name="usuario" id="userLogin" type="text" placeholder="Nº da Folha" value="" maxlength="22">
                   </p>
                   <p>
                      <input name="senha" id="userSenha" type="password" placeholder="Senha" value="" maxlength="10">
                   </p>
                   <ul class="errorList"></ul>
                   <p> 
                    <button id="btnLogin">Entrar</button>
                   </p>
                 </div>`;
                 

const htmlSaldo = ` <div id='eloSaldo' class='eloPonto'> 
                         Saída: ${saidaPrevista}
                    <br> Limite:${saidaLimite} 
                    <br> Saldo: ${saldoGeral} 
                  </div>`;



const seletorPopUp = "#popupDados";
const seletorPagina = "#nav-container";


const seletor = seletorPopUp;

const logar = ()=>{
    let usuario = document.querySelector("#userLogin").value;
    let senha = document.querySelector("#userSenha").value;
    
    autenticar(usuario,senha);
    alert( getCookie('auth'));
}

function main() {
    
    let cookieAuth = getCookie('auth');


    if ((cookieAuth && cookieAuth != '')) {
        getDadosBancoHoras();

    }
    else {
        if (document.querySelector(seletorPopUp)) {
            document.querySelector(seletorPopUp).innerHTML = htmlLogin;
        }
    }

    if (document.querySelector(seletorPopUp)) {

        document.querySelector(seletorPopUp).innerHTML = htmlSaldo;
        document.querySelector(seletorPopUp).innerHTML = htmlLogin;
    }
    if (document.querySelector(seletorPagina)) {
        document.querySelector(seletorPagina).innerHTML = htmlSaldo;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    main();
    if (document.querySelector("#btnLogin")){
      document.querySelector("#btnLogin").onclick = logar;
    }

});

const getDadosBancoHoras = async () => {

    let urlDadosPonto = `https://www.secullum.com.br/Ponto4Web/api/1185328083/CartaoPonto?funcionarioId=${idFuncionario}&periodoId=${getPeriodoAtual()}"`
    let dadosReq = {
        method: 'GET',
        headers: getHeader()
    };
    fetch(urlDadosPonto, dadosReq)
}


const autenticar = async (usuario, senha) => {

    const dadosAutenticacao = {
        "usuario": usuario,
        "senha": senha,
        "acesso": "0",
           "continuarConectado": true,
        "nomeEmpresa": ""
    };

    const dadosPost = {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify(dadosAutenticacao)
    }

    await fetch('https://www.secullum.com.br/Ponto4Web/api/1185328083/Login', dadosPost)
    .then( resp => resp.json());
    
}

const getIDFuncionario = async () => {

    let urlGetIDFuncionario = "'https://www.secullum.com.br/Ponto4Web/api/1185328083/Sessao/GetIdFuncionarioSessao";
    let dadosReq = {
        method: 'GET',
        headers: getHeader()
    }

    await fetch(urlGetIDFuncionario, dadosReq).then(resp => valor = resp.json)
        .then(resp => idFuncionario = resp);
    return idFuncionario;
}

const getPeriodoAtual = async () => {

    let dadosReq = {
        method: 'GET',
        headers: getHeader()
    }
    let periodAtual;
    let urlPeriodo = `https://www.secullum.com.br/Ponto4Web/api/1185328083/Periodos?funcionarioId=${idFuncionario}`
    return await fetch(urlPeriodo, dadosReq).then(resp => valor = resp.json)
        .then(resp => res.periodAtual);

}

const getBancoHoras = async () => {
    let dadosReq = {
        method: 'GET',
        headers: getHeader()
    }
    idFuncionario = getIDFuncionario();
    let periodAtual = await getPeriodoAtual();
    let urlPeriodo = `https://www.secullum.com.br/Ponto4Web/api/1185328083/CartaoPonto?funcionarioId=${idFuncionario}&periodoId=${idPeriodoAtual}`
    return await fetch(urlPeriodo, dadosReq).then(resp => valor = resp.json)
        .then(resp => res.periodAtual);

}

const getHeader = () => {

    return {
        "Content-Type": "application/json",
        "Authorization": "Basic " + getCookie('auth')
    };
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=never" //+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};  






#login-form-campos input {
    background-repeat: no-repeat;
    background-position: 12px center;
    margin-top: 10px;
    background-color: rgb(250, 255, 189) ;
    color: rgb(0, 0, 0) ;
}
#login-form-campos button {
    border-image: none;
    background-color: #015b75;
    background-repeat: repeat-x;
    display: inline-block;
   
    cursor: pointer;
    text-align: center;
    margin: 0px 0;
    height: 25px;
    width: 100%;
    color: #fff;
    font-size: 13px;
    line-height: 28px;
    border: none;
    -webkit-text-shadow: none;
    -ms-text-shadow: none;
    -moz-text-shadow: none;
    -o-text-shadow: none;
    text-shadow: none;
}
button, html, input, select, textarea {
    font-family: Lato-Regular,"Lucida Grande","Lucida Sans Unicode",Helvetica,sans-serif!important;
}
/*  padding-left: 25px;
margin-top: 150px;
margin-left: 10px;
padding-right: 100px;     */