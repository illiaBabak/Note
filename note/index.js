"use strict";
const addNoteButton = document.getElementsByClassName('add-note')[0];
const container = document.getElementsByClassName('container')[0];
const containerCards = document.getElementsByClassName('container-cards')[0];
function getTargetElement(className, tagsList) {
    const searchedElement = [...tagsList].find((el) => [...el.classList].includes(className));
    return searchedElement;
}
function generateKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const timestamp = Date.now().toString();
    const timestampLength = timestamp.length;
    let randomString = '';
    for (let i = 0; i < length - timestampLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString + timestamp;
}
function isPossibleNote(data) {
    return !!data && typeof data === 'object' && 'title' in data && 'description' in data && 'key' in data;
}
function isNotesArray(data) {
    return (Array.isArray(data) &&
        data.every((el) => {
            return isPossibleNote(el)
                ? typeof el.title === 'string' && typeof el.description === 'string' && typeof el.key === 'string'
                : false;
        }));
}
function createAndShowModal(titleModal, titleResButton, key) {
    if (container.getElementsByClassName('overlay')[0])
        return;
    const parsedNotes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes') ?? '') : [];
    const notes = isNotesArray(parsedNotes) ? parsedNotes : null;
    const note = notes?.find((el) => el.key === key);
    const overlay = document.createElement('div');
    overlay.addEventListener('click', removeModal);
    overlay.classList.add('overlay');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.addEventListener('click', (e) => e.stopPropagation());
    const headerModal = document.createElement('div');
    headerModal.classList.add('header-modal');
    const title = document.createElement('h2');
    title.innerText = titleModal;
    headerModal.appendChild(title);
    const removeButton = document.createElement('div');
    removeButton.classList.add('remove-modal-button');
    removeButton.innerText = 'x';
    removeButton.addEventListener('click', removeModal);
    headerModal.appendChild(removeButton);
    modal.appendChild(headerModal);
    const modalBody = document.createElement('div');
    modalBody.classList.add('main-modal');
    const addTitleDiv = document.createElement('div');
    addTitleDiv.classList.add('main-modal-block');
    const titleText = document.createElement('p');
    titleText.classList.add('text-block');
    titleText.innerText = 'Title';
    addTitleDiv.appendChild(titleText);
    const inputTitle = document.createElement('input');
    inputTitle.classList.add('input-title');
    inputTitle.setAttribute('type', 'text');
    addTitleDiv.appendChild(inputTitle);
    modalBody.appendChild(addTitleDiv);
    const addDescription = document.createElement('div');
    addDescription.classList.add('main-modal-block');
    const descriptionBlock = document.createElement('p');
    descriptionBlock.classList.add('text-block');
    descriptionBlock.innerText = 'Description';
    addDescription.appendChild(descriptionBlock);
    const textareaDescription = document.createElement('textarea');
    textareaDescription.classList.add('textarea-description');
    if (note) {
        inputTitle.value = note.title;
        textareaDescription.value = note.description;
    }
    addDescription.appendChild(textareaDescription);
    modalBody.appendChild(addDescription);
    const addNoteButton = document.createElement('div');
    addNoteButton.classList.add('add-note-button');
    addNoteButton.innerText = titleResButton;
    if (titleResButton === 'Add note')
        addNoteButton.addEventListener('click', addCardInfoToLocalStorage);
    if (titleResButton === 'Edit')
        addNoteButton.addEventListener('click', () => editCard(key ?? ''));
    modalBody.appendChild(addNoteButton);
    modal.appendChild(modalBody);
    overlay.appendChild(modal);
    container.appendChild(overlay);
}
addNoteButton.addEventListener('click', () => createAndShowModal('Add new note', 'Add note'));
function removeModal() {
    const overlay = document.getElementsByClassName('overlay')[0];
    if (overlay)
        container.removeChild(overlay);
}
function addCardInfoToLocalStorage() {
    const title = getTargetElement('input-title', document.getElementsByTagName('input'));
    const description = getTargetElement('textarea-description', document.getElementsByTagName('textarea'));
    const notesFromStorage = localStorage.getItem('notes');
    const parsedNotes = notesFromStorage ? JSON.parse(notesFromStorage) : [];
    const notes = isNotesArray(parsedNotes) ? parsedNotes : [];
    if (title?.value && description?.value) {
        const newNote = { title: title?.value, description: description?.value, key: generateKey(16) };
        notes?.push(newNote);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    if (notes)
        addCards(notes);
    const removeButton = getTargetElement('remove-modal-button', document.getElementsByTagName('div'));
    if (removeButton)
        removeModal();
}
addCardInfoToLocalStorage();
function createCard(key) {
    const card = document.createElement('div');
    card.setAttribute('data-key', key);
    card.classList.add('card', 'note');
    const mainCard = document.createElement('div');
    mainCard.classList.add('main-card');
    const titleCard = document.createElement('h3');
    titleCard.classList.add('title-card');
    mainCard.appendChild(titleCard);
    const descriptionCard = document.createElement('p');
    descriptionCard.classList.add('description-card');
    mainCard.appendChild(descriptionCard);
    const footerCard = document.createElement('div');
    footerCard.classList.add('footer-card');
    const date = document.createElement('p');
    date.classList.add('date');
    footerCard.appendChild(date);
    const editButton = document.createElement('img');
    editButton.classList.add('edit-note-button');
    editButton.setAttribute('src', 'content/edit.png');
    editButton.addEventListener('click', () => createAndShowModal('Edit note', 'Edit', key));
    footerCard.appendChild(editButton);
    const deleteButton = document.createElement('img');
    deleteButton.classList.add('delete-note-button');
    deleteButton.setAttribute('src', 'content/delete.png');
    deleteButton.addEventListener('click', () => removeCard(key));
    footerCard.appendChild(deleteButton);
    card.appendChild(mainCard);
    card.appendChild(footerCard);
    return card;
}
function removeCard(key) {
    const parsedNotes = JSON.parse(localStorage.getItem('notes') ?? '');
    const notes = isNotesArray(parsedNotes) ? parsedNotes : null;
    const updatedNotes = notes?.filter((el) => el.key !== key);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    if (updatedNotes)
        addCards(updatedNotes);
}
function editCard(key) {
    const title = getTargetElement('input-title', document.getElementsByTagName('input'));
    const description = getTargetElement('textarea-description', document.getElementsByTagName('textarea'));
    const parsedNotes = JSON.parse(localStorage.getItem('notes') ?? '');
    const notes = isNotesArray(parsedNotes) ? parsedNotes : [];
    if (title?.value && description?.value) {
        const updatedNotes = notes?.map((note) => note.key === key ? { ...note, title: title.value, description: description.value } : note);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        if (updatedNotes)
            addCards(updatedNotes);
    }
    const removeButton = getTargetElement('remove-modal-button', document.getElementsByTagName('div'));
    if (removeButton)
        removeModal();
}
function addCards(notes) {
    for (let i = containerCards.children.length - 1; i > 0; i--) {
        containerCards.removeChild(containerCards.children[i]);
    }
    for (let i = 0; i < notes.length; i++) {
        const card = createCard(notes[i].key);
        const title = getTargetElement('title-card', card.getElementsByTagName('h3'));
        const description = getTargetElement('description-card', card.getElementsByTagName('p'));
        const date = getTargetElement('date', card.getElementsByTagName('p'));
        if (title)
            title.innerText = notes[i].title;
        if (description)
            description.innerText = notes[i].description;
        if (date) {
            const dateText = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            date.innerText = dateText;
        }
        containerCards.appendChild(card);
    }
}
