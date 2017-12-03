
function init() {
    if (localStorage.searchRecord && localStorage.searchRecord === null ){
      localStorage.removeItem(searchRecord);
    }
}

function invio(e) {
    if(e.keyCode === 13) {
      searchArea();
    }
}

function searchArea() {

                var search = document.getElementById("search_value").value;
                localStorage.searchRecord = JSON.stringify(search);

                window.location.href = 'search.html';

}

var elencoIdRistoranti = [];
var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'http://159.149.70.50:18080/restaurants');
ourRequest.onload = function() {
  if (ourRequest.status >= 200 && ourRequest.status < 400) {
      var elencoRistoranti = JSON.parse(ourRequest.responseText);
      risultatoRistoranti(elencoRistoranti);
  } else {
      console.log("We connected to the server, but it returned an error.");
  }
};
ourRequest.onerror = function() {
  console.log("Connection error");
};
ourRequest.send();

function risultatoRistoranti(elenco){
      for(var i=0;i<elenco.restaurants.length;i++){
        elencoIdRistoranti.push(elenco.restaurants[i].id);
      }
      localStorage.idRistoranti = JSON.stringify(elencoIdRistoranti);
}


/*
    LOGIN
*/
function login(){
  var username_log="";
  var password_log="";
  //username
  if( document.getElementById("login_form").elements[1] && document.getElementById("login_form").elements[1].value){
    username_log=document.getElementById("login_form").elements[1].value;
  }
  //password
  if( document.getElementById("login_form").elements[0] && document.getElementById("login_form").elements[0].value){
    password_log=document.getElementById("login_form").elements[0].value;
  }
  var trovato=false;
  if(localStorage.users){
    var users = JSON.parse(localStorage.getItem("users") || "[]");
    for(var i=0; i<users.length;i++){
      if(users[i].username==username_log && users[i].password==password_log){
        document.write("Accesso effettuato, benvenuto "+users[i].nome+" "+users[i].cognome);
        trovato=true;
        sessionStorage.setItem("user", JSON.stringify(users[i]));
        break;
      }
    }
  }

  //inizio sessione utente
  if(sessionStorage.user){
    var user=JSON.parse(sessionStorage.user);
    //sessionStorage.removeItem("user");
    window.location.href = "index.html";
  }

  if(!trovato)
    document.write("Username o password errato")

}

//Log-out dal proprio account
function esci_account(){
  sessionStorage.removeItem("user");
  document.write(" ");
  window.location.href = "index.html";
}

/*
    REGISTRAZIONE
*/
function crea_user(){
  //variabile che in seguito ci servirà per stabilire se esiste già un account con lo stesso nome
  var copia;
  //nome
  if( document.getElementById("mio_form").elements[1] && document.getElementById("mio_form").elements[1].value){
    var nomeA=document.getElementById("mio_form").elements[1].value;
  }
  //cognome
  if( document.getElementById("mio_form").elements[2] && document.getElementById("mio_form").elements[2].value){
    var cognomeA=document.getElementById("mio_form").elements[2].value;
  }
  //username
  if( document.getElementById("mio_form").elements[3] && document.getElementById("mio_form").elements[3].value){
    var usernameA=document.getElementById("mio_form").elements[3].value;
  }
  //password
  if( document.getElementById("mio_form").elements[4] && document.getElementById("mio_form").elements[4].value){
    var passwordA=document.getElementById("mio_form").elements[4].value;
  }

  //caricamento
  if(localStorage.users){
    var users = JSON.parse(localStorage.getItem("users") || "[]");
    copia=verifica_copia(users, usernameA);
  }else{
    copia=false;
    var users=[];
  }
  if(!copia){
      //modifica
      var user = {
        nome: nomeA,
        cognome: cognomeA,
        username: usernameA,
        password: passwordA
      };
      users.push(user);
      alert("Utente Numero: "+(users.length+1)+"\nBenvenuto "+user.nome+" "+user.cognome);
      elimina_all_prenotazioni(user);
      //salvataggio
      localStorage.setItem("users", JSON.stringify(users));
      window.location.href="index.html";
  }
  //localStorage.removeItem("users");
}

function verifica_copia(users, username){
  var copia=false;
  for(var i=0; i<users.length;i++){
    //document.write(users[i].nome+"-->"+i+"<br>");
    if(users[i].username==username){
      copia=true;
      alert("Utente esistente, inserire un altro username");
      break;
    }
  }
  return copia;
}

function elimina_all_prenotazioni(user){
  var prenotazioni = JSON.parse(localStorage.getItem("prenotazioni") || "[]");

  for(var i=0;i<prenotazioni.length;i++){
    var user_prenotazione=JSON.parse(prenotazioni[i].utente)

    if(user_prenotazione.username == user.username){
      prenotazioni.splice(i, 1);
      localStorage.setItem("prenotazioni", JSON.stringify(prenotazioni));
    }
  }
}
