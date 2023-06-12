const addNoteButton = document.getElementsByClassName('add-note')[0];

function createModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const headerModal = document.createElement('div');
  headerModal.classList.add('header-modal');

  const title = document.createElement('h3');
  title.innerText = 'Add a new note';
  headerModal.appendChild(title);

  const removeModalButton = document.createElement('div');
  removeModalButton.classList.add('remove-modal-button');
  removeModalButton.innerText = 'x';
  removeModalButton.addEventListener('click', removeModal);
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

  const inputDescription = document.createElement('input');
  inputDescription.classList.add('input-description');
  inputDescription.setAttribute('type', 'text');
  addDescription.appendChild(inputDescription);

  mainModal.appendChild(addDescription);

  modal.appendChild(mainModal);

  return modal;
}

function showModalAndCreateNote() {
  const modal = createModal();
  console.log(modal);
}
addNoteButton.addEventListener('click', showModalAndCreateNote);

function removeModal() {
  //
}
