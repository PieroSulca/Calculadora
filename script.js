const body = document.querySelector("body");
const themeToggler = document.querySelector(".theme-toggler");
const display = document.querySelector(".display");
const operando = document.querySelector(".operando");
const parcial = document.querySelector(".parcial");
const buttons = document.querySelectorAll("button");
const historialBtn = document.querySelector(".historial-btn");
const historial = document.querySelector(".historial");
const calculadora = document.querySelector(".calculadora");
const historialTitle = document.querySelector(".historial-title");
const historialBorar = document.querySelector(".historial-borrar");
const historialStringStorage = localStorage.getItem("calculadora_historial");
const historialStorage = JSON.parse(historialStringStorage);

// inicar arreglos con el storage si hay elementos
const operandoArr = historialStorage
  ? Object.values(historialStorage).map((item) => item.operacion)
  : [];

const parcialArr = historialStorage
  ? Object.values(historialStorage).map((item) => item.resultado)
  : [];

if (historialStorage !== null) {
  historialStorage.forEach((e) => {
    const añadir = `<div class="historial-display">
                          <div class="operando-historial">${e.operacion}</div>
                          <div class="parcial-historial">${e.resultado}</div>
                        </div>`;
    historial.innerHTML = añadir + historial.innerHTML;
  });
}

themeToggler.addEventListener("click", () => {
  body.classList.toggle("dark");
});

let seIgualo = false;
let operador = false;
let parentesisCerrado = true;
const operadores = ["+", "-", "*", "/"];

buttons.forEach((e) => {
  e.onclick = () => {
    if (e.id == "limpiar") {
      operando.innerHTML = "";
      parcial.innerHTML = "";
      operador = false;
      parentesisCerrado = true;
    } else if (e.id == "retroceder") {
      let digitado = operando.innerHTML;
      operando.innerHTML = digitado.substr(0, digitado.length - 1);
      parentesisCerrado = true;
      let elementos = operando.innerHTML.split("");
      let operadoresEncontrados = elementos.filter((e) => {
        return operadores.includes(e);
      });
      if (
        !operadores.includes(operando.innerHTML.slice(-1)) &&
        operando.innerHTML != "" &&
        operadoresEncontrados > 1
      ) {
        parcial.innerHTML = eval(operando.innerHTML);
      } else if (operadores.includes(operando.innerHTML.slice(-1))) {
        if (operadoresEncontrados.length < 2) {
          parcial.innerHTML = "";
        } else {
          const sinUltimoOperando = operando.innerHTML.slice(0, -1);
          parcial.innerHTML = eval(sinUltimoOperando);
        }
      }
    } else if (operando.innerHTML != "" && e.id == "igual") {
      if (seIgualo === false) {
        if (parentesisCerrado == false) {
          parcial.innerHTML = "Format Error!";
          setTimeout(() => (parcial.innerHTML = ""), 1500);
        } else {
          const operandoAux = operando.innerHTML;
          resultado = eval(operando.innerHTML);
          const añadir = `<div class="historial-display">
                            <div class="operando-historial">${operandoAux}</div>
                            <div class="parcial-historial">${resultado}</div>
                          </div>`;
          historial.innerHTML = añadir + historial.innerHTML;
          operandoArr.push(operandoAux);
          parcialArr.push(resultado);
          const historialArr = operandoArr.map((op, i) => {
            return { operacion: op, resultado: parcialArr[i] };
          });
          // Convertir el historial a una cadena de texto utilizando JSON.stringify()
          const historialString = JSON.stringify(historialArr);
          // Guardar el historial en localStorage utilizando localStorage.setItem()
          localStorage.setItem("calculadora_historial", historialString);
          operando.innerHTML = resultado;
          parcial.innerHTML = "";
          operador = false;
          seIgualo = true;
        }
      }
    } else if (operando.innerHTML == "" && e.id == "igual") {
      parcial.innerHTML = "Empty!";
      setTimeout(() => (parcial.innerHTML = ""), 1500);
    } else {
      // si es numero o operacion
      if (operadores.includes(e.innerHTML)) {
        if (operando.innerHTML != "" && operando.innerHTML.slice(-1) != "(") {
          let ultimo = operando.innerHTML.slice(-1);
          if (ultimo != e.innerHTML) {
            if (operadores.includes(ultimo)) {
              operando.innerHTML = operando.innerHTML.slice(0, -1);
            }
            operando.innerHTML += e.innerHTML;
          }
          operador = true;
        }
      } else if (e.innerHTML == "(") {
        parentesisCerrado = false;
        if (operadores.includes(operando.innerHTML.slice(-1))) {
          operando.innerHTML += e.innerHTML;
          parcial.innerHTML = "";
        } else if (operando.innerHTML == "") {
          operando.innerHTML += e.innerHTML;
          parcial.innerHTML = "";
        } else {
          operando.innerHTML += e.innerHTML;
          const ultimoParentesisIzq = operando.innerHTML.lastIndexOf("(");
          const antesParentesis = operando.innerHTML.slice(
            0,
            ultimoParentesisIzq
          );
          const despuesParentesis = operando.innerHTML.slice(
            ultimoParentesisIzq,
            operando.innerHTML.length
          );
          const cambiarContenido = antesParentesis + "*" + despuesParentesis;
          operando.innerHTML = cambiarContenido;
          parcial.innerHTML = "";
        }
      } else if (e.innerHTML == ")") {
        parentesisCerrado = true;
        operando.innerHTML += e.innerHTML;
        parcial.innerHTML = eval(operando.innerHTML);
      } else {
        if (operando.innerHTML.slice(-1) == ")") {
          operando.innerHTML += "*";
        }
        if (seIgualo === true) {
          operando.innerHTML = "";
          operando.innerHTML += e.innerHTML;
        } else {
          operando.innerHTML += e.innerHTML;
        }
        if (operador === true) {
          if (parentesisCerrado === true) {
            parcial.innerHTML = eval(operando.innerHTML);
          }
        }
      }
      seIgualo = false;
    }
  };
});

historialBtn.addEventListener("click", () => {
  historial.classList.toggle("historial-abierto");
  display.classList.toggle("display-historial-abierto");
  historialTitle.classList.toggle("historial-title-historial-abierto");
  calculadora.classList.toggle("calculadora-historial-abierto");

  const historialDisplays = document.querySelectorAll(".historial-display");
  historialDisplays.forEach((display) => {
    display.classList.toggle("historial-display-abierto");
  });
});

historialBorar.addEventListener("click", () => {
  localStorage.clear();
  historial.innerHTML = "";
});
