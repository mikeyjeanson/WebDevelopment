import { html, render } from 'htm/preact';
import TipComponent from './Components/tipComponent.js';
import fetchSheet from './fetchSheet.js';

const tips = [
    {
        date: '2/23/2024',
        title: "Here's a tip!",
        description: "Description of whatever the tip is supposed to say",
    },
    {
        date: '2/24/2024',
        title: "Another tip!",
        description: "Another description of a tip",
    },
    {
        date: '2/25/2024',
        title: "Yet another tip!",
        description: "Description of yet another tip",
    },
    {
        date: '2/26/2024',
        title: "One more tip!",
        description: "Description of one more tip",
    },
    {
        date: '2/27/2024',
        title: "Final tip!",
        description: "Description of the final tip",
    }
];

function App() {
    return html`
        <div>
            ${tips.map(tip => html`<${TipComponent} ...${tip} />`)}
        </div>
    `;
}

fetchSheet()
render(html`<${App} />`, document.getElementById('tips-container'))