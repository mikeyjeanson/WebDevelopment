import { html, render } from 'htm/preact'
import TrainingStartPage from './Components/trainingStartPage.js'
import TrainingQuestion from './Components/trainingQuestion.js'
import TrainingAnswer from './Components/trainingAnswer.js'

/**** CLICK LISTENERS *******/

const startClick = () => {
    console.log("start click")

    // Start Training
    render(html`<${TrainingQuestion} clickListener=${questionListener} ...${props} />`, document.getElementById('training-main'))
}

const questionListener = (event) => {
    const correct = 'A';
    const answer = event.currentTarget.querySelector('#training-response-a') ? 'A' : 'B';
    console.log(answer == correct);

    render(html`<${TrainingAnswer} correct=${answer == correct} reasonHTML=${`<p>Hello World</p>`}/>`, document.getElementById('training-main'));
}

/***** END OF CLICK LISTENERS ******/

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
let offset = 0

// Set all of the anchor tags to open a new page no matter what
const mainElement = document.getElementById('training-main')  
observeMainElement(mainElement);

// Props for testing
const props = {
    'prompt': `<p>This <i>is</i> a <strong>default tip</strong>.</p>
    <ul><li>List in tip.</li><li><a href="https://www.google.com">Link in list in tip</a></li></ul>`,
    'responseA': `<p>This is my response:</p><ol><li>Juice</li><li>Nectar</li></ol>`,
    'responseB': `<p>This is my response:</p><ul><li>Fiona</li><li>Shrek</li></ul><a href="https://google.com">Continue</a>`
}



render(html`<${TrainingStartPage} listener=${startClick} />`, document.getElementById('training-main'))

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