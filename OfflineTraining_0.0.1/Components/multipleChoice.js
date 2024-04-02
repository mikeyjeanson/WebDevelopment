import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'

const MultipleChoice = ({currentQuestion, backListener, questionAnsweredCallback, nextListener}) => {
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const onClickHandler = (answer) => {
        setSelectedAnswer(answer);
        console.log('Selected answer:', answer);
    }

    const checkAnswer = () => {
        console.log('checkAnswer')
        questionAnsweredCallback(selectedAnswer)
    }

    return html`
        <div class="training-multiple-choice">
            <div class="training-question">
                <p innerHTML=${currentQuestion.prompt}></p>
            </div>
            <div class="training-multiple-choice-answers">
                ${currentQuestion.answer && html`
                    <div class="training-multiple-choice-answer ${selectedAnswer === 'A' ? 'bubble-selected-effect' : ''}" onClick=${() => onClickHandler('A')}>
                        <div class="training-multiple-choice-bubble"><div class="bubble-fill"></div></div>
                        <div class="training-multiple-choice-answer-actual" innerHTML=${currentQuestion.answerA}></div>
                    </div>
                `}
                ${currentQuestion.answerB && html`
                    <div class="training-multiple-choice-answer ${selectedAnswer === 'B' ? 'bubble-selected-effect' : ''}" onClick=${() => onClickHandler('B')}>
                        <div class="training-multiple-choice-bubble"><div class="bubble-fill"></div></div>
                        <div class="training-multiple-choice-answer-actual" innerHTML=${currentQuestion.answerB}></div>
                    </div>
                `}
                ${currentQuestion.answerC && html`
                    <div class="training-multiple-choice-answer ${selectedAnswer === 'C' ? 'bubble-selected-effect' : ''}" onClick=${() => onClickHandler('C')}>
                        <div class="training-multiple-choice-bubble"><div class="bubble-fill"></div></div>
                        <div class="training-multiple-choice-answer-actual" innerHTML=${currentQuestion.answerC}></div>
                    </div>
                `}
                ${currentQuestion.answerD && html`
                    <div class="training-multiple-choice-answer ${selectedAnswer === 'D' ? 'bubble-selected-effect' : ''}" onClick=${() => onClickHandler('D')}>
                        <div class="training-multiple-choice-bubble"><div class="bubble-fill"></div></div>
                        <div class="training-multiple-choice-answer-actual" innerHTML=${currentQuestion.answerD}></div>
                    </div>
                `}
            </div>
            <div class="training-instructions">
                ${backListener ?
                html`
                    <svg title="Go Back" onClick=${backListener} viewBox="0 0 100 100" class="training-back-arrow">
                        <line x1="27" y1="50" x2="57" y2="20" />
                        <line x1="27" y1="50" x2="57" y2="80" />
                        <circle cx="50" cy="50" r="49" fill="none" stroke-width="1"/>
                    </svg>
                ` : ''}
                ${selectedAnswer != '' ? 
                html`
                    <svg title="Next Question" onClick=${checkAnswer} viewBox="0 0 100 100" class="training-forward-arrow">
                        <line x1="73" y1="50" x2="43" y2="20" />
                        <line x1="73" y1="50" x2="43" y2="80" />
                        <circle cx="50" cy="50" r="49" fill="none" stroke-width="1"/>
                    </svg>
                ` : ''}
                ${selectedAnswer == '' && nextListener ? 
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
export default MultipleChoice
