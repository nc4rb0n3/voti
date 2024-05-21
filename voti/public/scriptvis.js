const centrale = document.getElementById('centrale');
const sidebar = document.getElementById('sidebar');
const bianco = "white";
const blu = "#003d7c";
let select = null;
let bott = null;

centrale.style.width = "500px";
centrale.style.height = "500px";
centrale.style.position = "absolute";
centrale.style.top = "30%";
centrale.style.left = "40%";

// Funzione per caricare il foglio Excel e organizzare i dati in tabelle
function caricaExcelEOrganizzaInTabelle(nomeFileExcel, foglio, callback, titolo) {
    var percorsoExcel = nomeFileExcel + ".xlsx";
    
    var richiesta = new XMLHttpRequest();
    richiesta.open('GET', percorsoExcel, true);
    richiesta.responseType = 'arraybuffer'; // Imposta il tipo di risposta come arraybuffer per leggere il file Excel
    richiesta.onload = function() {
        var arrayBuffer = richiesta.response;
        if (arrayBuffer) {
            var data = new Uint8Array(arrayBuffer);
            var workbook = XLSX.read(data, {type: 'array'}); // Legge il file Excel
            var sheet = workbook.Sheets[foglio];
            if (sheet) {
                callback(sheet, titolo); // Passa il foglio e il titolo al callback
            } else {
                console.error("Il foglio " + foglio + " non esiste nel file Excel.");
            }
        }
    };
    richiesta.send();
}

function visualizzaDati(sheet, titolo) {
    var range = XLSX.utils.decode_range(sheet['!ref']); // Ottiene il range del foglio

    centrale.innerHTML = ""; // Cancella il contenuto del div centrale

    // Aggiunge il titolo prima di visualizzare i voti
    var titoloElement = document.createElement('h2');
    titoloElement.textContent = titolo;
    centrale.appendChild(titoloElement);

    // Array per memorizzare i dati delle celle della colonna dei voti
    var votes = [];

    for (var R = range.s.r; R <= range.e.r; ++R) {
        var cell_address = { c: 1, r: R }; // Assumendo che la colonna dei voti sia la seconda colonna (indice 1)
        var cell_ref = XLSX.utils.encode_cell(cell_address);
        var cell = sheet[cell_ref];

        if (cell) {
            votes.push({ value: cell.v, row: R }); // Aggiunge il valore della cella e l'indice di riga all'array dei voti
        }
    }

    // Ordina i voti in modo discendente
    votes.sort(function(a, b) {
        return b.value - a.value; // Inverti l'ordine per ottenere un ordinamento discendente
    });

    // Aggiungi i voti ordinati alla pagina
    for (var i = 0; i < votes.length; i++) {
        var R = votes[i].row;
        var rowDiv = document.createElement('div'); // Crea un div per la riga
        rowDiv.style.display = "flex"; // Usa flexbox per allineare le celle orizzontalmente
        
        for (var C = range.s.c; C <= range.e.c; ++C) {
            var cell_address = { c: C, r: R };
            var cell_ref = XLSX.utils.encode_cell(cell_address);
            var cell = sheet[cell_ref];

            if (cell) {
                var span = document.createElement('span'); // Crea un elemento span
                span.textContent = cell.v; // Mostra il valore della cella
                span.style.display='flex';
                span.style.marginRight = "10px"; // Aggiungi uno spazio tra le celle
                span.style.left='0';
                span.style.top='0';
                span.style.marginRight='10px'
                rowDiv.appendChild(span); // Aggiungi lo span al div della riga
            }
        }
        
        centrale.appendChild(rowDiv); // Aggiungi il div della riga al div centrale
    }
    
    // Modifica lo stile del contenitore centrale
    centrale.style.display='flex';
    centrale.style.flexDirection = 'column'; // Imposta la direzione flessibile su colonna per posizionare il titolo sopra le celle
    centrale.style.backgroundColor = "#003d7c";
    centrale.style.color = 'white';
    centrale.style.alignItems = 'flex-start';
    centrale.style.fontSize='30px';
}



// Funzione per visualizzare i voti di una città specifica
function visualizzaVoti(foglio) {
    caricaExcelEOrganizzaInTabelle("votazioni", foglio, visualizzaDati, foglio);
}

function creabottoni(nome, ar) {
    const arraynapoli = ["Napoli","pompei"];
    const arraycaserta = ["Aversa","Caserta"];
      sidebar.innerHTML='';
    if (nome === "napoli") {
        for (let i = 0; i < ar.length; i++) {
            const b = document.createElement('a');
            b.textContent = ar[i]; // Imposta il testo del bottone
            b.style.width='100%';
            b.style.height='50px';
            b.style.color='white';
            b.href = "#"; // Aggiungi un link per renderlo cliccabile
            b.style.display = "block"; // Assicurati che ogni bottone sia su una nuova linea
            b.className='bottoneside';
            b.onclick = function() {
                vis(ar[i])
            }
            sidebar.appendChild(b);
        }
    } else if (nome === "caserta") {
        for (let i = 0; i < ar.length; i++) {
            const b = document.createElement('a');
            b.textContent = ar[i]; // Imposta il testo del bottone
            b.style.width='100%';
            b.style.height='50px';
            b.style.color='white';
            b.href = "#"; // Aggiungi un link per renderlo cliccabile
            b.style.display = "block"; // Assicurati che ogni bottone sia su una nuova linea
            b.className='bottoneside';
            b.onclick = function() {
                vis(ar[i])
            }
            sidebar.appendChild(b);
        }
    }

}

function vis(nom){
    centrale.innerHTML='';
    const nomeFileExcel = "votazioni";
    visualizzaVoti(nom);
}


// Funzione per visualizzare i voti di Caserta
function caserta() {
    const arraycaserta = ["Aversa","Caserta"];
    creabottoni("caserta",arraycaserta);
   
}

// Funzione per visualizzare i voti di Napoli
function napoli() {
    const arraynapoli = ["Napoli","Pompei"];
    creabottoni("napoli",arraynapoli);
}


//const nomeFileExcel = "votazioni"; // Nome del file Excel da cercare
//visualizzaVoti("Caserta");

//const nomeFileExcel = "votazioni"; // Nome del file Excel da cercare
//visualizzaVoti("Napoli");