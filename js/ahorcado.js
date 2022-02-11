var btnIniciar = document.querySelector("#iniciar-juego");
var inputPalabra = document.querySelector("#input-nueva-palabra");
var btnAgregarPalabra = document.querySelector("#nueva-palabra");
var btnReiniciar = document.querySelector("#reiniciar-juego")

var palabrasSecretas = ["ONE", "ORACLE", "ALURA"];

var juegoIniciado = false;
var palabraSorteada;
var indices = [];
var arrayPalabra;
var arrayLetraIngresada = [];
var arrayLetrasCorrectas = [];
var arrayLetrasIncorrectas = [];
let letrasUnicas = [];
//--------funcion para generar un array sin letras repetidas
//--------que sera usado para verificar el ganador
function cribarLetrasRepetidas() {
    for (i = 0; i < palabraSorteada.length; i++) {
        if (!letrasUnicas.includes(palabraSorteada[i])) {
            letrasUnicas.push(palabraSorteada[i])
        }
    }
}

function sortearPalabra() {
    var numeroAleatorio = Math.floor(Math.random() * palabrasSecretas.length);
    palabraSorteada = palabrasSecretas[numeroAleatorio];
    palabrasSecretas.splice(numeroAleatorio, 1);
    return palabraSorteada;
}
function crearArrayPalabra(palabra) {
    separada = palabra.split("");
    arrayPalabra = separada;
}
btnIniciar.addEventListener("click", function (event) {
    event.preventDefault();
    pincel.clearRect(0, 0, pantalla.width, pantalla.height);
    iniciarJuego();
});


btnAgregarPalabra.addEventListener("click", function (event) {
    event.preventDefault();
    palabrasSecretas.push(inputPalabra.value.toUpperCase());
    inputPalabra.value = "";
    inputPalabra.focus();
});

function iniciarJuego() {
    pincel.clearRect(0, 0, pantalla.width, pantalla.height);
    horca();
    sortearPalabra();
    crearArrayPalabra(palabraSorteada);
    dibujarGuiones();
    cribarLetrasRepetidas();
    juegoIniciado = true;
    arrayLetraIngresada = [];
    arrayLetrasCorrectas = [];
    arrayLetrasIncorrectas = [];
}
//--------genera un array con los indices de las letras ingresadas 
//--------por los usuarios, esto permite que si hay letras repetidas
//--------dentro de la palabra original pueda dibujar todas
//--------las instancias de esa letra
function buscarIndices() {
    if (juegoIniciado) {
        var indiceBuscado = arrayPalabra.indexOf(arrayLetraIngresada[0]);
        while (indiceBuscado != -1) { //el -1 es el return de indexOf si no encuentra el elemento
            indices.push(indiceBuscado);
            indiceBuscado = arrayPalabra.indexOf(arrayLetraIngresada[0], indiceBuscado + 1);
        }
    }
}
//--------dibuja la cantidad de guiones necesarios para la palabra en juego
function dibujarGuiones() {
    var inicioX = 350;
    var inicioY = 610;
    var contador = 0;
    var nLetras = palabraSorteada.length;
    while (contador < nLetras) {
        pincel.fillStyle = "black";
        pincel.fillRect(inicioX + (40 * contador), inicioY, 30, 4);
        contador++;
    }
}
//--------coloca cada letra en el lugar que deberia aparecer
function dibujarletras(arrOrden) {
    var inicioX = 358;
    var inicioY = 600;
    for (i = 0; i < arrOrden.length; i++) {
        pincel.fillStyle = "black";
        pincel.font = "20px Georgia";
        pincel.fillText(arrayLetraIngresada[0], inicioX + (40 * arrOrden[i]), inicioY);
    }
    indices = [];
}


//--------evento para capturar las teclas del usuario, en el cual
//--------comprueba si son letras y no caracteres especiales o numeros
//--------almacena las letras en uno de dos arrays, de acuerdo a si la
//--------letra esta o no dentro de la palabra sorteada.
//--------tambien dibuja la pieza del ahorcado en caso de que sea necesario
//--------y comprueba si el juego ha terminado
document.addEventListener("keyup", function (event) {
    arrayLetraIngresada = [];
    var letra = event.key.toUpperCase();
    var codigo = letra.charCodeAt();
    if (juegoIniciado) {
        if (codigo > 64 && codigo < 91) {
            arrayLetraIngresada.push(letra);
            buscarIndices();
            dibujarletras(indices);
            var comparador = arrayLetrasIncorrectas.length;
            if (arrayPalabra.includes(letra)) {
                if (!arrayLetrasCorrectas.includes(letra)) {
                    arrayLetrasCorrectas.push(letra)
                }
            } else if (!arrayLetrasIncorrectas.includes(letra)) {
                arrayLetrasIncorrectas.push(letra)
            }
            if (comparador < arrayLetrasIncorrectas.length) {
                dibujarLetrasErroneas(arrayLetrasIncorrectas)
            }
            dibujarAhorcado;
        }
        verificarFinGanador();
        verificarFinPerdedor();
    }
});
//--------dibuja las letras que no estan en la palabra sorteada
function dibujarLetrasErroneas(letrasIncorrectas) {
    var inicioX = 400;
    var inicioY = 200;
    pincel.fillStyle = "red";
    pincel.font = "20px Georgia";
    pincel.fillText("letras erroneas " + letrasIncorrectas.toString(), inicioX, inicioY);
}
//--------comprueba si el juego ha terminado con resultado positivo
function verificarFinGanador() {
    let palabraOriginalsinLetrasRepetidas = letrasUnicas.sort().toString();
    let letrasErroneasIngresadas = arrayLetrasCorrectas.sort().toString();
    if (palabraOriginalsinLetrasRepetidas == letrasErroneasIngresadas) {
        pincel.fillStyle = "lightgreen";
        pincel.font = "50px Georgia";
        pincel.fillText("GANASTE!", 600, 400);
        juegoIniciado = false;
        letrasUnicas = [];
    }
}
//--------comprueba si el juego ha terminado con resultado negativo
function verificarFinPerdedor() {
    if (arrayLetrasIncorrectas.length > 5) {
        pincel.fillStyle = "black";
        pincel.font = "50px Georgia";
        pincel.fillText("PERDISTE!", 600, 400);
        juegoIniciado = false;
        alert("la palabra era " + palabraSorteada);
        letrasUnicas = [];
    }
}

//--------dibuja la pieza del ahorcado correspondiente segun la cantidad de errores
function dibujarAhorcado() {
    let letras = arrayLetrasIncorrectas.length;
    switch (letras) {
        case 1:
            cabeza();
            break;
        case 2:
            cuerpo();
            break;
        case 3:
            brazoDerecho();
            break;
        case 4:
            brazoIzquierdo();
            break;
        case 5:
            piernaDerecha();
            break;

        case 6:
            piernaIzquierda();
            break;
    }
}
