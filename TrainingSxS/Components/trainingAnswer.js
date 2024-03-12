import { html } from 'htm/preact'

const TrainingAnswer = ({ correct, reasonHTML }) => {
    console.log(correct, reasonHTML)

    return html`
        <div class="training-answer-page">
                <h1 class="training-answer-result">${correct ? 'Correct!' : 'Incorrect.'} </h1>
                <hr></hr>
                <p class="training-answer-reason" innerHTML=${reasonHTML}></p>
        </div>
    `
}
export default TrainingAnswer