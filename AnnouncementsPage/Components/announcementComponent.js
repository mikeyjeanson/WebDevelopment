import { useState } from 'preact/hooks';
import { html } from 'htm/preact';

export default function AnnouncementComponent({ date, title, announcement, imageUrl }) {
    const [showDescription, setShowDescription] = useState(false);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    const dateObject = new Date(eval("new " + date));

    return html`
        <div class="tip">
            <div class="tip-dropdown" onClick=${toggleDescription}>
                <h1>Update ${dateObject.toLocaleDateString('en-US')} - ${title}</h1>
                <button>${showDescription ? 'Hide' : 'Show'}</button>
            </div>
            <hr></hr>
            ${showDescription ? html`
            <div class="tip-description">
                <p dangerouslySetInnerHTML=${{__html: announcement}}></p>
                ${imageUrl ? html`<img src="${imageUrl}" alt="Tip Image"/>` : ''}
            </div>
            ` : ''}
        </div>
    `;
}
window.AnnouncementComponent = AnnouncementComponent