let dadosReq = {};
let cargaHorariaMinutos = 528;
let cargaHorariaSabadoMinutos = 360;
let cargaSabadoDividida = 48;
let minutosLimiteAcimadaCarga = 72;
let saidaPrevista = " 0:00";
let saidaLimite = " 0:00";
let saldoGeral = " 0:00";
let seletorPagina = "#dados-cartao-ponto"; // "#nav-container"

const setupDateTime = () => {
    Date.prototype.addDays = function (num) {
        let value = this.valueOf();
        value += 86400000 * num;
        return new Date(value);
    }

    Date.prototype.addSeconds = function (num) {
        let value = this.valueOf();
        value += 1000 * num;
        return new Date(value);
    }

    Date.prototype.addMinutes = function (num) {
        let value = this.valueOf();
        value += 60000 * num;
        return new Date(value);
    }

    Date.prototype.addHours = function (num) {
        let value = this.valueOf();
        value += 3600000 * num;
        return new Date(value);
    }

    Date.prototype.getDatePonto = function (num) {
        const semana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
        let data = new Date(this.valueOf());
        let dd = String(data.getDate()).padStart(2, "0");
        let mm = String(data.getMonth() + 1).padStart(2, "0");
        let yyyy = data.getFullYear();
        let dataFormatada = `${dd}/${mm}/${yyyy} - ${semana[data.getDay()]}`;
        return dataFormatada;
    }
}

const setCookie = (cname, cvalue) => {
    let expires = "expires=never" //+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
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
        "Authorization": "Basic " + decodeURIComponent(getCookie('auth')),
        "Accept-Language":"pt-BR"
    };
}
const getPainelHTML = () => {
    return ` <div id='painelPontoDaHora' class='PontoDaHora'> 
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
        setupDateTime();        

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
        let urlPeriodo = `https://www.secullum.com.br/Ponto4Web-0/api/1185328083/Periodos?funcionarioId=${idFuncionario}`
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
        let min = 0;

        
        if (diaSemana <= 4) {        
            min = (diaSemana * cargaSabadoDividida);
        }
        if(diaSemana == 5){
            min = 180;
        }

        minutos = minutos + (horas * 60);
        if (sinal == "-") {
            minutos = minutos * -1
        }
     
        minutos-= min;
 
        sinal = "";
        if (minutos < 0){
            sinal = "-";
        }

        horas = Math.trunc(minutos / 60);
        minutos = Math.abs(minutos % 60);
        
        
        minutos = Math.abs(minutos);
        horas = Math.abs(horas);
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
        let dadosRetorno = {};

        let hoje = new Date();
        let periodosTrabalhados = [];
        let periodosIntervalos = [];

        let ent1 = getValor(dados, hoje, "Ent. 1");
    let sai1 = getValor(dados, hoje, "Saí. 1");

    let ent2 = getValor(dados, hoje, "Ent. 2");
    let sai2 = getValor(dados, hoje, "Saí. 2");

    let ent3 = getValor(dados, hoje, "Ent. 3");
    let sai3 = getValor(dados, hoje, "Saí. 3");
    if (ent1 && (ent1 != null) && (ent1.trim().toUpperCase() == "FERIADO")) {
        dadosRetorno.dataSaida = "00:00";
        dadosRetorno.dataLimite = "00:00";
        return dadosRetorno;
    }

    adicionaPeriodo(periodosTrabalhados, ent1, sai1);
    adicionaPeriodo(periodosTrabalhados, ent2, sai2);
    adicionaPeriodo(periodosTrabalhados, ent3, sai3);

    adicionaPeriodo(periodosIntervalos, sai1, ent2);
    adicionaPeriodo(periodosIntervalos, sai2, ent3);


    let somaMinutosTrabalhado = 0;
    if (periodosTrabalhados.length > 0) {
        somaMinutosTrabalhado = periodosTrabalhados.reduce((valor, reg) => valor + reg.minutos, 0);
    }

    let somaMinutosIntervalo = 0;
    if (periodosIntervalos.length > 0) {
        somaMinutosIntervalo = periodosIntervalos.reduce((valor, reg) => valor + reg.minutos, 0);
    }

    let menorEntrada;
    if (periodosTrabalhados[0]) {
        menorEntrada = new Date(periodosTrabalhados[0].entrada);
    } else {
        menorEntrada = new Date();
    }
    if (hoje.getDay() == 6){
        cargaHorariaMinutos = cargaHorariaSabadoMinutos;
        minutosLimiteAcimadaCarga =0;
    }

    dataHoraSaida = menorEntrada.addMinutes(cargaHorariaMinutos);
    dataHoraSaida = dataHoraSaida.addMinutes(somaMinutosIntervalo);

    let dataLimite = dataHoraSaida.addMinutes(minutosLimiteAcimadaCarga);

    if (hoje.getDay() == 5) {
        dataHoraSaida = dataHoraSaida.addHours(-1);
    }

    dadosRetorno.dataSaida = String(dataHoraSaida.getHours()).padStart(2, "0") + ":" + String(dataHoraSaida.getMinutes()).padStart(2, "0");
    dadosRetorno.dataLimite = String(dataLimite.getHours()).padStart(2, "0") + ":" + String(dataLimite.getMinutes()).padStart(2, "0");

    return dadosRetorno;
}

const getBancoHoras = async () => {
    let dados = {};
    idFuncionario = getCookie("ultimo-funcionario-id-estrutura");
    let idPeriodoAtual =  await getPeriodoAtual();    
    let urlBancoHoras = `https://www.secullum.com.br/Ponto4Web-0/api/1185328083/CartaoPonto?funcionarioId=${idFuncionario}&periodoId=${idPeriodoAtual}`
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
const timer = setInterval(() => {
    main();
}, 1000);