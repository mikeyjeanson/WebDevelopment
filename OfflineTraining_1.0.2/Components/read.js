import { html } from 'htm/preact'

const Read = ({currentQuestion, backListener, nextListener}) => {
    return html`
        <div class="training-matching">
            <h4 id="training-instructions-instructions" style="margin-bottom: 0">
                ${currentQuestion.specialInstructions ? currentQuestion.specialInstructions : 'Please read, then continue'}
            </h4>
            <div 
                class="training-question" 
                innerHTML=${currentQuestion.prompt}
                style="margin-bottom: 0"
            ></div>
            <div class="training-instructions">
                ${backListener ?
                html`
                    <svg title="Go Back" onClick=${backListener} viewBox="0 0 100 100" class="training-back-arrow">
                        <line x1="27" y1="50" x2="57" y2="20" />
                        <line x1="27" y1="50" x2="57" y2="80" />
                        <circle cx="50" cy="50" r="49" fill="none" stroke-width="1"/>
                    </svg>
                ` : ''}
                ${nextListener ? 
                html`
                    <svg title="Next Question" onClick=${nextListener} viewBox="0 0 100 100" class="training-forward-arrow">
                        <line x1="73" y1="50" x2="43" y2="20" />
                        <line x1="73" y1="50" x2="43" y2="80" />
                        <circle cx="50" cy="50" r="49" fill="none" stroke-width="1"/>
                    </svg>
                ` : ''}
            </div>
        </div>
    `
}
export default Read