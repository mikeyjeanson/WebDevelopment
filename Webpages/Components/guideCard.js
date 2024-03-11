import { html } from 'htm/preact'

const GuideCard = ({ title, imgSrc, link }) => {
    const goToLink = () => {
        window.location.href = link
    }

    return html`
        <div class="guide-card" onclick=${goToLink}>
            <img
                class="guide-card-img" 
                src="${imgSrc}"
            />    
            <h3 class="guide-card-name">${title}</h3>
        </div>
    `
}

export default GuideCard
