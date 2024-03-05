export default async function fetchSheet(sheetName, offset = 0, limit = 5, query = '') {
    // Spreadsheet and sheet configuration
    const sheetID = '1s7HmtvfU9ctYnxQ-KZaaGivOVBkOKJzz2uEk8HAYn5s';
    const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;

    /* 
    Example Queries:
    'Select A,B,C,D order by A asc LIMIT 2'
    'Select A,B,C,D order by A desc LIMIT 1 Offset 2'
    
    https://developers.google.com/chart/interactive/docs/querylanguage#offset 
    */
    
    // Query construction and URL generation
    if(query == '') {
        query = `Select A,B,C,D ORDER BY A desc LIMIT ${limit} OFFSET ${offset}`; // Select all columns
    }
    const encodedQuery = encodeURIComponent(query);
    const url = `${base}sheet=${sheetName}&tq=${encodedQuery}`;

    // Data storage and initialization
    const data = [];

    return new Promise((resolve, reject) => {
        console.log('Fetching data from Google Sheet...');

        // Fetch data from Google Sheet API
        fetch(url)
            .then(res => res.   text())
            .then(response => {
                // Parse JSON response and extract data
                const jsonData = JSON.parse(response.substring(47).slice(0, -2));
                console.log(jsonData)

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

                // Create data objects from each row
                jsonData.table.rows.forEach(row => {
                    const rowObject = {}
                    labels.forEach((label, index) => {
                        rowObject[label] = row.c[index].v // Access cell value
                    });
                    data.push(rowObject)
                });

                console.log('fetchSheet: Data fetched successfully:', data)
                    
                resolve(data);
            })
            .catch(error => {
                console.error('fetchSheet: Error fetching data:', error);
                reject(error);
            });   
    })
}
window.fetchSheet = fetchSheet