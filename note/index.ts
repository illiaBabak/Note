const addNoteButton = document.getElementsByClassName('add-note')[0];
const container = document.getElementsByClassName('container')[0];
const containerCards = document.getElementsByClassName('container-cards')[0];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getTargetElement<T extends HTMLImageElement | HTMLParagraphElement | HTMLTextAreaElement>(
  className: string,
  tagsList: HTMLCollectionOf<T>
): T | undefined {
  const searchedElement = [...tagsList].find((el) => [...el.classList].includes(className));
  return searchedElement;
}

function createAndShowModal() {
  if (container.getElementsByClassName('shadow')[0]) return;

  const shadow = document.createElement('div');
  shadow.classList.add('shadow');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const headerModal = document.createElement('div');
  headerModal.classList.add('header-modal');

  const title = document.createElement('h2');
  title.innerText = 'Add a new note';
  headerModal.appendChild(title);

  const removeModalButton = document.createElement('div');
  removeModalButton.classList.add('remove-modal-button');
  removeModalButton.innerText = 'x';
  removeModalButton.addEventListener('click', () => removeModal(removeModalButton));
  headerModal.appendChild(removeModalButton);

  modal.appendChild(headerModal);

  const mainModal = document.createElement('div');
  mainModal.classList.add('main-modal');

  const hr = document.createElement('hr');
  mainModal.appendChild(hr);

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

  mainModal.appendChild(addTitleDiv);

  const addDescription = document.createElement('div');
  addDescription.classList.add('main-modal-block');

  const descriptionBlock = document.createElement('p');
  descriptionBlock.classList.add('text-block');
  descriptionBlock.innerText = 'Description';
  addDescription.appendChild(descriptionBlock);

  const textareaDescription = document.createElement('textarea');
  textareaDescription.classList.add('textarea-description');
  addDescription.appendChild(textareaDescription);

  mainModal.appendChild(addDescription);

  const addNoteButton = document.createElement('div');
  addNoteButton.classList.add('add-note-button');
  addNoteButton.innerText = 'Add Note';
  addNoteButton.addEventListener('click', addCardInfoToLocalStorage);
  mainModal.appendChild(addNoteButton);

  modal.appendChild(mainModal);

  shadow.appendChild(modal);
  container.appendChild(shadow);
}

addNoteButton.addEventListener('click', createAndShowModal);

function removeModal(x: HTMLDivElement) {
  if (x.parentNode?.parentNode?.parentNode) container.removeChild(x.parentNode.parentNode.parentNode);
}

function addCardInfoToLocalStorage() {
  const title = getTargetElement('input-title', document.getElementsByTagName('input'));
  const description = getTargetElement('textarea-description', document.getElementsByTagName('textarea'));

  const titlesJSON = localStorage.getItem('titles');
  const selectedTitles = JSON.parse(titlesJSON ?? '') as string[];
  if (title && !selectedTitles.includes(title?.value.toString())) selectedTitles.push(title?.value.toString());
  localStorage.setItem('titles', JSON.stringify(selectedTitles));

  const descriptionsJSON = localStorage.getItem('descriptions');
  const selectedDescriptions = JSON.parse(descriptionsJSON ?? '') as string[];

  if (description && !selectedDescriptions.includes(description?.value.toString()))
    selectedDescriptions.push(description?.value.toString());
  localStorage.setItem('descriptions', JSON.stringify(selectedDescriptions));

  const removeModalButton = getTargetElement('remove-modal-button', document.getElementsByTagName('div'));
  if (removeModalButton) removeModal(removeModalButton);

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

function addCards(titles: string[], descriptions: string[]) {
  for (let i = containerCards.children.length - 1; i > 0; i--) {
    containerCards.removeChild(containerCards.children[i]);
  }

  for (let i = 0; i < titles.length; i++) {
    const card = createCard();
    const title = getTargetElement('title-card', card.getElementsByTagName('h3'));
    const description = getTargetElement('description-card', card.getElementsByTagName('p'));
    const date = getTargetElement('date', card.getElementsByTagName('p'));

    if (title) title.innerText = titles[i];
    if (description) description.innerText = descriptions[i];
    if (date) {
      const dateText = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const [_, day, year] = dateText.split(' ');
      const formattedDate = `${months[new Date().getMonth()]} ${day} ${year}`;
      date.innerText = formattedDate;
    }

    containerCards.appendChild(card);
  }
}
