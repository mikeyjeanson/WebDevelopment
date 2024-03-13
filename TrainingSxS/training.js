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
    const [mode, setMode] = useState(TrainingMode.Start)
    const [index, setIndex] = useState(0)
    const[questions, addQuestion] = useState([])
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

        // Start Training
        render(html`<${TrainingQuestion} clickListener=${questionListener} ...${currentQuestion} />`, mainElement)
    }

    const questionListener = (event) => {
        const answer = event.currentTarget.querySelector('#training-response-a') ? 'A' : 'B';
        console.log(answer == currentQuestion.answer);

        render(html`<${TrainingAnswer} correct=${answer == currentQuestion.answer} reasonHTML=${currentQuestion.reason}/>`, mainElement);
    }

    const backButtonListener = () => {
        console.log('go back')
    }

    const nextQuestionListener = () => {
        console.log('next question')
        setIndex(index + 1)
    }

    const prevQuestionListener = () => {
        console.log('prev question')
        setIndex(index - 1)
    }

    /***** END OF CLICK LISTENERS ******/

    console.log('current question: ', currentQuestion)

    // Fetch New Question or Get Old Question
    useEffect(() => {
        console.log('Index changed: ', index)

        // For Old Question
        if (index < questions.length) {
            console.log(index, questions[index])
            setCurrentQuestion(questions[index])
        }
        else {
            // For New Question
            trainingFetch(project, index)
            .then((data) => {
                console.log(data)
                if (data?.prompt != '') {
                    setCurrentQuestion(...data)
                    addQuestion(prev => {
                        console.log('previous: ', prev)
                        return [...prev, currentQuestion]
                    })
                }
            })
            .catch((error) => (console.error(error)))
        }
    }, [index])

    // Change what is rendered
    useEffect(() => {
        console.log('Change Render mode: ', mode)
    }, [mode])

    if (mode == TrainingMode.Start) {
        return html`<${TrainingStartPage} listener=${startClick} />`
    }
    else if (mode == TrainingMode.Question) {

    }
    else if (mode == TrainingMode.Answer) {

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