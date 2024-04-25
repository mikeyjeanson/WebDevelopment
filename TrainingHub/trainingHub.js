import { html, render } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import HubCard from './Components/hubCard.js'

document.addEventListener('DOMContentLoaded', () => {

    const handleMouseOver = (event) => {
        const cards = document.getElementsByClassName('hub-card');
        
        Array.from(cards).forEach((card) => {
            console.log(event.target, card)
            if (card !== event.target) {
                card.style.opacity = '0.95';
            }
        });
    };
    
    const handleMouseExit = () => {
        const cards = document.getElementsByClassName('hub-card');
    
        Array.from(cards).forEach((card) => {
            card.style.opacity = '1';
        });
    };

    const hubCards =  window.trainings.map(training => {
        return html`
            <${HubCard}
                ...${training}
                handleMouseOver=${handleMouseOver}
                handleMouseExit=${handleMouseExit}
            />`
    })

    render(hubCards, document.getElementById('training-hub-cards'))
})