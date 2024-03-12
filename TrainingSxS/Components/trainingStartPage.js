import { html } from 'htm/preact'

const TrainingStartPage = ({listener}) => {
    return html`
        <div class="training-start-page">
            <div class="training-start-page-text">
                    <h2>Offline Training</h2>
                    <p>Press start to engage in interactive side by side training.</p>
            </div>
            <button id="training-start-button" onClick=${listener}>Start Training</button>
        </div>
    `
}

export default TrainingStartPage