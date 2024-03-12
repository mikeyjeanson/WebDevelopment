import { html } from 'htm/preact';

const TrainingQuestion = () => {
    return html`
        <div class="training-prompt">
            <p><strong>Prompt: </strong><span id="training-prompt-prompt">In java stream reduce uses delimiter ',' but at the end last ',' must be removed</span></p>
        </div>
        <div class="training-respsonses-holder">
            <div class="training-response">
                <h3>Response A</h3>
                <div id="training-response-a">
                    <ol>
                        <li><p>Understands that it must use Java Streams to combine elements with a delimiter without having a trailing comma.</p>
                            <ul>
                                <li>This aligns with the prompt</li>
                            </ul>
                        </li>
                        <li>Shows an example implementation with Collectors.joining().<ul>
                                <li>This method does not align with the second understood instruction in the prompt which asks for the use of stream().reduce().</li>
                                <li>It’s important to note that this implementation achieves the functionality that the prompt is looking for, but uses a different method. This could be a dealbreaker for Response A, but let’s look at the second example first.</li>
                            </ul>
                        </li>
                        <li>Shows a second example using stream().reduce().<ul>
                                <li>This aligns with the prompt, using the method that was explicitly asked for. We can see that Response A includes one implementation that is sort of outside the scope of the prompt and one that perfectly aligns with the prompt. Let’s see if Response B can do better.</li>
                            </ul>
                        </li>
                    </ol> 
                </div>                           
            </div>
            <div class="training-response">
                <h3>Response B</h3>
                <div id="training-response-b">
                    <ol>
                        <li><p>Understands that it must use Java Streams to combine elements with a delimiter without having a trailing comma.</p>
                            <ul>
                                <li>This aligns with the prompt</li>
                            </ul>
                        </li>
                        <li>Shows an example implementation with Collectors.joining().<ul>
                                <li>This method does not align with the second understood instruction in the prompt which asks for the use of stream().reduce().</li>
                                <li>It’s important to note that this implementation achieves the functionality that the prompt is looking for, but uses a different method. This could be a dealbreaker for Response A, but let’s look at the second example first.</li>
                            </ul>
                        </li>
                        <li>Shows a second example using stream().reduce().<ul>
                                <li>This aligns with the prompt, using the method that was explicitly asked for. We can see that Response A includes one implementation that is sort of outside the scope of the prompt and one that perfectly aligns with the prompt. Let’s see if Response B can do better.</li>
                            </ul>
                        </li>
                    </ol>
                </div>                            
            </div>
        </div>
        <div class="training-instructions">
            <h4 id="training-instructions-instructions">Choose the best response A, or B given the prompt.</h4>
        </div>
    `;
};
export default TrainingQuestion