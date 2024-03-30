import { html, render } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import TrainingStartPage from '../Components/trainingStartPage.js'
import sideBySideQuestion from '../Components/sideBySideQuestion.js'
import TrainingAnswer from '../Components/trainingAnswer.js'
import trainingFetch from '../Components/trainingFetch.js'
import TrainingFinished from '../Components/trainingFinished.js'
import MultipleChoice from '../Components/multipleChoice.js'

// Dynamically import the module
const moduleURL = new URL(import.meta.url);
const scripts = document.querySelectorAll('script[type="module"]');

// Find the script element that imports this module
let script;
for (const s of scripts) {
    const scriptURL = new URL(s.src);
    if (scriptURL.href === moduleURL.href) {
        script = s;
        break;
    }
}

const project = script?.getAttribute('project')

// Set all of the anchor tags to open a new page no matter what
const mainElement = document.getElementById('training-main')  
observeMainElement(mainElement);

// Open External Instructions
document.getElementById('training-external-instructions').addEventListener('click', (event) => {
    // Prevent the default action of the click event
    event.preventDefault();

    // Get the href attribute value of the button
    const href = event.target.getAttribute('href');

    // Open the URL in a new tab
    window.open(href, '_blank');
});

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

    const questionAnswered = (selectedAnswer) => {
        setAnswer(selectedAnswer)
        setMode(TrainingMode.Answer);
    }

    const backButtonListener = () => {
        setMode(TrainingMode.Question)
    }

    const nextQuestionListener = () => {
        setOffset(prevOffset => prevOffset + 1 )
    }

    const prevQuestionListener = () => {
        setOffset(prevOffset => prevOffset - 1)
    }

    /***** END OF CLICK LISTENERS ******/

    // Fetch New Question or Get Old Question
    useEffect(() => {
        // For Old Question
        if (offset < questions.length && !isFetching) {
            setCurrentQuestion(questions[offset])
            setMode(TrainingMode.Question)
        }
        else if(!isFetching) {
            setFetching(true)
            // For New Question
            trainingFetch(project, offset)
            .then((data) => {
                if (data.length > 0) {
                    setCurrentQuestion(...data)
                    addQuestion(prev => {
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
    }, [offset])

    useEffect(() => {
        // highlight possible code syntax
        Prism.highlightAll();
    }, [mode, currentQuestion]);

    if (mode == TrainingMode.Start) {
        return html`<${TrainingStartPage} listener=${startClick} />`
    }
    else if (mode == TrainingMode.Question) {
        switch(currentQuestion.questionType) {
            case 'Side by Side':
                return html`
                    <${sideBySideQuestion} 
                        questionAnsweredCallback=${questionAnswered} 
                        ...${currentQuestion}
                        backListener=${offset > 0 ? prevQuestionListener : null}
                        nextListener=${offset + 1 < questions.length ? nextQuestionListener : null}
                    />
                `
            case 'Multiple Choice':
                return html`
                    <${MultipleChoice}
                        currentQuestion=${currentQuestion}
                        backListener=${offset > 0 ? prevQuestionListener : null}
                        questionAnsweredCallback=${questionAnswered}
                        nextListener=${offset + 1 < questions.length ? nextQuestionListener : null}
                    />
                `
        }        
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
        return html`<${TrainingFinished}  prevQuestionListener=${prevQuestionListener} />`
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