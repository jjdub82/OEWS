
window.onload = function() {
    // your code here
    fetchData();

function fetchData() {

    const seriesID = 'LAUCN281070000000003'

    const base_url = 'https://api.bls.gov/publicAPI/v1/timeseries/data/';
    const apiUrl = `${base_url}${seriesID}`


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const seriesData = data.Results.series[0].data;
            const chartData = seriesData.map(point => {
                return {
                    x: `${point.year}-${point.period.substring(1)}`,
                    y: parseFloat(point.value)
                }
            }).reverse();
            console.log(data)
            console.log(apiUrl)

            // Create table
            const table = createTable(seriesData);
            document.getElementById('output').innerHTML = '';
            document.getElementById('output').appendChild(table);

            // Create chart
            const ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.map(point => point.x),
                    datasets: [{
                        label: 'National Unemployment Rate',
                        data: chartData.map(point => point.y),
                        fill: false,
                        
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
        function createTable(data) {
            const table = document.createElement('table');
            table.className = 'table';
            table.id = 'cpi-tbl'
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
        
            const headerRow = document.createElement('tr');
            const headers = ['Year', 'Month', 'Value'];
            headers.forEach(header => {
                const th = document.createElement('th');
                th.innerText = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
        
            data.forEach(dataPoint => {
                const tr = document.createElement('tr');
                const yearTd = document.createElement('td');
                yearTd.innerText = dataPoint.year;
                tr.appendChild(yearTd);
        
                const monthTd = document.createElement('td');
                monthTd.innerText = dataPoint.periodName;
                tr.appendChild(monthTd);
        
                const valueTd = document.createElement('td');
                valueTd.innerText = dataPoint.value;
                tr.appendChild(valueTd);
        
                tbody.appendChild(tr);
            });
        
            table.appendChild(thead);
            table.appendChild(tbody);
        
            return table;
        }
}

};