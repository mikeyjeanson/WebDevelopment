import { html, render } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import TrainingStartPage from './Components/trainingStartPage.js'
import TrainingQuestion from './Components/trainingQuestion.js'
import TrainingAnswer from './Components/trainingAnswer.js'
import trainingFetch from './Components/trainingFetch.js'

// Dynamically import the module
const moduleURL = new URL(import.meta.url);
const scripts = document.querySelectorAll('script[type="module"]');

// Find the script element that imports this module
let script;
for (const s of scripts) {
    const scriptURL = new URL(s.src);
    if (scriptURL.href === moduleURL.href) {
        script = s;
        console.log("Script found:", script)
        break;
    }
}

const project = script?.getAttribute('project')

// Set all of the anchor tags to open a new page no matter what
const mainElement = document.getElementById('training-main')  
observeMainElement(mainElement);

/****** MAIN APP ******/

// Enumerator `TrainingMode` (Start, Question, Answer)
const TrainingMode = Object.freeze({
    Start: 'start',
    Question: 'question',
    Answer: 'answer',
    Finished: 'finished'
})

const TrainingApp = () => {
    // Important App Member Variables
    const [isFetching, setFetching] = useState(false)
    const [answer, setAnswer] = useState('A')

    const [mode, setMode] = useState(TrainingMode.Start)
    const [offset, setOffset] = useState(0)
    const [questions, addQuestion] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState({
        'prompt': '',
        'responseA': '',
        'responseB': '',
        'answer': '',
        'reason': ''
    })

    /**** CLICK LISTENERS *******/
    const startClick = () => {
        console.log("start click")
        setMode(TrainingMode.Question)
    }

    const questionListener = (event) => {
        setAnswer(event.currentTarget.querySelector('#training-response-a') ? 'A' : 'B')
        setMode(TrainingMode.Answer)
    }

    const backButtonListener = () => {
        console.log('go back')
    }

    const nextQuestionListener = () => {
        console.log('next question')
        console.log('offset', offset)
        setOffset(prevOffset => {
            console.log('changing')
            return prevOffset + 1
        })
    }

    const prevQuestionListener = () => {
        console.log('prev question')
        setOffset(prevOffset => prevOffset - 1)
    }

    /***** END OF CLICK LISTENERS ******/

    console.log('current question: ', offset, currentQuestion)

    // Fetch New Question or Get Old Question
    useEffect(() => {
        console.log('Offset changed: ', offset)

        // For Old Question
        if (offset < questions.length) {
            console.log(offset, questions[offset])
            setCurrentQuestion(questions[offset])

            // Change Mode
            setMode(TrainingMode.Question)
        }
        else if(!isFetching) {
            setFetching(true)
            // For New Question
            trainingFetch(project, offset)
            .then((data) => {
                console.log(data)
                if (data.length > 0) {
                    setCurrentQuestion(...data)
                    addQuestion(prev => {
                        console.log('previous: ', prev)
                        return [...prev, currentQuestion]
                    })
                    // Change Mode
                    setMode(TrainingMode.Question)
                }
                else {
                    console.log('training finished')
                    setMode(TrainingMode.Finished)
                }
                setFetching(false)
            })
            .catch((error) => {
                console.error(error)
                setFetching(false)
            })
        }
        else {
            console.log("Already fetching new question...")
        }
    }, [offset])

    // Change what is rendered
    useEffect(() => {
        console.log('Change Render mode: ', mode)
    }, [mode])

    if (mode == TrainingMode.Start) {
        return html`<${TrainingStartPage} listener=${startClick} />`
    }
    else if (mode == TrainingMode.Question) {
        return html`
            <${TrainingQuestion} 
                clickListener=${questionListener} 
                ...${currentQuestion}
                backListener=${offset > 0 ? prevQuestionListener : null}
                nextListener=${offset < questions.length ? nextQuestionListener : null}
            />
        `
    }
    else if (mode == TrainingMode.Answer) {
        return html`
            <${TrainingAnswer} 
                correct=${answer == currentQuestion.answer} 
                reasonHTML=${currentQuestion.reason}
                backListener=${backButtonListener}
                nextListener=${nextQuestionListener}
            />
        `
    }
    else if (mode == TrainingMode.Finished) {
        return html`
            <div class="training-finished">
                <h1>Training Completed!</h1>
                <hr></hr>
                <p>Feel free to refresh and start over, or review your mistakes. If you feel confident that you are ready for the real thing, head back to the platform and begin working.</p>
                <svg title="Go Back" onClick=${prevQuestionListener} viewBox="0 0 100 100" class="training-back-arrow">
                        <line x1="27" y1="50" x2="57" y2="20" />
                        <line x1="27" y1="50" x2="57" y2="80" />
                        <circle cx="50" cy="50" r="49" fill="none" stroke-width="1"/>
                </svg>
            </div>
        `
    }
}

render (html`<${TrainingApp} />`, mainElement)

/***** END OF MAIN APP ****/

/**** HELPER FUNCTIONS ******/

function observeMainElement(mainElement) {
    const observer = new MutationObserver(mutationRecords => {
      for (const record of mutationRecords) {
        if (record.type === 'childList') {
          const anchors = document.querySelectorAll('a');
          anchors.forEach(anchor => {
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
          });
        }
      }
    });
  
    observer.observe(mainElement, { childList: true, subtree: true });
}