import { html } from 'htm/preact'

const HubCard = (props) => {
    const goToLink = () => {
        window.open(props.link, '_blank')
    }

    return html`
        <div class="hub-card" 
            onclick=${goToLink} 
            onmouseover=${props.handleMouseOver} 
            onmouseout=${props.handleMouseExit}
        > 
            <h3 class="hub-card-title">${props.title}</h3>
            <p class="hub-card-description">${props.description}</p>
        </div>
    `
}

export default HubCard