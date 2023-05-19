

const searchBtn = document.getElementById('submit');
const display = document.getElementById('display-data');

searchBtn.addEventListener('click', handleSearch);

let headers = [];
// Function to create second box table
function createSecondBoxTable(headers) {
  const secondBox = document.getElementById('second-box');

  // Create table with headers
  const tableElement = document.createElement('table');
  tableElement.setAttribute('id', 'second-box-table');  // Add id for future reference
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  tableElement.appendChild(headerRow);
  secondBox.appendChild(tableElement);
}

async function handleSearch() {
    const response = await fetch('all.csv');
    const data = await response.text();
    const rows = data.split('\n');
    const headers = rows[0].split(',');

   

    const table = [];
    table.push(headers); // Add headers to the table

    rows.slice(1).forEach((row) => {
        const columns = row.split(',');
        table.push(columns);
    });

    

    // Filter based on user input
    const areaInput = document.getElementById('area-input').value.trim();
    const occInput = document.getElementById('occ-input').value.trim();

    const areaRegex = areaInput ? new RegExp(areaInput, 'i') : /.*/;
    const occRegex = occInput ? new RegExp(occInput, 'i') : /.*/;

    let filteredTable = table.filter((row, index) => {
        if (index === 0) return true; // keep the header row
        const rowData = Object.fromEntries(headers.map((header, i) => [header, row[i]]));
        const areaTitle = rowData['AREA_TITLE'];
        const occTitle = rowData['OCC_TITLE'];
        return areaRegex.test(areaTitle) && occRegex.test(occTitle);
    });

    // Generate HTML table
    const tableElement = document.createElement('table');
    tableElement.classList.add('table'); // Add the Bootstrap table class

    // Add table header
    const headerRow = document.createElement('tr');
    headers.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableElement.appendChild(headerRow);

    // Add table rows
    filteredTable.slice(1).forEach((row, rowIndex) => { // exclude the header row
        const tr = document.createElement('tr');
        const tdCheckbox = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => handleRowCheckbox(checkbox.checked, rowIndex + 1, filteredTable));
        tdCheckbox.appendChild(checkbox);
        tr.appendChild(tdCheckbox);
        row.forEach((value) => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });

        tableElement.appendChild(tr);
    });

    // Clear previous table content
    display.innerHTML = '';

    // Append table to the display element
    display.appendChild(tableElement);
}

function handleRowCheckbox(checked, rowIndex, table) {
    const secondBox = document.getElementById('second-box');

    if (checked) {
        const p = document.createElement('p');
        p.textContent = `Row ${rowIndex}: ${table[rowIndex].join(', ')}`;
        p.style = 'color: white'
        secondBox.appendChild(p);
    } else {
        while (secondBox.firstChild) {
            secondBox.firstChild.remove();
        }
    }
}

