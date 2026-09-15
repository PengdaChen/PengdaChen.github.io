const dialog = document.querySelector('.image-dialog');
const dialogImage = document.querySelector('.dialog-image');
const dialogTitle = document.querySelector('#dialog-title');
const closeDialog = document.querySelector('.close-dialog');

document.querySelectorAll('.thumbnail-button').forEach((button) => {
  button.addEventListener('click', () => {
    dialogImage.src = button.dataset.fullImage;
    dialogImage.alt = button.dataset.paperTitle;
    dialogTitle.textContent = button.dataset.paperTitle;
    dialog.showModal();
  });
});

closeDialog.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') dialog.close(); });
