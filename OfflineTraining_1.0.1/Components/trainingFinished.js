import { html } from 'htm/preact'

const TrainingFinished = ({ prevQuestionListener }) => {
    return html`
        <div class="training-finished">
            <h1>Training Completed!</h1>
            <hr></hr>
            <p>Feel free to <i>refresh</i> and start over, or <i>review</i> your mistakes.</p>
            <p>Return to the platform when you feel you are ready.</p>
            <svg title="Go Back" onClick=${prevQuestionListener} viewBox="0 0 100 100" class="training-back-arrow">
                    <line x1="27" y1="50" x2="57" y2="20" />
                    <line x1="27" y1="50" x2="57" y2="80" />
                    <circle cx="50" cy="50" r="49" fill="none" stroke-width="1"/>
            </svg>
        </div>
    `
}
export default TrainingFinished