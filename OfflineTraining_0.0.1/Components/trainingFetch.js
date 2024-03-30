const debug = true

export default async function trainingFetch(sheetName, offset= 0) {
    // Spreadsheet and sheet configuration
    const sheetID = '11UXP8NGI4UCURwC9l5N8CszsLdWUj3xXCbPSf7psIUo';
    const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;

    /* 
    Example Queries:
    'Select A,B,C,D order by A asc LIMIT 2'
    'Select A,B,C,D order by A desc LIMIT 1 Offset 2'
    
    https://developers.google.com/chart/interactive/docs/querylanguage#offset 
    */
    
    // Query construction and URL generation
    const query = `Select * ORDER BY A desc LIMIT 1 OFFSET ${offset}`;
    const encodedQuery = encodeURIComponent(query);
    const url = `${base}sheet=${sheetName}&tq=${encodedQuery}`;

    // Data storage and initialization
    const data = [];
    if (debug) console.log(query, encodedQuery, url)

    return new Promise((resolve, reject) => {
        // Fetch data from Google Sheet API
        fetch(url)
            .then(res => res.   text())
            .then(response => {
                // Parse JSON response and extract data
                const jsonData = JSON.parse(response.substring(47).slice(0, -2));
                if (debug) console.log(jsonData)

                // Process data: extract labels (column names) and rows
                const labels = [];
                jsonData.table.cols.forEach(heading => {
                    if (heading.label) {
                        const cleanLabel = heading.label
                            .toLowerCase()
                            .replace(/[\s+|_|\W](.)/g, match => match.toUpperCase()) // camel-case
                            .replace(/\s/, ''); // remove whitespace
                        labels.push(cleanLabel);
                    }
                });
                if (debug) console.log('lables', labels)

                // Create data objects from each row
                jsonData.table.rows.forEach(row => {
                    const rowObject = {}
                    labels.forEach((label, index) => {
                        rowObject[label] = row.c[index].v // Access cell value
                    });
                    data.push(rowObject)
                });
                if (debug) console.log(data)

                resolve(data);
            })
            .catch(error => {
                if (debug) console.error('Error fetching data:', error);
                reject(error);
            });   
    })
}