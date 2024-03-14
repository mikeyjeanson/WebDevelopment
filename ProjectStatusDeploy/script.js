// Start when data is first updated
let lastRequestTime = Date.now()
let initialized = false
let STATUS_ACTUAL = -1

// Web Elements
let statusSpan = null

// Colors for status text
const fireBrick = '#B22222'
const forestGreen = '#228B22'
const dark = '#434343'
const cornflowerBlue = '#6495ed'

// Spreadsheet and sheet configuration
const sheetID = '1XZYk6cK27ArIYF-t66FrK1HQZ6-H5AdHHjptWZNxetc';
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = 'Projects';

// Query construction and URL generation
const project = document.currentScript.getAttribute('project');
const q = `Select B WHERE A="${project}"`
const query = encodeURIComponent(q);
const url = `${base}sheet=${sheetName}&tq=${query}`;

// On DOM Content Loaded, initialize
document.addEventListener('DOMContentLoaded', () => {
    // Only run once
    if (initialized)
        return
    
    initialized = true
    document.getElementById("refresh").addEventListener('click', refresh)
    statusSpan = document.getElementById("status")

    if (q && query && url) {
        getStatus(setStatusText)
    }
})

function refresh() {
    if(Date.now() - lastRequestTime > 1000) {
        lastRequestTime = Date.now()
        statusSpan.innerHTML = "refreshing..."
        statusSpan.style.color = cornflowerBlue 
        getStatus(setStatusText)
    }
}

function setStatusText() {
    console.log("Setting status text...")
    statusSpan.innerHTML = getStatusText(STATUS_ACTUAL)
    statusSpan.style.color = getColor(STATUS_ACTUAL)
}

function getStatus(callback) {
    // Fetch data from Google Sheet API
    STATUS_ACTUAL = -1

    fetch(url)
    .then(res => res.text())
    .then(response => {
        // Parse JSON response and extract data
        const jsonData = JSON.parse(response.substring(47).slice(0, -2));
        console.log(jsonData)
        console.log(`${jsonData.table.rows[0].c[0].v}`)
        if(jsonData.table.rows[0]) {
            STATUS_ACTUAL = jsonData.table.rows[0].c[0].v == 'Empty Queue' ? 0 : 1
            callback()
        }
    })
}
function getStatusText(_status) {
    if (_status == -1) {
        return 'Unknown';
    } else if (_status == 0) {
        return 'EQ';
    } else {
        return 'TASKS AVAILABLE';
    }
}
function getColor(_status) {
    if (_status == -1) return dark
    else if(_status == 0) return fireBrick
    else return forestGreen
}