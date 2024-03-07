import { html, render } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks'
import fetchSheet from '../Helpers/fetchSheet.js';

const dateOptions = { month: 'numeric', day: 'numeric' };

const AnnouncementDropdown = (props) => {
    const {sheetID, sheetName, announcementPageLink} = props

    const [announcement, setAnnouncement] = useState({
        date: 'Date(1,1,2024)',
        title: 'Announcement',
        tip: '',
        imageUrl: null
    })

    const [expanded, setExpanded] = useState(false)

    const toggleExpanded = () =>  {
        setExpanded(prev => !prev)
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
        <div class="announcement-dropdown">
            <div class="announcement-clickable" onClick=${toggleExpanded}>
                <p class="announcement-title">
                    ${
                        announcement.announcement != '' ?
                        `Update ${new Date(eval("new " + announcement.date)).toLocaleDateString('en-US', dateOptions)} - ${announcement.title}` :
                        `fetching update...`
                    }
                </p>
                <img class="announcement-expand-arrow"
                    width="20" 
                    height="20" 
                    src="https://img.icons8.com/ios/50/expand-arrow--v2.png" 
                    alt="expand-arrow--v2"
                    style="transform: rotate(${expanded ? 180 : 0}deg);"
                />
            </div>
            <hr></hr>
            ${expanded ? html`
            <div class="announcement-description">
                <p dangerouslySetInnerHTML=${{__html: announcement.announcement}}></p>
                ${announcement.imageUrl ? html`<img class="announcement-desc-img" src="${announcement.imageUrl}" alt="Announcement Image"/>` : ''}
                <a class="announcement-page-link" href=${announcementPageLink}>Past Announcements</a>
            </div>` : ''}
        </div>
    `;
}
export default AnnouncementDropdown;