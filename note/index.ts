const addNoteButton = document.getElementsByClassName('add-note')[0];
const container = document.getElementsByClassName('container')[0];

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
  mainModal.appendChild(addNoteButton);

  modal.appendChild(mainModal);

  shadow.appendChild(modal);
  container.appendChild(shadow);
}

addNoteButton.addEventListener('click', createAndShowModal);

function removeModal(x: HTMLDivElement) {
  if (x.parentNode?.parentNode?.parentNode) container.removeChild(x.parentNode.parentNode.parentNode);
}
