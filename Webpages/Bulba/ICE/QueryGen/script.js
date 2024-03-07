import { html, render } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks'
import AnnouncementDropdown from '../../../Components/announcementDropdown.js'

// Dynamically import the module
const moduleURL = new URL(import.meta.url);
const scripts = document.querySelectorAll('script[type="module"]');

// Find the script element that imports this module
let script;
for (const s of scripts) {
    const scriptURL = new URL(s.src);
    if (scriptURL.href === moduleURL.href) {
        script = s;
        console.log("Script found:", script)
        break;
    }
}

const sheetID = "1s7HmtvfU9ctYnxQ-KZaaGivOVBkOKJzz2uEk8HAYn5s"
const sheetName = script.getAttribute('sheetName')

const props = {
    sheetID,
    sheetName,
    link: 'https://www.google.com'
}

render(html`<${AnnouncementDropdown} ...${props}/>`, document.getElementById('announcement-container'))