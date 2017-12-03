var ricerca="";
var idRistoranti=[];
var nRequest=[];

function init() {
    if(!sessionStorage.user){
      window.location.href = 'index.html';
    }
    if (localStorage.searchRecord) {
        ricerca = JSON.parse(localStorage.searchRecord);
    }

    lista_prenotazioni();
}

function searchArea() {

                if(document.getElementById("search_value") !== null){
                  var search = document.getElementById("search_value").value;
                }else {
                  var search="";
                }
                localStorage.searchRecord = JSON.stringify(search);
                window.location.href = 'search.html';



}

//Log-out dal proprio account
function esci_account(){
  sessionStorage.removeItem("user");
  document.write(" ");
  window.location.href = "index.html";
}


function lista_prenotazioni(){
  var prenotazioni_utente=[];
  if(localStorage.prenotazioni){
    prenotazioni_utente=cerca_prenotazioni_utente();
  }

  var user=JSON.parse(sessionStorage.user);



  var divDettagliPrenotazioni=document.getElementById("dettagli_prenotazioni");


  var lista="";
  var date = new Date();
  var month=date.getMonth()
  var day = date.getUTCDate();
  var month_name = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  //document.write(day);

  for(var i=0;i<prenotazioni_utente.length;i++){
    prenotazione=prenotazioni_utente[i];
    //console.log(prenotazione.id);
    if(prenotazione.giorno>=day+1 || month_name.indexOf(prenotazione.mese)>month_name.indexOf(month_name[month])){
      lista+="<b style='color: red; font-size:20px'>Prenotazione "+(i+1)+"</b><br>"
      +"Ristorante:"+prenotazione.ristorante+"<br>"
          +"Giorno: "+prenotazione.giorno+" "+prenotazione.mese+"<br>"
          +"Orario: "+prenotazione.orario+"<br>"
          +"Posti: "+prenotazione.posti+"<br>"
          +"<button onclick='elimina_prenotazione("+prenotazione.id+")'>Annulla Prenotazione</button><br><br><br>";
    }else{
      lista+="- Ristorante:"+prenotazione.ristorante+"<br>"
          +"Giorno: "+prenotazione.giorno+" "+prenotazione.mese+"<br>"
          +"Orario: "+prenotazione.orario+"<br>"
          +"Posti: "+prenotazione.posti+"<br><br><br>";
    }
  }
  divDettagliPrenotazioni.innerHTML="<div id='profilo_p_right'>"
      +"<h3>Nome: "+user.nome+"</h3>"
      +"<h3>Cognome: "+user.cognome+"</h3>"
      +"<button onclick='elimina_account()'>Elimina Account</button>"
      +"</div>"
      +"<div id='profilo_p_left'><h2>Lista Prenotazioni Effettuate</h2>"+lista+"</div>";
  //document.write("ciao");
  //localStorage.removeItem("prenotazioni");
}

//ELIMINA l'account e tutte le sue relative prenotazioni
function elimina_account(){
  var users = JSON.parse(localStorage.getItem("users") || "[]");
  var user=JSON.parse(sessionStorage.user);

  for(var i=0;i<users.length;i++){
    if(users[i].username == user.username){
      users.splice(i, 1);
      localStorage.setItem("users", JSON.stringify(users));
      elimina_all_prenotazioni();
    }
  }
}

function cerca_prenotazioni_utente(){
  var prenotazioni = JSON.parse(localStorage.getItem("prenotazioni") || "[]");
  var prenotazioni_utente=[];
  var user=JSON.parse(sessionStorage.user);

  for(var i=0;i<prenotazioni.length;i++){
    var utente_prenotazione=JSON.parse(prenotazioni[i].utente);

    if(utente_prenotazione.username==user.username){
      prenotazioni_utente.push(prenotazioni[i]);
    }
  }

  return prenotazioni_utente;
}

function elimina_prenotazione(id){
  var prenotazioni = JSON.parse(localStorage.getItem("prenotazioni") || "[]");

  for(var i=0;i<prenotazioni.length;i++){
    if(prenotazioni[i].id == id){
      prenotazioni.splice(i, 1);
      break;
    }
  }

  localStorage.setItem("prenotazioni", JSON.stringify(prenotazioni));
  window.location.href = "profilo.html";
}

//Elimina tutte le prenotazioni del dato account (viene richiamato soltanto in caso di eliminazione dell'account)
function elimina_all_prenotazioni(){
  prenotazioni=JSON.parse(localStorage.getItem("prenotazioni") || "[]");
  user=JSON.parse(sessionStorage.user);
  document.write(prenotazioni.length+"<br>")
  for(var i=0;i<prenotazioni.length;i++){
      document.write(i+"<br>");
      utente_prenotazione=JSON.parse(prenotazioni[i].utente);
      if(utente_prenotazione.username == user.username){
        prenotazioni.splice(i, 1);
        i--;
      }
  }
  localStorage.setItem("prenotazioni", JSON.stringify(prenotazioni));
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
}
