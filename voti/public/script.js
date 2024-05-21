const cent = document.getElementById('centrale');
const bianco = "white";
const blu = "#003d7c";
let select = null;
let bott = null;

const nomiCittàcaserta = {
    "seleziona": [],
    "Aversa": ["ave1", "ave2", "ave3", "ave4"],
    "Caserta": ["cas1", "cas2", "cas3", "cas4"],
};

const nomiCittànapoli = {
    "seleziona": [],
    "Napoli": ["nap1", "nap2", "nap3", "nap4"],
    "Pompei": ["pom1", "pom2", "pom3", "pom4"]
};

function creadiv(nomi, citta, colore) {
    if (select) {
        select.remove();
    }
    if (bott) {
        bott.remove();
    }
    
    const div = document.createElement('div');
    const selezione = document.createElement('select');
    
    nomi.forEach(nome => {
        const opzione = document.createElement('option');
        opzione.text = nome;
        selezione.appendChild(opzione);
    });

    selezione.style.width = "100%";
    selezione.style.marginBottom = "10px";

    const div2 = document.createElement('div');

    selezione.addEventListener('change', function() {
        const candidati = citta[selezione.value];
        div2.innerHTML = ""; 
        candidati.forEach(can => {
            const label = document.createElement('label');
            label.textContent = can;

            const sel = document.createElement('input');
            sel.type = 'checkbox';
            sel.id = can;
            sel.value = can;
            sel.style.marginRight = "5px";
            sel.style.color = "white"; 
            sel.style.accentColor = "white";
            label.setAttribute('for', can); 
            label.style.color = "white"; 
            label.textContent = can; 
            

            sel.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach((checkbox) => {
                    if (checkbox !== sel) {
                        checkbox.checked = false;
                    }
                });
            });

            div2.appendChild(sel);
            div2.appendChild(label);
            div2.appendChild(document.createElement('br'));
        });
    });

    const bottone = document.createElement('button');
    bottone.onclick = function() {
        vota();
        tanks();
    };
    bottone.textContent = "Invia";
    bottone.style.position = "absolute";
    bottone.style.bottom = "10px";
    bottone.style.left = "50%";
    bottone.style.transform = "translateX(-50%)";

    bott = bottone;

    div.appendChild(selezione);
    div.appendChild(div2);
    div.className = "container";
    
    cent.appendChild(div);
    cent.appendChild(bottone);
    select = div;

    
    cent.style.backgroundColor = colore;
}

cent.style.width = "500px";
cent.style.height = "500px";
cent.style.position = "absolute";
cent.style.top = "30%";
cent.style.left = "40%";

function visualizzaandamento(){
    const graph = document.createElement('canvas');
    // Logica per visualizzare il grafico
}
function visualizzaTabellaVoti(){

}
function vota() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
        console.log("Nessuna selezione effettuata. Si prega di selezionare almeno una casella.");
        return;
    }
    
    const voto = checkboxes[0].value; 
    
    if (select) {
        const cityName = select.querySelector('select').value;
        fetch('/vota', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city: cityName, candidate: voto })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
                visualizzaTabellaVoti();
                tanks(); // Chiamata di tanks() qui all'interno della catena di promesse
            } else {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Errore:', error));
    } else {
        console.log("Errore: nessuna selezione di città effettuata.");
    }
}


function caserta() {
    nascondiTabellaVoti();
    const nomi = Object.keys(nomiCittàcaserta);
    creadiv(nomi, nomiCittàcaserta, blu);
}

function napoli() {
    nascondiTabellaVoti(); 
    const nomi = Object.keys(nomiCittànapoli);
    creadiv(nomi, nomiCittànapoli, blu);
}

function nascondiTabellaVoti() {
    const contenitore = document.getElementById('centrale');
    contenitore.innerHTML = ""; 
}

function tanks(){
    console.log("La funzione tanks() è stata chiamata."); // Aggiungi un messaggio di controllo per vedere se la funzione viene chiamata
    cent.innerHTML = ""; 
    const ri = document.createElement('h2');
    ri.style.backgroundColor = '#003d7c';
    ri.style.width = '500px';
    ri.style.height = '500px';
    ri.textContent = 'Grazie per aver votato!'; // Utilizza textContent invece di value per impostare il testo
    ri.style.color = 'white';
    cent.appendChild(ri);
}




