function enableCheckboxes(){
    const filter_container = document.querySelectorAll('.filters input');

    filter_container.forEach((input) => {
        input.disabled = false;
        input.checked = true;
    });
}

document.getElementById('generate-btn').addEventListener('click', function() {
    getUsersArrayData();
    enableCheckboxes();
});

/*---------------------------------------------------------------*/
/*------------------- TÁBLÁZAT GENERÁLÁS ------------------------*/
/*---------------------------------------------------------------*/

var table_rows = null;

var usersArray = []; //üres tömb, ebbe kerülnek bele a json válaszban küldött adatok, amik az adatbázisból származnak

//ez a függvény építi fel az output-table class nevű táblázatot, az id-ja pedig userDatas
//paraméterként kap egy tömböt, aminek az elemein végigmegy és kitölti velük a táblázatot
function buildTable(data){
    var table = document.getElementById('userDatas')
    table.innerHTML = ''; //kezdetben a táblázat üres

    if (data.length === 0){ //Ha nincs adat, nem építjük fel a táblázatot
        return;
    }

    for (var i = 0; i < data.length; i++){
        var row = `<tr>
                        <!--SYSTEM 1-->
                        <td>${data[i].userid_system1}</td>
                        <td>REMOVE FROM LDAP</td>
                        <td>${data[i].system1Email}</td>
                        <td>${data[i].system1Alias}</td>
                        <td>${data[i].system1_description}</td>
                        <td>${data[i].CanSubmitCommand}</td>
                        <td>${data[i].system1Groups}</td>
                        <td>${data[i].entryDN}</td>
                        <!--SYSTEM 2-->
                        <td>${data[i].userid_sys2}</td>
                        <td>${data[i].ntUserAccount_sys2}</td>
                        <td>${data[i].status_sys2}</td>
                        <td>${data[i].isSystem1User}</td>
                        <td>${data[i].email_sys2}</td>
                        <!--SYSTEM 3-->
                        <td>${data[i].userid_sys3}</td>
                        <td>${data[i].ntUserAccount_sys3}</td>
                        <td>${data[i].status_sys3}</td>
                        <td>${data[i].isSystem1User_sys3}</td>
                        <td>${data[i].email_sys3}</td>
                        <!--ACTIVE DIRECTORY-->
                        <td>${data[i].userid_AD}</td>
                        <td>${data[i].status_AD}</td>
                        <td>${data[i].displayName_AD}</td>
                        <td>${data[i].email_AD}</td>
                        <td>${data[i].description_AD}</td>
                </tr>`
        table.innerHTML += row
    }

    table_rows = document.querySelectorAll('tbody tr');
}


//megkapja a backendtől egy json válaszban az adatbázisból kivett adatokat, azokat elrakja a usersArray tömbbe és a buildTable függvény meghívásával felépül a táblázat
function getUsersArrayData(){
    fetch('http://localhost:8000/api/userinfo/getSelectedData')
        .then(response => {
            if (!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            usersArray = data; //data-ban kapott adatokat eltárolja a usersArray tömbben
            buildTable(usersArray); //ezt a tömböt megkapja paraméterként a függvény és felépíti a  táblázat tartalmát
        })
        .catch(error => console.error('Error fetching data:', error));
}


//source: www.youtube.com/codingdesign

const search = document.querySelector('.buttons-and-search input');
//const table_rows = document.querySelectorAll('tbody tr');
const table_headings = document.querySelectorAll('thead th');

//Searching for specific data of HTML table
search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 25 + 's');
    })

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}

//Sorting | Ordering data of HTML table

table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        })

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    }
})


function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

const pdf_btn = document.querySelector('#toPDF');
const main_table = document.querySelector('#main_table_body');

// Converting HTML table to JSON

const json_btn = document.querySelector('#toJSON');

const toJSON = function (table) {
    let table_data = [],
        t_head = [],

        t_headings = table.querySelectorAll('th'),
        t_rows = table.querySelectorAll('tbody tr');

    for (let t_heading of t_headings) {
        let actual_head = t_heading.textContent.trim().split(' ');

        t_head.push(actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase());
    }

    t_rows.forEach(row => {
        const row_object = {},
            t_cells = row.querySelectorAll('td');

        t_cells.forEach((t_cell, cell_index) => {
            const img = t_cell.querySelector('img');
            if (img) {
                row_object['customer image'] = decodeURIComponent(img.src);
            }
            row_object[t_head[cell_index]] = t_cell.textContent.trim();
        })
        table_data.push(row_object);
    })

    return JSON.stringify(table_data, null, 4);
}

json_btn.onclick = () => {
    const json = toJSON(main_table);
    downloadFile(json, 'json');
}

//Converting HTML table to CSV File

const csv_btn = document.querySelector('#toCSV');

const toCSV = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join(',');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join(',') + ',' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            
            export_data = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

        return export_data + ',';
    }).join('\n');

    return headings + '\n' + table_data;
}

csv_btn.onclick = () => {
    const csv = toCSV(main_table);
    downloadFile(csv, 'csv', 'customer orders');
}

//Converting HTML table to EXCEL File

const excel_btn = document.querySelector('#toEXCEL');

const toExcel = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join('\t');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join('\t') + '\t' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            
            export_data = [...cells].map(cell => cell.textContent.trim()).join('\t');

        return export_data + '\t';
    }).join('\n');

    return headings + '\n' + table_data;
}

