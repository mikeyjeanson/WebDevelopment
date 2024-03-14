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
    const [isFetching, setFetching] = useState(true)
    const [answer, setAnswer] = useState('A')

    const [mode, setMode] = useState(TrainingMode.Start)
    const [offset, setOffset] = useState(-1)
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
        setFetching(false)
        setOffset(0)
    }

    const questionListener = (event) => {
        setAnswer(event.currentTarget.querySelector('#training-response-a') ? 'A' : 'B')
        setMode(TrainingMode.Answer)
    }

    const backButtonListener = () => {
        setMode(TrainingMode.Question)
    }

    const nextQuestionListener = () => {
        setOffset(prevOffset => {
            return prevOffset + 1
        })
    }

    const prevQuestionListener = () => {
        setOffset(prevOffset => prevOffset - 1)
    }

    /***** END OF CLICK LISTENERS ******/

    // Fetch New Question or Get Old Question
    useEffect(() => {
        // For Old Question
        if (offset < questions.length && !isFetching) {
            console.log(offset, questions[offset])
            setCurrentQuestion(questions[offset])
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
                        return [...prev, ...data]
                    })
                    setMode(TrainingMode.Question)
                }
                else {
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

    if (mode == TrainingMode.Start) {
        return html`<${TrainingStartPage} listener=${startClick} />`
    }
    else if (mode == TrainingMode.Question) {
        return html`
            <${TrainingQuestion} 
                clickListener=${questionListener} 
                ...${currentQuestion}
                backListener=${offset > 0 ? prevQuestionListener : null}
                nextListener=${offset + 1 < questions.length ? nextQuestionListener : null}
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

// Render TrainingApp
render (html`<${TrainingApp} />`, mainElement)

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