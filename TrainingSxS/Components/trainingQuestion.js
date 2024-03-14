import { html, render } from 'htm/preact';
import TrainingAnswer from './trainingAnswer.js';

const TrainingQuestion = ({ clickListener, prompt, responseA, responseB, backListener, nextListener }) => {

    return html`
        <div class="training-prompt">
            <p><strong>Prompt: </strong><span id="training-prompt-prompt" innerHTML=${prompt}></span></p>
        </div>
        <div class="training-respsonses-holder">
            <div class="training-response" onClick=${clickListener}>
                <h3>Response A</h3>
                <div id="training-response-a" innerHTML=${responseA}></div>                           
            </div>
            <div class="training-response" onClick=${clickListener}>
                <h3>Response B</h3>
                <div id="training-response-b" innerHTML=${responseB}></div>                            
            </div>
        </div>
        <div class="training-instructions">
            <h4 id="training-instructions-instructions">Choose the best response</h4>
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
    `;
};
export default TrainingQuestion