import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'

const Matching = ({currentQuestion, backListener, questionAnsweredCallback, nextListener}) => {
    const [answerPairs, setPairs] = useState(new Map())
    const optionsArray = currentQuestion.matchingOptions.split(',')
    const matchingOptions = optionsArray.map((option) => option.trim())

    const evaluateAnswer = () => {
        // build the answer
        const answerArray = Array.from(answerPairs.entries()).map(([key, val]) => key + val)
        const answer = answerArray.join(',')
        questionAnsweredCallback(answer)
    }

    const handleChange = (event) => {
        const val = event.target.value
        const matchIndex = event.target.parentNode.id?.replace(/\D/g, '')

        setPairs(prevPairs => {
            const newPairs = new Map(prevPairs)
            if (val !== '') {
                // If the current question is one-to-one (as opposed to many-to-one or one-to-many)
                // Remove any existing pairs with the same value and set
                // the existing pairs to default option (in this case: '--')
                if (currentQuestion.oneToOne.toUpperCase() === 'TRUE') {
                    for (const [key, value] of newPairs.entries()) {
                        if (value === val) {
                            newPairs.delete(key)
                            document.getElementById(`match-${key}`)
                                .querySelector('select').selectedIndex = 0
                        }
                    }
                }
                newPairs.set(matchIndex, val)
            } else {
                newPairs.delete(matchIndex)
            }
            return newPairs
        })
    }

    // Craft Answers
    let answers = []
    if (currentQuestion.answerA) answers.push(currentQuestion.answerA)
    if (currentQuestion.answerB) answers.push(currentQuestion.answerB)
    if (currentQuestion.answerC) answers.push(currentQuestion.answerC)
    if (currentQuestion.answerD) answers.push(currentQuestion.answerD)
    
    return html`
        <div class="training-matching">
            <div class="training-question" innerHTML=${currentQuestion.prompt}></div>
            <div class="training-matching-area">
                ${answers.map((answer, index) => html`
                        <${MatchingSelect} 
                            onChange=${handleChange} 
                            inner=${answer} 
                            index=${index + 1} 
                            options=${matchingOptions}
                        />
                    `
                )}
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
                ${answerPairs.size >= answers.length ?
                html`
                    <svg title="Next Question" onClick=${evaluateAnswer} viewBox="0 0 100 100" class="training-forward-arrow">
                        <line x1="73" y1="50" x2="43" y2="20" />
                        <line x1="73" y1="50" x2="43" y2="80" />
                        <circle cx="50" cy="50" r="49" fill="none" stroke-width="1"/>
                    </svg>
                ` : ''}
                ${answerPairs.size < answers.length && nextListener ? 
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

const MatchingSelect = ({ onChange, inner, index, options }) => {
    return html`
        <div class="training-match" id=${`match-${index}`}>
            <select onChange=${onChange}>
                <option value="">--</option>
                ${options.map((option, optionIndex) => html`
                    <option value=${String.fromCharCode(optionIndex + 65)}>${option}</option>"
                `)}
            </select>
            <div class="training-match-answer" innerHTML=${inner}></div>
        </div>
    `;
}

export default Matching