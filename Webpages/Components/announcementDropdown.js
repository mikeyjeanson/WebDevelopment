import { html, Component, render } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks'

export default function AnnouncementDropdown (sheetID, sheetName, announcementPageLink) {

    const [announcement, setAnnouncement] = useState({
        date: 'Date(1,1,2024)',
        title: 'Announcement',
        tip: '',
        imageUrl: null
    })

    const [expanded, setExpanded] = useState(false)

    const toggleExpanded = () =>  {
        setExpanded(prev => !prev)
        
        if(expanded) {
            // rotate expand arrow
        }
    }

    useEffect(() => {
        console.log("useEffect...", announcement)
        fetchSheet(sheetID, sheetName, 0, 1)
            .then((data) => {
                if (data.length > 0) {setAnnouncement(data[0])}
            })
            .catch((error) => (console.error(error)))
    }, []);

    return html`
        <div class="dropdown">
            <div id="clickable" onClick=${toggleExpanded}>
                <p id="title">
                    ${
                        announcement.announcement != '' ?
                        `Update ${new Date(eval("new " + announcement.date)).toLocaleDateString('en-US')} - ${announcement.title}` :
                        `fetching update...`
                    }
                </p>
                <img id="expand-arrow"
                    width="20" 
                    height="20" 
                    src="https://img.icons8.com/ios/50/expand-arrow--v2.png" 
                    alt="expand-arrow--v2"
                    style="transform: rotate(${expanded ? 180 : 0}deg);"
                />
            </div>
            <hr></hr>
            ${expanded ? html`
            <div id="description">
                <p dangerouslySetInnerHTML=${{__html: announcement.announcement}}></p>
                ${announcement.imageUrl ? html`<img id="desc-img" src="${announcement.imageUrl}" alt="Announcement Image"/>` : ''}
                <a id="page-link" href=${announcementPageLink}>Past Announcements</a>
            </div>` : ''}
        </div>
    `;
}
window.AnnouncementDropdown = AnnouncementDropdown