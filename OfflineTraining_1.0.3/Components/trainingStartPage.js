import { html } from 'htm/preact'

const TrainingStartPage = ({listener}) => {
    return html`
        <div class="training-start-page">
            <div class="training-start-page-text">
                <h3>Instructions:</h3>
                <p>Read the question and select the correct answer(s).</p>
                <p>Once an answer is selected use the navigation arrows to check if your answer is correct.</p>
                <p>You are able to skip answers by clicking on the forward arrow before answering a question and you are also able to 'go back' if you'd like by pressing the back arrow beneath a question.</p>
                <p>As you can see, there is a question counter on the bottom left of a question and a 'Jump' button on the bottom right. The former will tell you which question you are currently on and the latter will allow you to jump to any other question simply by providing the desired index.</p>
                <p>Refer to the most recent instructions for this task and please reach out to the TL/QA team if there any discrepancies between the instructions and this training.</p>
                <p>Whenever you are ready, press 'Start' to begin the training.</p>
            </div>
            <button id="training-start-button" onClick=${listener}>Start</button>
        </div>
    `
}
export default TrainingStartPage