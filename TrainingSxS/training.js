import { html, render } from 'htm/preact'
import TrainingStartPage from './Components/trainingStartPage.js'
import TrainingQuestion from './Components/trainingQuestion.js'

const startClick = () => {
    console.log("start click")
    render(html`<${TrainingQuestion} />`, document.getElementById('training-main'))
}

render(html`<${TrainingStartPage} listener=${startClick} />`, document.getElementById('training-main'))