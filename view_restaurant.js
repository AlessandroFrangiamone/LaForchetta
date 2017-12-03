
var ricerca="";
var id_ristorante="";
var idRistoranti=[];
var nRequest=[];
var nome_ristorante="";
var posti=0;

function init() {
    if (localStorage.ristorante) {
        id_ristorante = JSON.parse(localStorage.ristorante);
    }

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
      for(var i=0;i<elencoId.length;i++){

          (function(i) {
              nRequest[i] = new XMLHttpRequest();
              nRequest[i].open("GET", 'http://159.149.70.50:18080/restaurants/'+elencoId[i], true);
              nRequest[i].onreadystatechange = function () {
                 if (nRequest[i].readyState === 4) {
                    if (nRequest[i].status === 200) {
                      var ristorante = JSON.parse(nRequest[i].responseText);
                      cercaRistorante(ristorante,i);
                    } else {
                      console.log("Error", nRequest[i].statusText);
                    }
                 }
              };
              nRequest[i].send(null);
          })(i);
      }
}


function controllaLog(){
  if(!sessionStorage.user){
    document.getElementById("calendar-month-year").innerHTML="Effettua il Login per prenotare";
  }else{
    //Crea il calendario di prenotazione soltanto se un utente ha effettuato il login altirmenti non è possibile prenotare
    crea_calendario(0);
  }
}

/*

  Creazione Calendario

*/


//Variabili per il calendario
var month_name;
var month_name_ITA;
var month;
var counter_month=0;

function crea_calendario(x){
    var d = new Date();
    month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    month_name_ITA = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
    month = Number(d.getMonth()+x);
    if(x<1)
      var giorno_attuale = d.getDate();
    else
      var giorno_attuale = 1;
    var year = d.getFullYear();
    var first_date = month_name[month] + " " + 1 + " " + year;
    var tmp = new Date(first_date).toDateString();

    var first_day = tmp.substring(0, 3);
    var day_name = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var day_no = day_name.indexOf(first_day);
    var days = new Date(year, month+1, 0).getDate();

    var calendar = get_calendar(day_no, days, giorno_attuale);
    document.getElementById("calendar-dates").innerHTML=calendar;
    document.getElementById("calendar-month-year").innerHTML = month_name_ITA[month]+" "+year;
    if(counter_month>0)
      document.getElementById("calendar-month-year").innerHTML += "<button onclick='cambia_mese_meno()'><</button>";
    if(counter_month<2)
      document.getElementById("calendar-month-year").innerHTML += "<button onclick='cambia_mese_piu()'>></button>";
}

function cambia_mese_piu(){
    counter_month++
    crea_calendario(counter_month);
}

function cambia_mese_meno(){
    counter_month--
    crea_calendario(counter_month);
}

function get_calendar(day_no, days, giorno_attuale){
    var table = '<table>';
    var tr = '<tr>';

    //Riga per le lettere (che rappresentano i giorni)
    for(var c=0; c<=6; c++){
        var td = '<td>';
        td+= "DLMMGVS"[c];
        tr+=td;
    }
    table+=tr;

    //seconda riga, prima parte in cui faccio gli spazi per partire dal giorni n
    tr = '<tr>';
    var c;
    for(c=0; c<=6; c++){
        if(c == day_no){
            break;
        }
        var td = '<td>';
        td+= "";
        tr+=td;
    }
    //completamento della seconda riga
    var count = 1;
    for(; c<=6; c++){
        var td = '<td>';
        if(count>=giorno_attuale)
          td+= "<button id="+count+" onclick='Dettagli_Prenotazione(id)'>"+count+"</button>";
        else
          td+= count;

        count++;
        tr+=td;
    }
    table+=tr;

    //completamento delle righe/giorni restanti del mese
    for(var r=3; r<=7; r++){
        tr = '<tr>';
        for(var c=0; c<=6; c++){
            if(count > days){
                table+=tr;
                return table;
            }
            var td = '<td>';
            if(count>=giorno_attuale)
              td+= "<button id="+count+" onclick='Dettagli_Prenotazione(id)'>"+count+"</button>";
            else
              td+= count;
            count++;
            tr+=td;
        }
        table+=tr;
    }
    return table;
}

