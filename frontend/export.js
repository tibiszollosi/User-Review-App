/* EXPORTÁLÁS .CSV FÁJLBA (AZ AKTUÁLISAN MEGJELENÍTETT ÁLLAPOTOT*/

document.getElementById("export-to-csv").addEventListener("click", function(){
    exportToCsv();
});

function exportToCsv(){
    var csv = []; //ebben a tömbben tároljuk a .csv fájl sorait
    var rows = document.querySelectorAll(".output-table tr"); //output-table nevű táblázatban keresünk minden 'tr' elemet, ami a sorokat jelenti, és a sorokat elrakjuk a rows változóba

    //végigmegyünk a rows tömbön, ami a táblázat sorait tartalmazza
    for (var i = 0; i < rows.length; i++){
        var row = [];
        var cells = rows[i].querySelectorAll("td, th"); //tároljuk a cells-ban a cellákat, tehát a td és th elemeket

        //cells elemein, tehát a cellákon végigmegyünk
        //a cellákban található szövegeket hozzáadjuk a row nevű tömbhöz, ami EGY sor a .csv fájlban
        for (var j = 0; j < cells.length; j++){
            row.push(cells[j].innerText); //row tömbhöz hozzáadjuk a cells tömb j-indexű cella belső szövegét, tehát az adott sorban minden cella tartalmaz hozzáadása kerül a row tömbhöz
        }

        //a row tömböt a csv tömbhöz hozzáadjuk
        csv.push(row.join(","));
    }

    var csvContent = "data:text/csv;charset=utf-8," + csv.join("\n"); //csvContent karakterlánc tartalmazza a .csv formátumot és az adatokat
    var encodeUri = encodeURI(csvContent); //az elkészült csv tartalmat kódoljuk URI formába az encodeURI függvénnyel
    var link = document.createElement("a"); //letöltési link létrehozása

    link.setAttribute("href", encodeUri);
    link.setAttribute("download", "table-data.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}