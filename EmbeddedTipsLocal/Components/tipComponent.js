import { useState } from 'preact/hooks';
import { html } from 'htm/preact';

function TipComponent({ date, title, description, imageUrl }) {
    const [showDescription, setShowDescription] = useState(false);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    return html`
        <div class="tip">
            <div class="tip-dropdown" onClick=${toggleDescription}>
                <h1>Tip ${date} - ${title}</h1>
                <button>${showDescription ? 'Hide' : 'Show'}</button>
            </div>
            <hr></hr>
            ${showDescription ? html`
            <div class="tip-description">
                <p>${description}</p>
                ${imageUrl ? html`<img src="${""}" alt="Tip Image"/>` : ''}
            </div>
            ` : ''}
        </div>
    `;
}

export default TipComponent;