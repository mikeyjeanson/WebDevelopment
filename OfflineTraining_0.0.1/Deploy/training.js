import { html, render } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import TrainingStartPage from 'training/Components/trainingStartPage.js'
import TrainingAnswer from 'training/Components/trainingAnswer.js'
import trainingFetch from 'training/Components/trainingFetch.js'
import TrainingFinished from 'training/Components/trainingFinished.js'
import Checklist from 'training/Components/checklist.js'
import SideBySide from 'training/Components/sideBySide.js'
import MultipleChoice from 'training/Components/multipleChoice.js'

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

// Enumerator `TrainingMode` (Start, Question, Answer, Finished)
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
        setOffset(prevOffset => prevOffset + 1)
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
                setOffset(-1)
            })
        }
    }, [offset])

    useEffect(() => {
        // highlight possible code syntax
        Prism.highlightAll();
        window.scrollTo(0, 0);
    }, [mode, currentQuestion]);

    if (mode == TrainingMode.Start) {
        return html`<${TrainingStartPage} listener=${startClick} />`
    }
    else if (mode == TrainingMode.Question) {
        switch(currentQuestion.questionType.toLowerCase()) {
            case 'checklist':
                return html`
                    <${Checklist}
                        currentQuestion=${currentQuestion}
                        backListener=${offset > 0 ? prevQuestionListener : null}
                        questionAnsweredCallback=${questionAnswered}
                        nextListener=${nextQuestionListener}
                    />
                `
            case 'side by side':
                return html`
                    <${SideBySide} 
                        questionAnsweredCallback=${questionAnswered} 
                        ...${currentQuestion}
                        backListener=${offset > 0 ? prevQuestionListener : null}
                        nextListener=${nextQuestionListener}
                    />
                `
            case 'multiple choice':
                return html`
                    <${MultipleChoice}
                        currentQuestion=${currentQuestion}
                        backListener=${offset > 0 ? prevQuestionListener : null}
                        questionAnsweredCallback=${questionAnswered}
                        nextListener=${nextQuestionListener}
                    />
                `
        }        
    }
    else if (mode == TrainingMode.Answer) {
        // Formats answer to be sorted with no whitespace
        const formatAnswer = (text) => {
            let temp = []
            text.split(',').forEach((element) => {
                temp.push(element.replace(/\s/g, ''))
            })
            temp.sort()
            temp.pop('X')
            return temp.join(',')
        }
        const expected = formatAnswer(currentQuestion.answer)
        const actual = formatAnswer(answer)
        const correct = actual == expected;

        return html`
            <${TrainingAnswer} 
                correct=${correct} 
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