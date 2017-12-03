
var ricerca="";
var idRistoranti=[];
var nRequest=[];
var risultato="";

function init() {
    if (localStorage.searchRecord) {
        ricerca = JSON.parse(localStorage.searchRecord);
    }

    if (localStorage.idRistoranti) {
        idRistoranti = JSON.parse(localStorage.idRistoranti);
        ricercaDati(idRistoranti);
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

//Log-out dal proprio account
function esci_account(){
  sessionStorage.removeItem("user");
  document.write(" ");
  window.location.href = "index.html";
}

function ricercaDati(elencoId){
      risultato+="<h3>Risultato Ricerca '"+ricerca+"': </h3> <br>"
      for(var i=0;i<elencoId.length;i++){

          (function(i) {
              nRequest[i] = new XMLHttpRequest();
              nRequest[i].open("GET", 'http://159.149.70.50:18080/restaurants/'+elencoId[i], true);
              nRequest[i].onreadystatechange = function () {
                 if (nRequest[i].readyState === 4) {
                    if (nRequest[i].status === 200) {
                      var ristorante = JSON.parse(nRequest[i].responseText);
                      verificaRistorante(ristorante,i);
                    } else {
                      console.log("Error", nRequest[i].statusText);
                    }
                 }
              };
              nRequest[i].send(null);
          })(i);
      }
}


function verificaRistorante(ristorante,i){

  if(ristorante!=null){

    //ricerca
    var split_ricerca=ricerca.toLowerCase().split(" ");
    var split_ristorante=ristorante.nome.toLowerCase().split(" ");

    //parole ristorante
    for(j=0;j<split_ristorante.length;j++){
      //parole ricerca
      for(k=0;k<split_ricerca.length;k++){
        //tipologie
        for(x=0;x<ristorante.tipologia.length;x++)
          if( split_ristorante[j]==split_ricerca[k] || split_ricerca[k]==ristorante.citta.toLowerCase() || split_ricerca[k]==ristorante.tipologia[x].toLowerCase() || ricerca.toLowerCase()=="" ){
            risultato+='<a id="'+i+'" href="#" onclick="Reindirizzamento(id);">'+ristorante.nome+'</a><br><br><br>';
            j=split_ristorante.length;
            k=split_ricerca.length;
            x=ristorante.tipologia.length;
          }
      }
    }
  }
  stampa_risultato();
}

function stampa_risultato(){
  var divRisultatoRicerca=document.getElementById("risultato_ricerca");
  divRisultatoRicerca.innerHTML=risultato;
}

function Reindirizzamento(id) {
    localStorage.ristorante = JSON.stringify(id);
    window.location.href = 'ristorante.html';
}
