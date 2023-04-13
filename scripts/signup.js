window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector('form');
    const inputNombre = document.getElementById('inputNombre');
    const inputApellido = document.getElementById('inputApellido');
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const inputPasswordRepetida = document.getElementById('inputPasswordRepetida');
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const datos = {
            nombre : inputNombre.value,
            apellido : inputApellido.value,
            email : inputEmail.value,
            password : inputPassword.value,
            password2 : inputPasswordRepetida.value
        }
        const settings = validarDatosUsuario(datos)
        realizarRegister(settings);
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    async function realizarRegister(settings) {
        if (!settings){return}
        btnOff("button");
        const url = "https://todo-api.ctd.academy/v1/users"
        const config = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings),
        }
        const response = await fetch(url, config)
        const json = await response.json()
        if(json.jwt){
            localStorage.setItem('jwt', JSON.stringify(json.jwt));
            location.replace('mis-tareas.html');
        } else if (json === "El usuario ya se encuentra registrado") {
            inputEmail.classList.add("error")
            inputEmail.value = ""
            inputEmail.setAttribute("placeholder", `${errores.emailError}`)
        }
        btnOn("button");
    };

    inputNombre.addEventListener('click', cambiarClase);
    inputApellido.addEventListener('click', cambiarClase);
    inputEmail.addEventListener('click', cambiarClase);
    inputPassword.addEventListener('click', cambiarClase);
    inputPasswordRepetida.addEventListener('click', cambiarClase);

});
