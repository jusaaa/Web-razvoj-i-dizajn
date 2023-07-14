let preuzmi = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20230624 -> GetPonuda

    let url = `https://restapiexample.wrd.app.fit.ba/Ispit20230624/GetPonuda?travelfirma=${firma.value}`
    destinacije.innerHTML = '';//brisemo destinacije koje su hardkodirane (tj. nalaze se u HTML-u)
    fetch(url)
        .then(r => {
            if (r.status !== 200) {
                //greska
                return;
            }
            r.json().then(t => {

                let b = 0;
                for (const x of t.podaci) {
                    b++;
                    destinacije.innerHTML += `
                    <article class="offer">
                        <div class="akcija">${x.akcijaPoruka}</div>
                        <div  class="offer-image" style="background-image: url('${x.imageUrl}');" ></div>
                        <div class="offer-details">
                            <div class="offer-destination">${x.mjestoDrzava}</div>                                        
                        </div>

                        <div class="offer-footer">
                            <div class="offer-price">$${x.cijenaDolar}</div>
                            <div class="offer-description">${x.opisPonude}</div>
                        
                            <select id="s${b}" class="offer-option">
                            ${generisiOpcije(x)}
                                </select>          
                            <div class="ponuda-dugme" onclick="odaberiPonudu('${x.mjestoDrzava}',this.parentElement.querySelector('select').value,${x.cijenaDolar})">Odaberi</div>
                        </div>
                    </article>
                `
                }
            })
        })
}

let odaberiPonudu=(destinacija,soba,cijena)=>{
    document.getElementById("destinacija").value=destinacija;
    document.getElementById("soba").value=soba.split("+")[0];

    let cijenaPoGostu=parseFloat(cijena);
    let cijenaDoplate=parseFloat(soba.split("+")[1].slice(1));
    let ukupnaCijena=cijenaPoGostu+cijenaDoplate;

    document.getElementById("cijenaPoGostu").value=cijenaPoGostu.toFixed(2);
    document.getElementById("ukupnaCijena").value=ukupnaCijena.toFixed(2);

    let hiddenCijenaDoplate=document.getElementById("hiddenCijenaDoplate");
    hiddenCijenaDoplate.value=cijenaDoplate.toFixed(2);

}

let generisiOpcije = (x) =>{
    let s = "";
    for (const o of x.sobe) {
        s += `<option>${o.oznakaSobe}  +$${o.cijenaDoplate}</option>`
    }
    return s;
}

let ErrorBackgroundColor = "#FE7D7D";
let OkBackgroundColor = "#DFF6D8";

let posalji = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20230624 -> Add

    let s="";
    s+=test_index();
    s+=test_phone();
    if(s!==""){
        alert(s);
        return;
    }
    let jsObjekat = new Object();
    
    jsObjekat.travelFirma=document.getElementById("firma").value;
    jsObjekat.destinacijaDrzava=document.getElementById("destinacija").value;
    jsObjekat.brojIndeksa=document.getElementById("brojIndeksa").value;

    jsObjekat.gosti=[];
    document.querySelectorAll(".imeGostaClass").forEach(e => {
        jsObjekat.gosti.push(e.value);
    });

    jsObjekat.poruka=document.getElementById("messagetxt").value;
    jsObjekat.telefon=document.getElementById("phone").value;
    jsObjekat.oznakaSoba=document.getElementById("soba").value;


    let jsonString = JSON.stringify(jsObjekat);

    let url = "https://restapiexample.wrd.app.fit.ba/Ispit20230624/Add";

    //fetch tipa "POST" i saljemo "jsonString"
    fetch(url, {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(r => {
            if (r.status != 200) {
                alert("Greška" + r.status);
                return;
            }

            r.json().then(t => {
                alert("Uspješna rezervacija. Broj rezervacije je: " + t.idRezervacije);

            })

        })
}

let popuniFimeUCombox = () => {
    let urlFirme = "https://restapiexample.wrd.app.fit.ba/Ispit20230624/GetTravelFirme";

    fetch(urlFirme)
        .then(obj => {
            if (obj.status != 200) {
                window.alert("Greska pri komunikaciji sa serverom!");
                return;
            }
            obj.json().then(element => {
                element.forEach(e => {
                    firma.innerHTML += `<option>${e.naziv}</option>`;
                });

                preuzmi();
            })
        })
        .catch(error => {
            window.alert("Greska!" + error);
        })
}
popuniFimeUCombox();


let promjenaBrojaGostiju = () => {
        console.log("novi broj gostiju je " + brojGostiju.value)

        let brojGostijuValue=parseInt(document.getElementById("brojGostiju").value);
        let cijenaPoGostuValue=parseFloat(document.getElementById("cijenaPoGostu").value);
        let cijenaDoplateValue=parseFloat(document.getElementById("hiddenCijenaDoplate").value);
        let ukupnaCijena=brojGostijuValue*cijenaPoGostuValue+cijenaDoplateValue;

        document.getElementById("ukupnaCijena").value=ukupnaCijena.toFixed(2);

        let GostiContainer=document.getElementById("gosti");
        GostiContainer.innerHTML="";
        for (let i = 1; i <= brojGostijuValue; i++){
            let gostiHtml=`
            <div class="item-full">
            <label>Ime gosta ${i}</label>
            <input class="imeGostaClass" />
            </div>
            `;
           GostiContainer.innerHTML+=gostiHtml;
        }
}


let test_phone=()=> {
    let phone=document.getElementById("phone");
    if (!/\+[0-9]{3}\-[0-9]{2}\-[0-9]{3}\-[0-9]{3}$/.test(phone.value)) {
       phone.style.backgroundColor=ErrorBackgroundColor;
       return "Broj telefona nije validan! \n";
    }
    else {
       phone.style.backgroundColor=OkBackgroundColor;
       return "";
    }
}
let test_index=()=>{
    let index=document.getElementById("brojIndeksa");
    if(!/IB[0-9]{6}$/.test(index.value)){
        index.style.backgroundColor=ErrorBackgroundColor;
        return "Broj indeksa nije validan! \n";
    }else{
        index.style.backgroundColor=OkBackgroundColor;
        return "";
    }
}
