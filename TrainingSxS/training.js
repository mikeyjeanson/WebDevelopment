import { html, render } from 'htm/preact'
import TrainingStartPage from './Components/trainingStartPage.js'

const startClick = () => {
    console.log("start click")
}

render(html`<${TrainingStartPage} listener=${startClick} />`, document.getElementById('training-main'))