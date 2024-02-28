import { html, render } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks'
import TipComponent from './Components/tipComponent.js';
import fetchSheet from './fetchSheet.js';

let offset = 0
const limit = 2

function App() {
    const [tips, setTips] = useState([]);
    const [triggerMore, fireTriggerMore] = useState(true)
    const [isMore, setIsMore] = useState(true)

    useEffect(() => {
        console.log("useEffect...", tips)
        fetchSheet(offset, limit)
            .then((data) => {
                setTips(prev => {
                    offset += data.length
                    if (data.length < limit) { setIsMore(false) }
                    return [...prev, ...data]
                })
            })
            .catch((error) => (console.error(error)))
    }, [triggerMore]);

    const getMore = () => {
        fireTriggerMore(!triggerMore)
    }

    return html`
        <div>
            ${tips.map(tip => html`<${TipComponent} ...${tip} />`)}
        </div>
        ${isMore ? html`
        <button class="show-more" onClick=${getMore}>Show More</button>` : ''}
    `;
}

render(html`<${App} />`, document.getElementById('tips-container'))
