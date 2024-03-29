import { html } from 'htm/preact';
import { useState, useEffect } from 'preact/hooks'

const sideBySideQuestion = ({ questionAnsweredCallback, prompt, responseA, responseB, backListener, nextListener }) => {
    const [answer, setAnswer] = useState('')
    const [timeDown, setTimeDown] = useState(Date.now())

    // Deselect Answer
    useEffect(() => {
        setAnswer('')
    }, [prompt])

    const selectAnswer = (event) => {
        // Do nothing if the target was a link
        const tagName = event?.target.tagName.toLowerCase()
        if (tagName == 'a' || tagName == 'button') return
    
        const selectedAnswer = event.currentTarget.querySelector('#training-response-a') ? 'A' : 'B'

        setAnswer(selectedAnswer);
    }

    // Highlight and Mute
    useEffect(() => {
        // Get the parent elements of the training responses (class='training-response')
        const elementA = document.getElementById('training-response-a')?.parentElement;
        const elementB = document.getElementById('training-response-b')?.parentElement;

        if (elementA && elementB) {
            if (answer === 'A') {
                elementA.classList.remove('mute-effect');
                elementA.classList.add('select-effect');
                elementB.classList.remove('select-effect');
                elementB.classList.add('mute-effect');
            } else if(answer === 'B' ) {
                elementB.classList.remove('mute-effect');
                elementB.classList.add('select-effect');
                elementA.classList.remove('select-effect');
                elementA.classList.add('mute-effect');
            }
            else {
                elementA.classList.remove('mute-effect', 'select-effect')
                elementB.classList.remove('mute-effect', 'select-effect')
            }
        }
    }, [answer])

    const handleDown = (event) => {
        setTimeDown(Date.now())
    }

    const handleUp = (event) =>  {
        if (Date.now() - timeDown < 250) {
            selectAnswer(event)
        }
    }

    const checkAnswer = () => {
        questionAnsweredCallback(answer)
    }

    return html`
        <div class="training-prompt">
            <p><strong>Prompt: </strong><span id="training-prompt-prompt" innerHTML=${prompt}></span></p>
        </div>
        <div class="training-respsonses-holder">
            <div class="training-response" onMouseDown=${handleDown} onMouseUp=${handleUp}>
                <h3>Response A</h3>
                <div id="training-response-a" innerHTML=${responseA}></div>                           
            </div>
            <div class="training-response" onMouseDown=${handleDown} onMouseUp=${handleUp}>
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
            ${answer != '' ? 
            html`
                <svg title="Next Question" onClick=${checkAnswer} viewBox="0 0 100 100" class="training-forward-arrow">
                    <line x1="73" y1="50" x2="43" y2="20" />
                    <line x1="73" y1="50" x2="43" y2="80" />
                    <circle cx="50" cy="50" r="49" fill="none" stroke-width="1"/>
                </svg>
            ` : ''}
            ${answer == '' && nextListener ? 
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
export default sideBySideQuestion