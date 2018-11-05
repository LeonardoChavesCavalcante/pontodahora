
require('./service');

let saidaPrevista = "0:00";
let saidaLimite = "0:00";
let saldoGeral = "0:00";
let htmlBox = "";



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
setTimeout(setHeader, 2000);