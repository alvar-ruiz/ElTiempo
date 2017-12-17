
"use strict";

var tiempos;

// Función que comunica de forma asíncrona con la API de OpenWeatherMap y recibe l ainformación en un objeto JSON:
function recogerDatos() {
    
    var peticion = new XMLHttpRequest(),
        url = "https:api.openweathermap.org/data/2.5/forecast?q=Alcobendas,es&lang=es&units=metric&appid=9a6f55ccc997272bb9d7bcb47f35bdab";
        //https://api.openweathermap.org/data/2.5/forecast/daily?q=Alcobendas&cnt=5&mode=json&units=metric&appid=479092b77bcf850403cb2aeb1a302425
    peticion.onreadystatechange = function () {
        if (peticion.readyState === 4) {
            if (peticion.status === 200) {
                tiempos = crearTiempos(filtrarTiempos(peticion.response));
                crearBotones(tiempos);
            } else {
                mostrarError(peticion.status, peticion.statusText);
            }
        }
    };
        
    peticion.responseType = "json";
    peticion.open("POST", url, true);
    
    peticion.send();
}

function filtrarTiempos(infoTiempos) {
    var arrTiempos = infoTiempos.list;
    var hora = devolverHora(arrTiempos[0].dt_txt);
    return arrTiempos.filter(tiempo => devolverHora(tiempo.dt_txt) == hora);
}

function crearTiempos(infoTiempos) { 
    
    return infoTiempos.map(tiempo => {
        return new Tiempo(
            devolverHora(tiempo.dt_txt),
            devolverFecha(tiempo.dt_txt),
            tiempo.main.temp,
            tiempo.weather[0].description,
            tiempo.clouds.all,
            tiempo.rain ? tiempo.rain["3h"] : 0,
            tiempo.snow ? tiempo.snow["3h"] : 0,
            tiempo.main.humidity,
            tiempo.wind.speed,
            tiempo.main.pressure,
            "http://openweathermap.org/img/w/".concat(tiempo.weather[0].icon, ".png")
        );
    });
}

function crearBotones(tiempos) {
    
    var principal =  document.getElementById("principal"),
        contTiempo,
        contInfo,
        boton,
        hora = tiempos[0].hora,
        titulo = document.createElement("p");
    
    titulo.innerHTML = "Previsión meteorológica para los próximos 5 días a las ".concat(hora, " :");
    principal.appendChild(titulo);
    
    tiempos.forEach((tiempo, index) => {
        contTiempo = document.createElement("div");
        contInfo = document.createElement("div");
        contInfo.setAttribute("id", index);
        contInfo.setAttribute("class", "contInfo");
        boton = document.createElement("button");
        boton.setAttribute("onclick", "mostrarTiempo(" + index + ")");
        boton.innerHTML = tiempo.fecha.concat(" - ", tiempo.hora, "   &#9654;   ", tiempo.temp, " - ", tiempo.descripcion);
        contTiempo.appendChild(boton);
        contTiempo.appendChild(contInfo);
        principal.appendChild(contTiempo);
    });
}

function mostrarTiempo(i) {
    
    // Capturo el contenedor en el que está el botón que ha lanzado el evento:
    var contTiempo = document.getElementById(i); 
    
    if (!contTiempo.hasChildNodes()) {
        
        var tiempo = tiempos[i],
            parrafo,
            texto,
            param;
        
        // Creo un contenedor que contendrá la información del tiempo:
        var contInfo = document.createElement("div");
        // Creo un contenedor que contendrá la temperatura y el icono:
        var contTempIcono = document.createElement("div");
        // Creo un contenedor que contendrá la temperatura:
        var contTemp = document.createElement("div");
        contTemp.innerHTML = tiempo.temp;
        // Creo un contenedor que contendrá el icono y le añado la imagen:
        var contIcono = document.createElement("div");
        var icono = document.createElement("img");
        icono.setAttribute("src", tiempo.url_icono);
        contIcono.appendChild(icono);
        // Añado la temperatura y la imagen a su contentdor padre:
        contTempIcono.appendChild(contTemp);
        contTempIcono.appendChild(contIcono);

        // Creo el contenedor que contendrá el resto de parámetros:
        var contParam = document.createElement("div");

        // Le añado el resto de parámetros:
        parrafo = parrafo = document.createElement("p");
        parrafo.innerHTML = tiempo.descripcion;
        contParam.appendChild(parrafo);

        param = [
            ["nubosidad", "Nubosidad"], 
            ["precipitacion", "Precipitación"], 
            ["humedad", "Humedad"], 
            ["viento", "Viento"], 
            ["presion", "Presión"]
        ];

        param.forEach(p => {
            parrafo = document.createElement("p");
            texto = document.createTextNode(p[1].concat(": ", tiempo[p[0]]));
            parrafo.appendChild(texto);
            contParam.appendChild(parrafo);
        });

        contTiempo.appendChild(contTempIcono);
        contTiempo.appendChild(contParam);
        
    } else {
        contTiempo.innerHTML = "";
    }
}

function mostrarError(status, statusText) {
    var principal = document.getElementById("principal"),
        parrafo = document.createElement("p");
    parrafo.innerHTML = "Lo sentimos, se ha producido un error: ".concat(status, " ", statusText);
    principal.appendChild(parrafo);
}


// Funciones Auxiliares

function devolverHora(fechaHoraTxt) {
    return fechaHoraTxt.split(" ")[1].substr(0, 5);
}

function devolverFecha(fechaHoraTxt) {
    var arrFecha = fechaHoraTxt.split(" ")[0].split("-");
    return arrFecha.reverse().join("-");
}

function capitalizar(texto){
    return texto.split(" ").map(palabra => palabra.replace(/^[a-z]/, letra => letra.toUpperCase())).join(" ");
}



// Constructor del objeto Tiempo

function Tiempo(hora, fecha, temp, descripcion, nubosidad, lluvia, nieve ,humedad, viento, presion, url_icono) {
    this.hora = hora.toString().concat("h");
    this.fecha = fecha;
    this.temp = temp.toString().concat(" ºC");
    this.descripcion = capitalizar(descripcion);
    this.nubosidad = nubosidad.toString().concat(" %");
    this.precipitacion = lluvia ? "Está lloviendo (".concat(lluvia, " mm)") : nieve ? "Está nevando (".concat(nieve, " mm)") : "No hay precipitaciones.";
    this.humedad = humedad.toString().concat(" %");
    this.presion = presion.toString().concat(" hPa");
    this.viento = viento.toString().concat(" m/s");
    this.url_icono = url_icono;
}