function Dettagli_Prenotazione(giorno){
  document.getElementById("dettagli").innerHTML="";
  document.getElementById("prenotato").innerHTML="";
  document.getElementById("dettagli").innerHTML+='Hai selezionato il giorno '+giorno+'<br><br>'
    +'Seleziona Posti: '
    +'<select name="quantita" id="posti">'
      +'<option>1</option>'
      +'<option>2</option>'
      +'<option>3</option>'
      +'<option>4</option>'
      +'<option>5</option>'
      +'<option>6</option>'
      +'<option>7</option>'
      +'<option>8</option>'
    +'</select>';

  document.getElementById("dettagli").innerHTML+="<br><br>Seleziona Ora:"
    +'<select name="orario" id="ora">'
      +'<option>19:00-21:00</option>'
      +'<option>21:00+</option>'
    +'</select>'
    +"<br><br><button onclick='Prenota("+giorno+")'>Conferma</button>";
}

function Prenota(day){

  var ora=document.getElementById("ora").options[document.getElementById("ora").selectedIndex].text;
  var nposti=document.getElementById("posti").options[document.getElementById("posti").selectedIndex].text;

  if(contaPosti(day,ora,nposti)){

    var prenotazioni=[];

    if(localStorage.prenotazioni){
      var prenotazioni = JSON.parse(localStorage.getItem("prenotazioni") || "[]");
    }

    var prenotazione = {
      utente: sessionStorage.user,
      ristorante: nome_ristorante,
      mese: month_name_ITA[month],
      giorno: day,
      orario: ora,
      posti: nposti,
      id: (prenotazioni.length)
    };
    prenotazioni.push(prenotazione);
    localStorage.setItem("prenotazioni", JSON.stringify(prenotazioni));

    document.getElementById("prenotato").innerHTML="<b id='prenotazione'>prenotato il giorno "+day+" "+month_name_ITA[month]+" all'orario "+ora+" per "+nposti+" persone (ID PRENOTAZIONE:"+(prenotazioni.length)+")</b>";
  }else{
    document.getElementById("prenotato").innerHTML="<b id='prenotazione'>- ERRORE: prenotazione NON avvenuta, il ristorante è al completo</b>"
  }
}

//Vedere quanti posti sono disponibili e se è possibile prenotare o no
function contaPosti(day,ora,nposti){
  var libero=false;
  var cont_postioccupati=0;

  var prenotazioni = JSON.parse(localStorage.getItem("prenotazioni") || "[]");

  for(var i=0;i<prenotazioni.length;i++){
    var nome_ristorante_prenotazione=prenotazioni[i].ristorante;
    var mese_ristorante_prenotazione=prenotazioni[i].mese;
    var giorno_ristorante_prenotazione=prenotazioni[i].giorno;
    var ora_ristorante_prenotazione=prenotazioni[i].orario;
    var posti_ristoranti_prenotazione=Number(prenotazioni[i].posti);

    if(nome_ristorante_prenotazione==nome_ristorante && mese_ristorante_prenotazione==month_name_ITA[month] && giorno_ristorante_prenotazione==day && ora_ristorante_prenotazione==ora){
      cont_postioccupati+=posti_ristoranti_prenotazione;
    }
  }

  if((cont_postioccupati+Number(nposti))<=posti)
    libero=true;

  //document.write(cont_postioccupati);
  cont_postioccupati=0;

  return libero;
}


