
let saidaPrevista = "0:00";
let saidaLimite = "0:00";
let saldoGeral = "0:00";




let seletorPagina = "#nav-container";
       seletorPagina ="#dados-cartao-ponto";

async function main() {    
    await getBancoHoras();
    const htmlSaldo = ` <div id='eloSaldo' class='eloPonto'> 
                     Saldo: ${saldoGeral}                     
                    <br> Saída: ${saidaPrevista}
                    <br> Limite:${saidaLimite}                     
                  </div>`;

    
    if (document.querySelector(seletorPagina)) {
        
        document.querySelector(seletorPagina).innerHTML += htmlSaldo;
    }

}

document.addEventListener('DOMContentLoaded', function async () {
     main();
  
});

const getPeriodoAtual = async () => {

    let dadosReq = {
        method: 'GET',
        headers: getHeader()
    }
    const idFuncionario = getCookie("ultimo-funcionario-id-estrutura");
    let urlPeriodo = `https://www.secullum.com.br/Ponto4Web/api/1185328083/Periodos?funcionarioId=${idFuncionario}`
    return await fetch(urlPeriodo, dadosReq).then(resp =>  resp.json()).then(resp =>  resp.periodoAtual);
}

const getBancoHoras = async () => {
    let dadosReq = {
        method: 'GET',
        headers: getHeader()
    }
    let dados ={};
    idFuncionario = getCookie("ultimo-funcionario-id-estrutura");
    let idPeriodoAtual = await getPeriodoAtual();
    let urlPeriodo = `https://www.secullum.com.br/Ponto4Web/api/1185328083/CartaoPonto?funcionarioId=${idFuncionario}&periodoId=${idPeriodoAtual}`    
    await fetch(urlPeriodo, dadosReq).then(resp => resp.json()).then(resp => dados = resp);
    saldoGeral = dados.linhas.filter( x => x[0].conteudo ==  '01/11/2018 - QUI')[0][dados.colunas.indexOf(dados.colunas.filter( x => x.conteudo =='BSaldo')[0])].conteudo;
    
    console.log('aqui: ',saldoGeral);
    return saldoGeral;

}

const getHeader = () => {

    return {
        "Content-Type": "application/json",
        "Authorization": "Basic " + getCookie('auth')
    };
}

const setCookie = (cname, cvalue, exdays)=> {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=never" //+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname)=> {
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

setTimeout(() => {
    main();
}, 1000);