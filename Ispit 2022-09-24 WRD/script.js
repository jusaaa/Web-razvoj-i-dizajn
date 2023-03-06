
let preuzmi = () => {
    let divDest = document.getElementById("destinacije");
    divDest.innerHTML= "";

    let nazivFirme = document.getElementById("firma").value;


    let url=`https://restapiexample.wrd.app.fit.ba/Ispit20220924/GetPonuda?travelfirma=${nazivFirme}`;

    fetch(url)
              .then(
                r=>{
                    if(r.status !==200){
                        alert("Server javlja grešku: " + r.status);
                        return;
                    }

                    r.json().then(x => {
                        let satnica= x.datumPonude;

                        for (const p of x.podaci) {
                            let opcijeZaCmb="";
                            for (const o of p.opcije) {
                                opcijeZaCmb += `<option>${o}</option>`;
                            }
                
                            let novihtmlCode= 
                            `

                            <div class="destination-col">
                <article class="offer">
                    <div class="akcija">${p.akcijaPoruka}</div>
                    <div  class="offer-image" style="background-image: url('${p.imageUrl}');" ></div>
                    <div class="offer-details">
                        <div class="offer-destination">${p.mjestoDrzava}</div>
                        <div class="offer-price">$${p.cijenaDolar}</div>
                        <div class="offer-description">${p.opisPonude}</div>
                        <div class="offer-firma">${p.travelFirma.naziv}</div>
                        <select class="offer-option">${opcijeZaCmb}</select>
                    </div>
                    <div class="ponuda-dugme-1" onclick="destinacija1('${p.mjestoDrzava}',${p.cijenaDolar},this)">Odaberi za destinaciju 1</div>
                    <div class="ponuda-dugme-2" onclick="destinacija2('${p.mjestoDrzava}',${p.cijenaDolar},this)">Odaberi za destinaciju 2</div>
                </article>
            </div>

                            `;

                        divDest.innerHTML += novihtmlCode;
                        }

                    });
                }
              )
              .catch(
                err => {
                    alert("Greška u komunikaciji sa serverom: " + err);
                }
              );
}

let destinacija1 = (d,cijena,dugme)=>
{

    let odabranaOpcija = dugme.parentElement.querySelector(".offer-option").value;

document.getElementById("destinacija-1").value= d + " " + odabranaOpcija;
document.getElementById("cijena-1").value=cijena;

document.getElementById("cijena-ukupno").value = cijena + parseInt(document.getElementById("cijena-2").value);
}
let destinacija2 = (d,cijena,dugme)=>
{
    let odabranaOpcija = dugme.parentElement.querySelector(".offer-option").value;
    document.getElementById("destinacija-2").value= d + " " + odabranaOpcija;
    document.getElementById("cijena-2").value=cijena;

document.getElementById("cijena-ukupno").value=cijena+parseInt(document.getElementById("cijena-1").value);
}

let ErrorBackgroundColor="#FE7D7D";
let OkBackgroundColor="#DFF6D8";

let test_email= ()=>{
    let txt= document.getElementById("email");
    if(!/^[a-z]+(\.|\-|\_)?[a-z]*\@edu.fit.ba$/.test(txt.value)){
        txt.style.backgroundColor= ErrorBackgroundColor;
        return "Email nije u ispravnom formatu!\n";
    }else{
        txt.style.backgroundColor= OkBackgroundColor;
        return "";
    }
}
let test_phone = () => {
    let txt=document.getElementById("phone");
    if(!/\+[0-9]{3}\-[0-9]{2}\-[0-9]{3}\-[0-9]{3}$/.test(txt.value)){
        txt.style.backgroundColor=ErrorBackgroundColor;
        return "Telefon nije u ispravnom formatu!\n";
    }else{
        txt.style.backgroundColor=OkBackgroundColor;
        return "";
    }
}

let posalji = () => {

    let url = `https://restapiexample.wrd.app.fit.ba/Ispit20220924/Add`;
   
    let s="";

    s+= test_email();
    s+= test_phone();

    if(s!=="")
    {
        alert(s);
        return;
    }
    let obj = new Object();
    obj.destinacija1Soba= document.getElementById("destinacija-1").value;
    obj.destinacija2Soba= document.getElementById("destinacija-2").value;
    obj.imeGosta= document.getElementById("first-name").value;
    obj.prezimeGosta=document.getElementById("last-name").value;
    obj.poruka=document.getElementById("messagetxt").value;
    obj.email=document.getElementById("email").value;
    obj.telefon=document.getElementById("phone").value;

    var strJson=JSON.stringify(obj);
  
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    }).then(r => {
        if (r.status != 200) {
            alert("Server javlja gresku " + r.status);
            return;
        }
        r.json().then(x => {
            alert("Vasa rezervacija je poslana. Broj rezervacije: " + x.brojRezervacije);
        });
        
    }).catch(error => {
        alert("Greska u komunikaciji sa serverom " + error.status);
    })
}

fetch("https://restapiexample.wrd.app.fit.ba/Ispit20220924/GetTravelFirme")
.then(
  r=>{
      if(r.status !==200){
          alert("Server javlja grešku: " + r.status);
          return;
      }

      r.json().then(x => {
          for (const p of x) {
              let novihtmlCode= 
              `
              <option>${p.naziv}</option>
              `;
          document.getElementById("firma").innerHTML+= novihtmlCode;
          }

      });
  }
)
.catch(
  err => {
      alert("Greška u komunikaciji sa serverom: " + err);
  }
);