/*

    Cerca Ristorante

*/
function cercaRistorante(ristorante,i){

  if(id_ristorante==i){
    var divRistorante=document.getElementById("result");

    //creazione variabile tipologia
    var tipologia="";
    for(j=0;j<ristorante.tipologia.length;j++){
      if(j!=ristorante.tipologia.length-1)
        tipologia+=ristorante.tipologia[j]+' - ';
      else
        tipologia+=ristorante.tipologia[j];
    }

    //salvo nel local storage l'oggetto gps contenente le coordinate latitudine e longitudine
    if(typeof ristorante.gps !== 'undefined')
      localStorage.gps = JSON.stringify(Object.values(ristorante.gps));

    //Variabile che controlla se ci sono oggetti menù senza indicazioni, ovvero vuoti/nulli
    var menu_nullo=0;


    var menus="";
    for(i=0;i<ristorante.menus.length;i++){
      var menu="<h2><u>"+ristorante.menus[i].menu+"</u> (prezzo:"+ristorante.menus[i].prezzo+"&euro;)</h2>";


      //bevande Menu[i]
      if(ristorante.menus[i].bevande){
        var bevande="<b>bevande: </b><br>";
        for(j=0;j<ristorante.menus[i].bevande.length;j++)
          bevande+='<br>- '+ristorante.menus[i].bevande[j];
        bevande+="<br><br>";
        menu+=bevande;
        if(ristorante.menus[i].bevande.length==1 && ristorante.menus[i].bevande[0]==""){
          menu_nullo++;
        }
      }



      //antipasti Menu[i]
      if(ristorante.menus[i].antipasti){
        var antipasti="<b>antipasti: </b><br>";
        for(j=0;j<ristorante.menus[i].antipasti.length;j++)
          antipasti+='<br>- '+ristorante.menus[i].antipasti[j];
        antipasti+="<br><br>";
        menu+=antipasti;
        if(ristorante.menus[i].antipasti.length==1 && ristorante.menus[i].antipasti[0]==""){
          menu_nullo++;
        }
      }



      //primi Menu[i]
      if(ristorante.menus[i].primi){
        var primi="<b>primi: </b><br>";
        for(j=0;j<ristorante.menus[i].primi.length;j++)
          primi+='<br>- '+ristorante.menus[i].primi[j];
        primi+="<br><br>";
        menu+=primi;
        if(ristorante.menus[i].primi.length==1 && ristorante.menus[i].primi[0]==""){
          menu_nullo++;
        }
      }



      //secondi Menu[i]
      if(ristorante.menus[i].secondi){
        var secondi="<b>secondi: </b><br>";
        for(j=0;j<ristorante.menus[i].secondi.length;j++)
          secondi+='<br>- '+ristorante.menus[i].secondi[j];
        secondi+="<br><br>";
        menu+=secondi;
        if(ristorante.menus[i].secondi.length==1 && ristorante.menus[i].secondi[0]==""){
          menu_nullo++;
        }
      }



      //dolci Menu[i]
      if(ristorante.menus[i].dolci){
        var secondi="<b>dolci: </b><br>";
        for(j=0;j<ristorante.menus[i].dolci.length;j++)
          secondi+='<br>- '+ristorante.menus[i].dolci[j];
        secondi+="<br><br>";
        menu+=secondi;
        if(ristorante.menus[i].dolci.length==1 && ristorante.menus[i].dolci[0]==""){
          menu_nullo++;
        }
      }



      //allergeni Menu[i]
      if(ristorante.menus[i].allergeni){
        var allergeni="<b>allergeni: </b><br>";
        for(j=0;j<ristorante.menus[i].allergeni.length;j++)
          if(j!=ristorante.menus[i].allergeni.length-1)
            allergeni+=ristorante.menus[i].allergeni[j]+", ";
          else
            allergeni+=ristorante.menus[i].allergeni[j];
        allergeni+="<br><br>";
        menu+=allergeni;
      }


      //sconti Menu[i]
      if(ristorante.menus[i].sconti){
        var sconti="<b>sconti: </b><br>";
        for(j=0;j<ristorante.menus[i].sconti.length;j++){
          //inserisco i valori dell'oggetto in una varibile (vettore), in modo da riuscire a gestirli più facilmente
          var sconto=Object.values(ristorante.menus[i].sconti[j]);
          sconti+=Number(sconto[0])*100+"% sconto: ";

          //Controllo se scont[2] è un array
          if(Array.isArray(sconto[2])){
          //Se lo è separo ogni suo valore con una virgola
          for(k=0;k<sconto[2].length;k++)
            if(k!=sconto[2].length-1)
              sconti+=sconto[2][k]+", ";
            else
              sconti+=sconto[2][k]+" ";
          }else{
            //Altrimenti lo stampo direttamente come valore
            sconti+=sconto[2];
          }

          sconti+="("+sconto[1]+")<br>";
        }
        sconti+="<br><br>";
        menu+=sconti;
      }

      if(menu_nullo>4){
        menu="";
      }


      menus+=menu;
    }

    //La variabile nome_ristorante serve per essere poi passata all'oggetto prenotazione dato che è una variabile globale
    nome_ristorante=ristorante.nome;

    posti=ristorante.posti;

    divRistorante.innerHTML+='<center><h1>'
    +ristorante.nome
    +'</h1></center><br><br>'


    +'<div id="ristorante_p_left">'
    +'<br><center><b>Menu: </b></center><br>'
    +menus
    +'</div>'
    +'<div id="ristorante_p_right">'
    +'Prenotazione: '
    +'<div id="calendar-container">'
    +'<div id="calendar-header"><span id="calendar-month-year"></span></div>'
    +'<div id="calendar-dates"></div>'
    +'</div>'
    +'<div id="dettagli"></div>'
    +'<p id="prenotato"></p>'

    +'<br><br>'

    +'Tipologia: '
    +tipologia
    +'<br><br>'

    +'Numero Posti: '
    +ristorante.posti
    +'<br><br>'

    +'Citta: '
    +ristorante.citta
    +'<br><br>'

    +'Fascia di Prezzo: '
    +ristorante.fascia_prezzo
    +'<br><br>'

    +'Posizione:<br><object type="text/html" data="mapRistorante.html" width="540" height="270"></object>'
    +'<br><br>'

    +'Via: '
    +ristorante.via+"</div></center><br><br>";

    controllaLog();
  }
}
