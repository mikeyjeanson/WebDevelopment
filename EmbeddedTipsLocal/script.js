import { html, render } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks'
import TipComponent from './Components/tipComponent.js';
import fetchSheet from './fetchSheet.js';

let offset = 0
const limit = 2

function App() {
    const [tips, setTips] = useState([]);
    const [more, setMore] = useState(true)

    useEffect(() => {
        console.log("useEffect...", tips)
        fetchSheet(offset, limit)
            .then((data) => {
                setTips(prev => {
                    offset += data.length
                    return [...prev, ...data]
                })
            })
            .catch((error) => (console.error(error)))
    }, [more]);

    const getMore = () => {
        setMore(!more)
    }

    return html`
        <div>
            ${tips.map(tip => html`<${TipComponent} ...${tip} />`)}
        </div>
        <button class="show-more" onClick=${getMore}>Show More</button>
    `;
}

render(html`<${App} />`, document.getElementById('tips-container'))
