let fieldDescriptions;

function processFieldData (descriptions){
  // console.log('field descriptions: ', descriptions)

}

window.onload = function(){
  fetch('oews_definitions.json')
    .then(response => response.json())
    .then(data =>{
        // fieldDescriptions = data;
        processFieldData(fieldDescriptions);
    })
    .catch(error => console.error('Error:', error))
};
// console.log('field descriptions:  '+ fieldDescriptions);
const searchBtn = document.getElementById('submit');
const display = document.getElementById('display-data');
display.className = 'table-responsive'

searchBtn.addEventListener('click', handleSearch);

let headers = [];


// Function to create second box table
function createSecondBoxTable(headers, columnIndices) {
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

// handleSearch()
async function handleSearch() {
    const response = await fetch('all.csv');
    const data = await response.text();
    // console.log('Heres the data:  ' +data)
    const rows = data.split('\n');
    // console.log('Heres the rows:  ' +rows)

    
    const headers = rows[0].split(',');
    headers.forEach((header, index) => {
      // console.log(`Index: ${index}, Header: ${header}`);
  });

   

    const table = [];
    table.push(headers); // Add headers to the table
    // console.log(headers);

    rows.slice(1).forEach((row) => {
        const columns = row.split(',');
        // console.log('here are the columns' +columns)
        table.push(columns);
        // console.log(table)
    });

    

    // Filter based on user input
    const areaInput = document.getElementById('area-input').value.trim();
    const occInput = document.getElementById('occ-input').value.trim();

    const areaRegex = areaInput ? new RegExp(areaInput, 'i') : /.*/;
    const occRegex = occInput ? new RegExp(occInput, 'i') : /.*/;

    let filteredTable = table.filter((row, index) => {
        if (index === 0) return true; // keep the header row
        const rowData = Object.fromEntries(headers.map((header, i) => [header, row[i]]));
        // console.log(rowData)
        const areaTitle = rowData['Area Name'];
        console.log(areaTitle)
        const occTitle = rowData['Occupation'];
        return areaRegex.test(areaTitle) && occRegex.test(occTitle);
    });

    // Generate HTML table
    const responsiveTable = document.createElement('div');
    responsiveTable.className = 'table-responsive';

    const tableElement = document.createElement('table');
    tableElement.className = 'table';
    responsiveTable.appendChild(tableElement)


    tableElement.classList.add('table'); // Add the Bootstrap table class

    // Add table header
    const headerRow = document.createElement('tr');
    const blankTh = document.createElement('th');
    headerRow.appendChild(blankTh)
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
let checkedRowsData = [];

function handleRowCheckbox(checked, rowIndex, table) {
  const secondBoxTable = document.getElementById('second-box-table');
  const headers = table[0];
  const rowData = table[rowIndex];

  if (checked) {
      if (secondBoxTable.childElementCount === 0) {
          createSecondBoxTable(headers);
      }
      populateSecondBox(rowData, secondBoxTable);
      checkedRowsData.push(rowData);
  } else {
      // Remove the corresponding row when checkbox is unchecked
      // Assuming the rowIndex matches the row index in the second box table
      secondBoxTable.childNodes[rowIndex + 1].remove();
      checkedRowsData = checkedRowsData.filter((row) => row !==rowData);

      // Remove the header row if no rows are left
      if (secondBoxTable.childElementCount === 1) {
          secondBoxTable.innerHTML = '';
      }
  }
  const columnIndices = [8,9,10,11,12,13,14,15,16,17]; // modify this to include your actual column indices
  createTotalRow(secondBoxTable, columnIndices);
}
const columnIndices = [8,9,10,11,12,13,14,15,16,17]; // Indices of the columns (0-based) to calculate the average

function createSecondBoxTable(headers, columnIndices) {
  const existingTotalRow = document.getElementById('total-row');
  if(existingTotalRow) existingTotalRow.remove
  const secondBoxTable = document.getElementById('second-box-table');

  // Clear any existing content
  secondBoxTable.innerHTML = '';

  // Create table with headers
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
  });
  secondBoxTable.appendChild(headerRow);
}
 // Create total row
 const totalRow = document.createElement('tr');
 headers.forEach((header, index) => {
     if (columnIndices.includes(index)) {
         const td = document.createElement('td');
         const columnData = table
             .slice(1) // Exclude header row
             .map((row) => parseFloat(row[index])) // Convert to number
             .filter((value) => !isNaN(value)); // Filter out NaN values
         const average = calculateAverage(columnData);
         td.textContent = isNaN(average) ? '' : average.toFixed(2); // Display average with 2 decimal places
         totalRow.appendChild(td);
     } else {
         totalRow.appendChild(document.createElement('td'));
         secondBoxTable.appendChild(totalRow);
     }
 });



function calculateAverage(data) {
 const sum = data.reduce((acc, value) => acc + value, 0);
 return sum / data.length;
}

function populateSecondBox(rowData, table) {
  // Create new table row
  const newRow = document.createElement('tr');

  // Append each data item as a table cell
  rowData.forEach((data) => {
      const newCell = document.createElement('td');
      newCell.textContent = data ? data : '';
      newRow.appendChild(newCell);
  });

  // Append the new row to the table
  table.appendChild(newRow);
}

function createTotalRow(table, columnIndices) {
  const totalRow = document.createElement('tr');

  const tds = Array.from(table.rows[0].cells).map(()=> document.createElement('td'));

  // Iterate over the column indices and calculate the average
  columnIndices.forEach((columnIndex) => {
    const columnData = Array.from(table.rows)
      .slice(1)
      .map((row) => parseFloat(row.cells[columnIndex].textContent))
      .filter((value) => !isNaN(value));
    const average = calculateAverage(columnData);
    tds[columnIndex].textContent = isNaN(average) ? '' : average.toFixed(2);

    tds.forEach((td)=> totalRow.appendChild(td));

    const existingTotalRow = document.getElementById('total-row');
    if (existingTotalRow) existingTotalRow.remove();

    totalRow.id = 'total-row';
  // Append the total row to the table
  table.appendChild(totalRow);

  });


}