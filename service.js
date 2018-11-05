function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
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


 function autenticar(usuario, senha) {

    const dadosAutenticacao = {
        "usuario": "232",
        "senha": "l30n4rd0!",
        "acesso": "0",
        "continuarConectado": false,
        "nomeEmpresa": "ELOTECH"
    };
    const header = { "Content-Type":"application/json"};
    
    const dadosPost = {
        method: 'POST',
        headers: header,
        body:JSON.stringify(dadosAutenticacao)
    }

    fetch('https://www.secullum.com.br/Ponto4Web/api/1185328083/Login',
        dadosPost).then(data => {
            console.log('teste');
        }
        );
}

module.exports = {
    hello: function() {
       return "Hello";
    }
 }