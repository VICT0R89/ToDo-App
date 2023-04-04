// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  if(!this.localStorage.getItem("jwt")){
    this.location.replace("index.html");
  }

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = this.document.getElementById("closeApp");
  const formCrearTarea = this.document.querySelector(".nueva-tarea");
  const nuevaTarea = this.document.getElementById("nuevaTarea");
  const tareasPendientes = this.document.querySelector(".tareas-pendientes");
  const tareasTerminadas = this.document.querySelector(".tareas-terminadas");
  const userName = this.document.querySelector(".user-info > p");
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const cantidadFinalizadas = this.document.getElementById("cantidad-finalizadas")

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    localStorage.removeItem("jwt");
    location.replace("index.html");
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const url = "https://todo-api.ctd.academy/v1/users/getMe";
    const settings = {
      method: 'GET',
      headers: {
        authorization : jwt,
        'Content-Type': 'application/json'
      }
    }
    fetch(url, settings)
    .then(response => response.json())
    .then(data => {
      let { firstName, lastName } = data
      userName.innerText = `${firstName} ${lastName}`
    })
  };
  obtenerNombreUsuario()


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const url = "https://todo-api.ctd.academy/v1/tasks";
    const settings = {
      method: 'GET',
      headers: {
        authorization : jwt,
        'Content-Type': 'application/json'
      }
    }
    fetch(url, settings)
    .then(response => response.json())
    .then(listado=>{
      renderizarTareas(listado);
      botonesCambioEstado(listado);
      botonBorrarTarea(listado)
    })
    .finally(()=>{
    })
  };
  consultarTareas()

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (e) {
    e.preventDefault();
    btnOff(".nueva-tarea > button")
    const url = "https://todo-api.ctd.academy/v1/tasks";
    const data = {
      description: nuevaTarea.value,
      completed: false
    }
    const settings = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        authorization : jwt,
        'Content-Type': 'application/json'
      }
    }
    fetch(url, settings)
    .then(response => response.json())
    .then(task=>{
      consultarTareas()
    })
    .catch((error)=>{
      console.log("error " + error);
    })
    .finally(()=>{
      nuevaTarea.value = ""
    })
  })
  
  //--------------formatear fecha----------------------------

  const obtnerFecha = (createdAt) =>{
    const data = new Date(createdAt);
    const fecha = data.toLocaleDateString();
    const hora = data.toLocaleTimeString();
    const fechaFormateada = `${fecha} - ${hora}`;
    return fechaFormateada
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */

  const convertirTareas = listado =>{
    const tareasConvertidas = []
    listado.forEach((tarea)=>{
      tareasConvertidas.push(JSON.parse(tarea))
    })
    return tareasConvertidas
  }

  const dividirTareas = (listado) =>{
    const tareasCompletasJson = []
    const tareasIncompletasJson = []
    listado.forEach((tarea)=>{
      let {completed} = tarea
      completed ?
      tareasCompletasJson.push(JSON.stringify(tarea)) :
      tareasIncompletasJson.push(JSON.stringify(tarea))
    });
    const tareasCompletas = convertirTareas(tareasCompletasJson);
    const tareasIncompletas = convertirTareas(tareasIncompletasJson);
    return [tareasCompletas, tareasIncompletas]
  }

  const renderizarTareasIncompletas = tareasIncompletas => {
    return (tareasPendientes.innerHTML=
      tareasIncompletas.map((tarea)=>{
        let { description, id, createdAt } = tarea
        const fecha = obtnerFecha(createdAt)
        return `
        <li class="tarea">
        <button class="change" id="${id}"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">  
        <p class="nombre">${description}</p>
        <p class="timestamp">${fecha}</p>
        </div>
        </li>
        `
      }).join("")
      )
  }

  const renderizarTareasCompletas = tareasCompletas =>{
    cantidadFinalizadas.innerHTML = tareasCompletas.length
    return (tareasTerminadas.innerHTML=
      tareasCompletas.map((tarea)=>{
        let { description, id, createdAt } = tarea
        const fecha = obtnerFecha(createdAt)
        return `
      <li class="tarea">
      <div class="hecha">
      <i class="fa-regular fa-circle-check"></i>
      </div>
      <div class="descripcion">  
          <p class="nombre">${description}</p>
          <p class="timestamp">${fecha}</p>
          <div class="cambios-estados">
          <button class="change incompleta" id="${id}" ><i class="fa-solid fa-rotate-left"></i></button>
          <button class="borrar" id="${id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
          </div>
          </li>
          `
        }).join("")
        )
  }

  function renderizarTareas(listado) {
    btnOn(".nueva-tarea > button");
    let [ tareasCompletas, tareasIncompletas ] = dividirTareas(listado);
    renderizarTareasIncompletas(tareasIncompletas)
    renderizarTareasCompletas(tareasCompletas)
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */

  const llamadaPut = (url, completed, description) => {
    const data ={
        description: description,
        completed: !completed
      }
    const config = {
      method : "PUT",
      body : JSON.stringify(data),
      headers : {
        authorization : jwt,
        'Content-Type': 'application/json'
      }
    }
    this.fetch(url, config)
    .then(response => response.json())
    .then((tarea)=>{
      consultarTareas()
    })
  }

  function botonesCambioEstado(listado) {
    const btnsChange = document.querySelectorAll('.change');
    btnsChange.forEach( btn => {
      btn.addEventListener('click', function(evento){
        let idBtn = evento.target.id
        const url = "https://todo-api.ctd.academy/v1/tasks/"+idBtn;
        listado.forEach((tarea)=>{
          let {id, completed, description} = tarea
          idBtn == id ?
          llamadaPut(url,completed,description) 
          :
          ""
        })
      })
    });
  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */

  const llamadaDelete = url => {
    const config = {
      method: "DELETE",
      headers:{
        authorization: jwt,
        'Content-Type': 'application/json'
      }
    }
    this.fetch(url, config)
    .then(()=>consultarTareas())
  }

  function botonBorrarTarea(listado) {
    const btnsChange = document.querySelectorAll('.borrar');
    btnsChange.forEach( btn => {
      btn.addEventListener('click', function(evento){
        let idBtn = evento.target.id
        const url = "https://todo-api.ctd.academy/v1/tasks/"+idBtn;
        listado.forEach((tarea)=>{
          let {id} = tarea
          idBtn == id ?
          llamadaDelete(url) 
          :
          ""
        })
      })
  });
  };

});