import { html, render } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks'

const sheetID = "1s7HmtvfU9ctYnxQ-KZaaGivOVBkOKJzz2uEk8HAYn5s"
const sheetName = "Default"

const props = {
    sheetID,
    sheetName,
    link: 'https://www.google.com'
}

render(html`<${AnnouncementDropdown} ...${props}/>`, document.body)