excel_btn.onclick = () => {
    const excel = toExcel(main_table);
    downloadFile(excel, 'excel');
}

const downloadFile = function (data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const mime_types = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    a.href = `
        data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
    document.body.appendChild(a);
    a.click();
    a.remove();
}



/* SHOW & HIDE COLUMNS */

/*
const checkbox_ids = ["system1EmailCheckbox", "system1AliasCheckbox", "descriptionCheckbox", "CanSubmitCommandCheckbox", "system1GroupsCheckbox", "entryDNCheckbox", 
                      "system2uidCheckbox", "system2ntUserAccountCheckbox", "system2StatusCheckbox", "system2system1UserCheckbox", "system2EmailCheckbox",
                      "system3uidCheckbox", "system3ntUserAccountCheckbox", "system3StatusCheckbox", "system3system1UserCheckbox", "system3EmailCheckbox",
                      "system4samAccountnameCheckbox", "system4StatusCheckbox", "system4displayNameCheckbox", "system4EmailCheckbox", "system4descriptionCheckbox"              
];
*/

function show_hide_column(checkbox_name) {
    var rows = document.getElementById('output_table').rows; //táblázat tárolása
    var checkbox = document.getElementById(checkbox_name); //paraméterként kapott checkbox_azonosítónév tárolása
    var do_show; //logikai változó a megjelenítés / elrejtéshez

    const checkbox_ids = []; //a HTML lapon, "filters" csoporton belül levő összes checkbox azonosítójának tárolása
    const filter_container = document.querySelectorAll('.filters input');
    

    if (checkbox.checked == true){
        do_show = true;
    }else{
        do_show = false;
    }

    filter_container.forEach((input) => {
        checkbox_ids.push(input.id);
    });

    for (var i = 0; i < checkbox_ids.length; i++) {
        if (checkbox_ids[i] == checkbox_name){
            col_no = i+1;
            break;
        }
    }
    
    for (var row = 0; row < rows.length; row++) {
        var cols = rows[row].cells;
        if (col_no >= 0 && col_no < cols.length) {
            cols[col_no].style.display = do_show ? '' : 'none';
        }
    }
}

function reset_filters(){
    const filter_checkboxes = document.querySelectorAll('.filters input');
    filter_checkboxes.forEach((input) => {
        if (input.checked == false){
            input.checked = true;
        }
    });

    var rows = document.getElementById('output_table').rows;
    for (var i= 0; i< rows.length; i++) {
        var cols = rows[i].cells;
        for (var j=0; j<cols.length; j++){
            if (cols[j].style.display = 'none'){
                cols[j].style.display = ''
            }
        }
    }
}

function reset_filters_1by1(system_filter){
    const filter_checkboxes = document.querySelectorAll(`.${system_filter} input`);
    filter_checkboxes.forEach((input) => {
        if (input.checked == false){
            input.checked = true;
        }
    });

    var rows = document.getElementById('output_table').rows;
    for (var i= 0; i< rows.length; i++) {
        var cols = rows[i].cells;
        for (var j=0; j<cols.length; j++){
            if (cols[j].style.display == 'none'){
                cols[j].style.display = ''
            }
        }
    }
}

//If checkbox is hovered, the related column shows as marked
function markByHover(checkbox_name, isHovered){
    var rows = document.getElementById('output_table').rows; //táblázat tárolása
    var hovered = isHovered; //logikai változó a megjelenítés / elrejtéshez

    const checkbox_ids = []; //a HTML lapon, "filters" csoporton belül levő összes checkbox azonosítójának tárolása
    const filter_container = document.querySelectorAll('.filters input');
    
    filter_container.forEach((input) => {
        checkbox_ids.push(input.id);
    });

    for (var i = 0; i < checkbox_ids.length; i++) {
        if (checkbox_ids[i] == checkbox_name){
            col_no = i+1;
            break;
        }
    }
    
    for (var row = 1; row < rows.length; row++) {
        var cols = rows[row].cells;
        if (col_no >= 0 && col_no < cols.length) {
            if (hovered){
                cols[col_no].style.backgroundColor = 'rgba(209, 49, 0, 0.15)';
            }else{
                cols[col_no].style.backgroundColor = '';
            }
        }
    }
}

var isAllOn = true;

function show_and_hide_AllCheckbox(system_filter, checkbox_name){
    var this_checkbox = document.getElementById(checkbox_name);
    const filter_checkboxes = document.querySelectorAll(`.${system_filter} input`);

    /*
    const BreakError = {};

    try{
        filter_checkboxes.forEach((input) => {
            if (input.checked == false){
                isAllOn = false;
                throw BreakError;
            }
        });
    }catch (err){
        if (err !== BreakError) throw err;
    }
    */
   
  /*if (this_checkbox.checked == true || isAllOn ==  true)*/
    if (this_checkbox.checked == true){
        filter_checkboxes.forEach((input) => {
            if (input.checked == false){
                input.checked = true;
            }
            /*console.log("On: aktualis checkbox id-ja:", input.id);*/
            show_hide_column(input.id);
        });
    }else if(this_checkbox.checked == false){
        filter_checkboxes.forEach((input) => {
            if (input.checked == true){
                input.checked = false;
            }
            /*console.log("Off: aktualis checkbox id-ja:", input.id);*/
            show_hide_column(input.id);
        });
    }
}
