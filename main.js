let dadosReq = {};
let cargaHorariaMinutos = 528;
let minutosLimiteAcimadaCarga = 72;
let saidaPrevista = " 0:00";
let saidaLimite = " 0:00";
let saldoGeral = " 0:00";
let seletorPagina = "#dados-cartao-ponto"; // "#nav-container"

const timer = setInterval(() => {
    main();
}, 1000);

const setCookie = (cname, cvalue) => {
    let expires = "expires=never" //+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname) => {
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

const getDiffInMinutes = (date1, date2) => {
    let segundos = (date2 - date1) / 1000;
    let minutos = Math.abs(segundos / 60);
    return minutos;
}
const getHeader = () => {
    return {
        "Content-Type": "application/json",
        "Authorization": "Basic " + decodeURIComponent(getCookie('auth'))
    };
}
const getPainelHTML = () => {
    return ` <div id='eloSaldo' class='eloPonto'> 
             <table>
               <tr>
                 <td>Saldo:</td> <td>${saldoGeral}</td>
               </tr>
               <tr>      
                  <td>Saída:</td><td>${saidaPrevista}</td>
                </tr>  
                <tr>
                  <td>Limite:</td><td>${saidaLimite}</td>
                </tr>                
              </table>    
          </div>`;
}

async function main() {
    if (document.querySelector(seletorPagina)) {
        clearInterval(timer);
        setupDateTime()

        dadosReq = {
            method: 'GET',
            headers: getHeader()
        };

        await getBancoHoras();        
        document.querySelector(seletorPagina).innerHTML += getPainelHTML();
    }
}

const getPeriodoAtual = async () => {

    const idFuncionario = getCookie("ultimo-funcionario-id-estrutura");
    let urlPeriodo = `https://www.secullum.com.br/Ponto4Web/api/1185328083/Periodos?funcionarioId=${idFuncionario}`
    return await fetch(urlPeriodo, dadosReq).then(resp => resp.json())
        .then(resp => resp.periodoAtual).catch(resolve => console.log(resolve));
}
const aplicaCargaHorariaSabado = (saldo, data) => {
    if (saldo == null) {
        return "X";
    }
    let sinal = saldo[0];
    let diaSemana = data.getDay();
    arraySaldo = saldo.split(":");
    let minutos = parseInt(arraySaldo[1]);
    let horas = Math.abs(parseInt(arraySaldo[0]));

    if (diaSemana > 0 && diaSemana < 7) {
        let min = (diaSemana * 48);
        minutos = minutos + (horas * 60);

        if (sinal == "-") {
            minutos += min;
        } else {
            minutos -= min;
            sinal = "";
        }
        horas = Math.trunc(minutos / 60);
        minutos = minutos % 60;
    }
    return `${sinal}${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

const adicionaPeriodo = (periodos, entrada, saida) => {

    let hoje = new Date();
    if (entrada != null) {
        let periodo = {};
        if (saida == null) {
            saida = hoje.getHours() + ":" + hoje.getMinutes();
        }
        periodo.entrada = new Date("01/01/2000 " + entrada);
        periodo.saida = new Date("01/01/2000 " + saida);
        periodo.minutos = getDiffInMinutes(periodo.entrada, periodo.saida);
        periodos.push(periodo);
    }
}
const getHoraSaida = (dados) => {

    let hoje = new Date();
    let periodosTrabalhados = [];
    let periodosIntervalos = [];

    let ent1 = getValor(dados, hoje, "Ent. 1");
    let sai1 = getValor(dados, hoje, "Saí. 1");

    let ent2 = getValor(dados, hoje, "Ent. 2");
    let sai2 = getValor(dados, hoje, "Saí. 2");

    let ent3 = getValor(dados, hoje, "Ent. 3");
    let sai3 = getValor(dados, hoje, "Saí. 3");

    adicionaPeriodo(periodosTrabalhados, ent1, sai1);
    adicionaPeriodo(periodosTrabalhados, ent2, sai2);
    adicionaPeriodo(periodosTrabalhados, ent3, sai3);

    adicionaPeriodo(periodosIntervalos, sai1, ent2);
    adicionaPeriodo(periodosIntervalos, sai2, ent3);


    let somaMinutosTrabalhado = periodosTrabalhados.reduce((valor, reg) => valor + reg.minutos, 0);
    let somaMinutosIntervalo = periodosIntervalos.reduce((valor, reg) => valor + reg.minutos, 0);

    let menorEntrada;
    if (periodosTrabalhados[0]) {
        menorEntrada = new Date(periodosTrabalhados[0].entrada);
    }
    dataHoraSaida = menorEntrada.addMinutes(cargaHorariaMinutos);
    dataHoraSaida = dataHoraSaida.addMinutes(somaMinutosIntervalo);

    let dataLimite = dataHoraSaida.addMinutes(minutosLimiteAcimadaCarga);
    let dadosRetorno = {};
    dadosRetorno.dataSaida = String(dataHoraSaida.getHours()).padStart(2, "0") + ":" + String(dataHoraSaida.getMinutes()).padStart(2, "0");
    dadosRetorno.dataLimite = String(dataLimite.getHours()).padStart(2, "0") + ":" + String(dataLimite.getMinutes()).padStart(2, "0");
    return dadosRetorno;
}

const getBancoHoras = async () => {
    let dados = {};
    idFuncionario = getCookie("ultimo-funcionario-id-estrutura");
    let idPeriodoAtual = await getPeriodoAtual();
    let urlBancoHoras = `https://www.secullum.com.br/Ponto4Web/api/1185328083/CartaoPonto?funcionarioId=${idFuncionario}&periodoId=${idPeriodoAtual}`
    await fetch(urlBancoHoras, dadosReq).then(resp => resp.json()).then(resp => dados = resp).catch(resolve => console.log(resolve));;

    let hoje = new Date();
    saldoGeral = getValor(dados, hoje.addDays(-1), "BSaldo");
    saldoGeral = aplicaCargaHorariaSabado(saldoGeral, hoje.addDays(-1));
    let dadosSaida = getHoraSaida(dados);
    saidaPrevista = dadosSaida.dataSaida;
    saidaLimite = dadosSaida.dataLimite;
    return saldoGeral;
}
const getValor = (dados, data, campo) => {
    let dataFormatada = data.getDatePonto();
    let indexColuna = dados.colunas.indexOf(dados.colunas.filter(x => x.conteudo == campo)[0]);
    if (indexColuna > 0) {
        return dados.linhas.filter(x => x[0].conteudo == dataFormatada)[0][indexColuna].conteudo;
    } else {
        return null;
    }
}

const setupDateTime = () => {
    Date.prototype.addDays = function (num) {
        var value = this.valueOf();
        value += 86400000 * num;
        return new Date(value);
    }

    Date.prototype.addSeconds = function (num) {
        var value = this.valueOf();
        value += 1000 * num;
        return new Date(value);
    }

    Date.prototype.addMinutes = function (num) {
        var value = this.valueOf();
        value += 60000 * num;
        return new Date(value);
    }

    Date.prototype.addHours = function (num) {
        var value = this.valueOf();
        value += 3600000 * num;
        return new Date(value);
    }
    Date.prototype.getDatePonto = function (num) {
        const semana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
        let data = new Date(this.valueOf());
        let dd = data.getDate();
        let mm = data.getMonth() + 1;
        let yyyy = data.getFullYear();
        let dataFormatada = `${dd}/${mm}/${yyyy} - ${semana[data.getDay()]}`;
        return dataFormatada;
    }
}