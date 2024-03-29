import { html } from 'htm/preact'
import { useState } from 'preact/hooks'

const MultipleChoice = () => {
    return html`
        <div class="training-multiple-choice">
            <div class="training-question">
                <h3 id="training-question-prompt">What is wrong with the following response?</h3>
                <div id="training-question-content">
                    <pre><code>import { h, Component, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const Timer = () => {
const [seconds, setSeconds] = useState(0);

useEffect(() => {
const intervalId = setInterval(() => {
setSeconds(prevSeconds => prevSeconds + 1);
}, 1000);</code></pre>
                </div>
            </div>
            <div class="trainging-multiple-choice-answers">
                <div class="training-multiple-choice-answer" onClick="">
                    <div class="training-multiple-choice-bubble"><div class="bubble-fill"></div></div>
                    <p>Mount Everest is the tallest mountain in the world, reaching 29,029 feet above sea level.</p>
                </div>
                
                <div class="training-multiple-choice-answer">
                    <div class="training-multiple-choice-bubble bubble-selected-effect"><div class="training-bubble-fill bubble-selected-effect"></div></div>
                    <p>The Great Wall of China stretches over 13,000 miles and was built over several dynasties.</p>
                </div>
                
                <div class="training-multiple-choice-answer">
                    <div class="training-multiple-choice-bubble"><div class="bubble-fill"></div></div>
                    <p>The Eiffel Tower, constructed in 1889, stands at 1,063 feet and was designed by Gustave Eiffel.</p>
                </div>
                
                <div class="training-multiple-choice-answer">
                    <div class="training-multiple-choice-bubble"><div class="bubble-fill"></div></div>
                    <p>The Nile River is the longest river in the world, flowing over 4,100 miles through northeastern Africa.</p>
                </div>    
            </div>
        </div>
    `
}
export default MultipleChoice