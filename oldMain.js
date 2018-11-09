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
