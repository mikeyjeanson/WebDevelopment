import { html, render } from 'htm/preact';
import TrainingAnswer from './trainingAnswer.js';

const TrainingQuestion = ({ clickListener, prompt, responseA, responseB }) => {

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
        </div>
    `;
};
export default TrainingQuestion