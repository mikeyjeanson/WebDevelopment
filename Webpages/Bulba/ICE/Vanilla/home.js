import { html, render } from 'htm/preact';
import AnnouncementDropdown from '../../../Components/announcementDropdown.js'
import GuideCard from '../../../Components/guideCard.js'

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

// Create the Announcement Dropdown

const sheetID = "1s7HmtvfU9ctYnxQ-KZaaGivOVBkOKJzz2uEk8HAYn5s"
const sheetName = script.getAttribute('sheetName')

const props = {
    sheetID,
    sheetName,
    link: 'https://www.google.com'
}

render(html`<${AnnouncementDropdown} ...${props}/>`, document.getElementById('announcement-container'))

// Create the Help Guide Cards

const guides = [
    {
        "title": "Instructions",
        "imgSrc": "https://img.freepik.com/free-vector/flat-hand-drawn-people-celebrating-goal-achievement_23-2148843893.jpg?w=1060&t=st=1709839825~exp=1709840425~hmac=18ef82f9b9e2ebcfb441e3df121c19275413f62d8c6ab3842b2bf4faf1c181ef",
        "link": "google.com"
    },
    {
        "title": "FAQ",
        "imgSrc": "https://lh5.googleusercontent.com/iTSCtqrSt_7la-A794mDhzn85wyy6wYs-x7Rp41k8aVYpc65QZg9fmD7t_qjFuMqW-QrBLB4AVGUNpJz2wkaVaQwu-ZHtPvy3sRXJ2hgzMygyPCHplZJo_4gdJIfIyF9KQ=w1280",
        "link": "google.com"
    },
    {
        "title": "Report Issues",
        "imgSrc": "https://lh4.googleusercontent.com/aeiCI-fLfafmNhdQfBefa-ThRWZGXJtOcSsZZ0cBYsA_brNeFwkvJ6FHwnD0eioSoQv6jnZmc-84J19Z0t0ULf5EOhTPNrYTSbQKdRRXgv1IsijLZv6rdnKtTM7C0it50g=w1280",
        "link": "https://google.com"
    }
]

// Map guides to a GuideCard elements

render(
    html`${guides.map(guide => html`<${GuideCard} ...${guide} />`)}`,
    document.getElementById('help-guide-container')
)

/********* ON CLICK FUNCTIONS **********/

document.getElementById('ice-greeting-img-img').onclick = () => {
    console.log('go to waroom')
    // window.open('https://scale.zoom.us/j/93335625928?pwd=WW13OXFQblBwNUdRT2ZwWkZpMm1BZz09', '_blank')
}