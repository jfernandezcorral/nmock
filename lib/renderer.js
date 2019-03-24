//const marked = require('marked')
const path = require('path')
const { remote, ipcRenderer } = require('electron')
const mainProcess = remote.require('./main.js')
const currentWindow = remote.getCurrentWindow()

const markdownView = document.querySelector('#markdown')
const htmlView = document.querySelector('#html')
const newFileButton = document.querySelector('#new-file')
const openFileButton = document.querySelector('#open-file')
/*const renderMarkdownToHtml = (markdown, baseUrl) => {
    htmlView.innerHTML = marked(markdown, { sanitize: true, baseUrl})
}*/
markdownView.addEventListener('keyup', (event) => {
    const currentContent = event.target.value
    //renderMarkdownToHtml(currentContent)
})
openFileButton.addEventListener('click',e=>{
    mainProcess.getFileFromUser()
})
ipcRenderer.on('file-opened', (e, file, content)=>{
    markdownView.value = content
    //renderMarkdownToHtml(content, path.dirname(file).replace(/\\/g,'/') + '/')
})