import { html, render } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks'

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

let offset = 0
const limit = 2
const sheetName = script?.getAttribute('sheetName') || 'Tips';
const query = script?.getAttribute('query') || '';

function App() {
    const [tips, setTips] = useState([]);
    const [triggerMore, fireTriggerMore] = useState(true)
    const [isMore, setIsMore] = useState(true)
    const [isFetching, setFetching] = useState(false)

    useEffect(() => {
        if (!isFetching) {
            setFetching(true)
            console.log("useEffect...", tips)
            fetchSheet(sheetName, offset, limit, query)
                .then((data) => {
                    setTips(prev => {
                        setFetching(false)
                        offset += data.length
                        if (data.length < limit) { setIsMore(false) }
                        return [...prev, ...data]
                    })
                })
                .catch((error) => {
                    console.error(error)
                    setFetching(false)
                })
        }
        else {
            console.log("Already fetching... please wait.")
        }
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
