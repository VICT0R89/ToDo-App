/* ---------------------------------- variables para validar --------------------------------- */

const regExp = {
  regTexto : /^[a-zA-ZÀ-ÿ\s]{3,20}$/,
  regEmail : /^[a-zA-Z0-9_.+-]+@[a-zA-Z]+\.[a-zA-Z]{2,13}$/,
  regContrasenia : /^[a-zA-Z\d!@#$%^&*()_+]{8,12}$/
};
const { regTexto, regEmail, regContrasenia } = regExp;

let errores = {
  nombreError : "Solo letras, con un mínimo de 3.",
  apellidoError : "Solo letras, con un mínimo de 3.",
  emailError : "Usuario o contraseña incorrecto",
  passwordError : "Entre 8 y 12 caracteres.",
  passwordError2 : "La contraseña es incorrecta.",
  passwordRepetidoError : "Sus contraseñas no coinciden."
};

/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
  return regTexto.test(texto);
}

function normalizarTexto(texto) {
  return texto.toLowerCase();
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
  return regEmail.test(email);
}

function normalizarEmail(email) {
  return email.toLowerCase();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
  return regContrasenia.test(contrasenia);
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
  return contrasenia_1 === contrasenia_2; 
}

/* -------------------------------- validar datos -------------aa11!!AA------------------- */

const validarDatosUsuario = datos => {
  let { nombre, apellido, email, password, password2 } = datos;
  let validarDatos = {
    nombreOk : false,
    apellidoOk : false,
    emailOk : false,
    passwordOk : false
  };
  const settings = {
    firstName:"",
    lastName:"",
    email:"",
    password:""
  }
    validarTexto(nombre) ? (settings.firstName = normalizarTexto(nombre), validarDatos.nombreOk = true) : mostrarErrores("nombre"),
    validarTexto(apellido) ? (settings.lastName = normalizarTexto(apellido), validarDatos.apellidoOk = true): mostrarErrores("apellido"),
    validarEmail(email) ? (settings.email = normalizarEmail(email), validarDatos.emailOk = true) : mostrarErrores("email"),
    validarContrasenia(password) ? 
      (compararContrasenias(password, password2) ? 
        (validarDatos.passwordOk = true, settings.password = password) 
      : mostrarErrores("pass2")
        ) 
    : mostrarErrores("pass1")

  return validarDatos.nombreOk && 
  validarDatos.apellidoOk && 
  validarDatos.emailOk && 
  validarDatos.passwordOk ? 
  settings 
  : false;
}

/* -------------------------------- mostrar errores -------------aa11!!AA------------------- */

const mostrarErrores = caso => {
  let { nombreError, apellidoError, emailError, passwordError, passwordRepetidoError } = errores
  switch (caso) {
    case "nombre":
      inputNombre.classList.add("error")
      inputNombre.value = ""
      inputNombre.setAttribute("placeholder", `${nombreError}`)
      break;
    case "apellido":
      inputApellido.classList.add("error")
      inputApellido.value = ""
      inputApellido.setAttribute("placeholder", `${apellidoError}`)
      break;
    case "email":
      inputEmail.classList.add("error")
      inputEmail.value = ""
      inputEmail.setAttribute("placeholder", `${emailError}`)
      break;
    case "pass1":
      inputPassword.classList.add("error")
      inputPassword.value = ""
      inputPassword.setAttribute("placeholder", `${passwordError}`)
      break;
    case "pass2":
      inputPasswordRepetida.classList.add("error")
      inputPasswordRepetida.value = ""
      inputPasswordRepetida.setAttribute("placeholder", `${passwordRepetidoError}`)
      break;
  }
}

// FUNCIONES PARA ACTIVAR Y DESACTIVAR BOTONES

const btnOn = id => {
  const btn = document.querySelector(`${id}`)
  btn.removeAttribute("disabled");
  btn.classList.remove("active")
}
const btnOff = id => {
  const btn = document.querySelector(`${id}`)
  btn.setAttribute("disabled", true);
  btn.classList.add("active")
}

/* ----------------------------------------------------------------- */
/*                    FUNCIÓN cambiarClase                           */
/* ----------------------------------------------------------------- */

const cambiarClase = e => {
  let element = e.target;
  if (element.classList.contains("error")) {
    element.classList.remove("error");
  }
}