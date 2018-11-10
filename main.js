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
    let urlPeriodo = `https://www.secullum.com.br/Ponto4Web/api/1185328083/CartaoPonto?funcionarioId=${idFuncionario}&periodoId=3${idPeriodoAtual}`
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