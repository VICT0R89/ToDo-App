window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector('form');
    const inputNombre = document.getElementById('inputNombre');
    const inputApellido = document.getElementById('inputApellido');
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const inputPasswordRepetida = document.getElementById('inputPasswordRepetida');
    const inputGenerarPass = this.document.getElementById('inputGenerarPass');
    const passGenerado = this.document.getElementById('passGenerado');
    const cantDigitos = this.document.getElementById('cantDigitos')
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

    const generarPassword = size => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let pass = ""
        for (let i = 0; i < size; i++) {
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            console.log(randomChar);
            pass += randomChar;
            console.log(pass);
        }
        console.log(pass);
        return pass;
    }

    const generarPass = () => {
        const size = cantDigitos.value 
        const newPass = generarPassword(size)
        inputPassword.value = newPass
        inputPasswordRepetida.value = newPass
        inputGenerarPass.value = "guarda tu password!"
        passGenerado.classList.add("msj")
        passGenerado.innerText = newPass
    }

    inputNombre.addEventListener('click', cambiarClase);
    inputApellido.addEventListener('click', cambiarClase);
    inputEmail.addEventListener('click', cambiarClase);
    inputPassword.addEventListener('click', cambiarClase);
    inputPasswordRepetida.addEventListener('click', cambiarClase);
    inputGenerarPass.addEventListener('click', generarPass);

});
