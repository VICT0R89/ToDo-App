window.addEventListener('load', () => {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = this.document.querySelector('form');
    const inputEmail = this.document.getElementById('inputEmail')
    const inputPassword = this.document.getElementById('inputPassword')
    const btn = document.querySelector("button");
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', e => {
        e.preventDefault();
        const aux = validarEmail(inputEmail.value)
        if(aux){
            const email = normalizarEmail(inputEmail.value);
            const data = {
                email : email,
                password : inputPassword.value
            }
            const settings = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }
            realizarLogin(settings)
        } else {
            mostrarErrores("email")
        }
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
        btnOff("button")
        const url = "https://todo-api.ctd.academy/v1/users/login"
        fetch(url, settings)
        .then(response => response.json())
        .then((json)=>{
            if(json.jwt){
                localStorage.setItem('jwt', JSON.stringify(json.jwt));
                location.replace('mis-tareas.html');
            } else if (json === "Contraseña incorrecta") {
                inputPassword.classList.add("error")
                inputPassword.value = ""
                inputPassword.setAttribute("placeholder", `${errores.passwordError2}`)
            } else if (json === "El usuario no existe") {
                inputEmail.classList.add("error")
                inputEmail.value = ""
                inputEmail.setAttribute("placeholder", `${errores.emailError}`)
            }
        })
        .catch(error => {
            console.log(error);
        })
        .finally(()=>{
            btnOn("button");
        });
    };

    inputEmail.addEventListener("click", cambiarClase);
    inputPassword.addEventListener("click", cambiarClase);

});