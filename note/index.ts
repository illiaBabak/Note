const addNoteButton = document.getElementsByClassName('add-note')[0];
const container = document.getElementsByClassName('container')[0];
const containerCards = document.getElementsByClassName('container-cards')[0];

function getTargetElement<T extends HTMLElement>(className: string, tagsList: HTMLCollectionOf<T>): T | undefined {
  const searchedElement = [...tagsList].find((el) => [...el.classList].includes(className));
  return searchedElement;
}

function generateKey(length: number): string {
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

function createAndShowModal() {
  if (container.getElementsByClassName('overlay')[0]) return;

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const headerModal = document.createElement('div');
  headerModal.classList.add('header-modal');

  const title = document.createElement('h2');
  title.innerText = 'Add new note';
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
  addDescription.appendChild(textareaDescription);

  modalBody.appendChild(addDescription);

  const addNoteButton = document.createElement('div');
  addNoteButton.classList.add('add-note-button');
  addNoteButton.innerText = 'Add Note';
  addNoteButton.addEventListener('click', addCardInfoToLocalStorage);
  modalBody.appendChild(addNoteButton);

  modal.appendChild(modalBody);

  overlay.appendChild(modal);
  container.appendChild(overlay);
}

addNoteButton.addEventListener('click', createAndShowModal);

function removeModal() {
  const overlay = document.getElementsByClassName('overlay')[0];
  if (overlay) container.removeChild(overlay);
}

function addCardInfoToLocalStorage() {
  const title = getTargetElement('input-title', document.getElementsByTagName('input'));
  const description = getTargetElement('textarea-description', document.getElementsByTagName('textarea'));

  // const newNote = { title, description, key: generateKey(16) };
  // const notes = JSON.parse(localStorage.getItem('notes') ?? '') as string[] as Note[];
  // notes.push(newNote);
  // localStorage.setItem('notes', JSON.stringify(notes));

  const titlesJSON = localStorage.getItem('titles');
  const selectedTitles = JSON.parse(titlesJSON ?? '') as string[];
  if (title && !selectedTitles.includes(title?.value.toString())) selectedTitles.push(title?.value.toString());
  localStorage.setItem('titles', JSON.stringify(selectedTitles));

  const descriptionsJSON = localStorage.getItem('descriptions');
  const selectedDescriptions = JSON.parse(descriptionsJSON ?? '') as string[];

  if (description && !selectedDescriptions.includes(description?.value.toString()))
    selectedDescriptions.push(description?.value.toString());
  localStorage.setItem('descriptions', JSON.stringify(selectedDescriptions));

  const removeButton = getTargetElement('remove-modal-button', document.getElementsByTagName('div'));
  if (removeButton) removeModal();

  addCards(selectedTitles, selectedDescriptions);
}
addCardInfoToLocalStorage();

function createCard() {
  const card = document.createElement('div');
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
  editButton.addEventListener('click', () => editCard(editButton));
  footerCard.appendChild(editButton);

  const deleteButton = document.createElement('img');
  deleteButton.classList.add('delete-note-button');
  deleteButton.setAttribute('src', 'content/delete.png');
  deleteButton.addEventListener('click', () => removeCard(deleteButton));
  footerCard.appendChild(deleteButton);

  card.appendChild(mainCard);
  card.appendChild(footerCard);

  return card;
}

function removeCard(x: HTMLDivElement) {
  if (x.parentNode?.parentNode) {
    containerCards.removeChild(x.parentNode.parentNode);
    const test = x.parentNode.parentNode;

    const title = getTargetElement('title-card', (<Element>x.parentNode.parentNode).getElementsByTagName('h3'));
    const description = getTargetElement(
      'description-card',
      (<Element>x.parentNode.parentNode).getElementsByTagName('p')
    );

    const titlesJSON = localStorage.getItem('titles');
    const selectedTitles = JSON.parse(titlesJSON ?? '') as string[];

    localStorage.setItem('titles', JSON.stringify(selectedTitles.filter((el) => el !== title?.innerText)));

    const descriptionsJSON = localStorage.getItem('descriptions');
    const selectedDescriptions = JSON.parse(descriptionsJSON ?? '') as string[];
    localStorage.setItem(
      'descriptions',
      JSON.stringify(selectedDescriptions.filter((el) => el !== description?.innerText))
    );
  }
}

function editCard(editButton: HTMLDivElement) {
  if (editButton.parentNode?.parentNode) {
    const title = getTargetElement(
      'title-card',
      (<Element>editButton.parentNode.parentNode).getElementsByTagName('h3')
    );
    const description = getTargetElement(
      'description-card',
      (<Element>editButton.parentNode.parentNode).getElementsByTagName('p')
    );
  }
}

function addCards(titles: string[], descriptions: string[]) {
  for (let i = containerCards.children.length - 1; i > 0; i--) {
    containerCards.removeChild(containerCards.children[i]);
  }

  for (let i = 0; i < titles.length; i++) {
    const card = createCard();
    card.setAttribute('data-test', '1234');
    const att = card.getAttribute('data-test');
    const title = getTargetElement('title-card', card.getElementsByTagName('h3'));
    const description = getTargetElement('description-card', card.getElementsByTagName('p'));
    const date = getTargetElement('date', card.getElementsByTagName('p'));

    if (title) title.innerText = titles[i];
    if (description) description.innerText = descriptions[i];
    if (date) {
      const dateText = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      date.innerText = dateText;
    }

    containerCards.appendChild(card);
  }
}
