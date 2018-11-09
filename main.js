
let saidaPrevista = "0:00";
let saidaLimite = "0:00";
let saldoGeral = "0:00";


const htmlLogin = `<div id="login-form-campos">
                    <h3>Login do Ponto</h3>
                   <p>
                      <input name="usuario" type="text" placeholder="Nº da Folha" value="" maxlength="22">
                   </p>
                   <p>
                      <input name="senha" type="password" placeholder="Senha" value="" maxlength="10">
                   </p>
                   <ul class="errorList"></ul>
                   <p> 
                    <button id="login">Entrar</button>
                   </p>
                 </div>`;

const htmlSaldo = ` <div id='eloSaldo' class='eloPonto'> 
                         Saída: ${saidaPrevista}
                    <br> Limite:${saidaLimite} 
                    <br> Saldo: ${saldoGeral} 
                  </div>`;



const seletorPopUp = "#pontoPopup";
const seletorPagina = "#nav-container";


const seletor = seletorPopUp;

const myInterval = setInterval(() => {
    if (document.querySelector(seletor)) {
        clearInterval(myInterval);
        main();
    }
}, 10);

main = () => {
    //setHeader();

}


function setHeader() {
    let cookieAuth = getCookie('auth');
    if ((cookieAuth && cookieAuth != '')) {
        getDadosBancoHoras();
    }
    else {
        if (document.getElementById('popupDados')) {
            document.getElementById('popupDados').innerHTML = htmlLogin;
        }
    }


    if (document.getElementById('popupDados')) {
        if ((cookieAuth && cookieAuth != '')) {
            document.getElementById('popupDados').innerHTML = htmlSaldo;
        } else {
            document.getElementById('popupDados').innerHTML = htmlLogin;
        }
    }
    if (document.querySelector(seletorPagina)) {
        document.querySelector(seletorPagina).innerHTML = htmlSaldo;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setHeader();
});

getDadosBancoHoras = () => {

}


async function autenticar(usuario, senha) {

    const dadosAutenticacao = {
        "usuario": "232",
        "senha": "l30n4rd0!",
        "acesso": "0",
        "continuarConectado": false,
        "nomeEmpresa": "ELOTECH"
    };
    const header = {
        "Content-Type": "application/json",
        "Authorization": ""
    };

    const dadosPost = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(dadosAutenticacao)
    }
    let token = "Basic  ";
    console.log('teste1');
    await fetch('https://www.secullum.com.br/Ponto4Web/api/1185328083/Login', dadosPost);
    token += getCookie('auth');

    header.Authorization = token;
    delete dadosPost.body;
    dadosPost.method = "GET";
    let valor = "0";
    await fetch('https://www.secullum.com.br/Ponto4Web/api/1185328083/Sessao/GetIdFuncionarioSessao', dadosPost).then(resp => valor = resp.text());

    console.log('valor', valor);


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

setTimeout(setHeader, 2000);