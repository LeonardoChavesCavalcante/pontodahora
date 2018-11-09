
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('jstrigger').onclick=() => myFunction('aqui é operario!');
    document.getElementById('pegaCookie').onclick=() => alert('aqui ' +getCookie('meucookie'));
    //document.getElementById("click-this").addEventListener("click", handler);
  });


function myFunction(parametro){
    setCookie('meucookie',parametro);
}

let saidaPrevista = "0:00";
let saidaLimite = "0:00";
let saldoGeral = "0:00";
let htmlBox = "";

const seletorPopUp = "#pontoPopup";
if (document.querySelector(seletorPopUp) != null){
    document.querySelector(seletorPopUp).innerHTML = "<h1>coloquei aqui </h1>";
}

let seletorPrincipal = "#nav-container";
function setHeader() {
    
    

    if (document.querySelector(seletorPrincipal) != null) {

        saldoGeral = "10"
        htmlBox += " <div id='elo' class='eloPonto'> "; 

        htmlBox += ` Saída: ${saidaPrevista}`;
        htmlBox += `<br> Limite:${saidaLimite} `;
        htmlBox += ` <br> Saldo: ${saldoGeral} `;
        htmlBox += "</div>";

        document.querySelector(seletorPrincipal).innerHTML += htmlBox;
    }
    autenticar('232', 'l30n4rd0!');
}




async function autenticar(usuario, senha) {

    const dadosAutenticacao = {
        "usuario": "232",
        "senha": "l30n4rd0!",
        "acesso": "0",
            "continuarConectado": false,
        "nomeEmpresa": "ELOTECH"
    };
    const header = { "Content-Type": "application/json",
                     "Authorization":""};

    const dadosPost = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(dadosAutenticacao)
    }
    let token ="Basic  ";
    console.log('teste1');
    await fetch('https://www.secullum.com.br/Ponto4Web/api/1185328083/Login', dadosPost);
    token +=getCookie('auth');          
    
    header.Authorization = token;
    delete dadosPost.body;
    dadosPost.method = "GET";
    let valor ="0";
    await fetch('https://www.secullum.com.br/Ponto4Web/api/1185328083/Sessao/GetIdFuncionarioSessao', dadosPost).then(resp => valor = resp.text());

     console.log('valor',valor);


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

setTimeout(setHeader,2000);