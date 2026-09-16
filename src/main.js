const papers = [
  { model: 'INSID3', title: 'INSID3', image: '../images/insid3-architecture.png', aliases: ['insid3', 'in-context segmentation'] },
  { model: 'DINO', title: 'DINO', image: '../images/dino-architecture.png' },
  { model: 'Vision Transformer (ViT)', title: 'Vision Transformer (ViT)', image: '../images/vit-architecture.png', aliases: ['vit', 'vision transformer'] },
  { model: 'DETR', title: 'DETR', image: '../images/detr-architecture.png' },
];

const imageDialog = document.querySelector('.image-dialog');
const imageDialogImage = document.querySelector('.dialog-image');
const imageDialogTitle = document.querySelector('#image-dialog-title');
const comparisonModal = document.querySelector('.comparison-modal');
const toast = document.querySelector('.toast');
let toastTimer;

function normalized(value) { return value.trim().toLowerCase(); }
function findPaper(value) {
  const query = normalized(value);
  return papers.find((paper) => [paper.model, ...(paper.aliases || [])].some((name) => normalized(name) === query));
}
function suggestions(value) {
  const query = normalized(value);
  if (!query) return [];
  return papers.filter((paper) => [paper.model, ...(paper.aliases || [])].some((name) => normalized(name).includes(query)));
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}
function architectureMarkup(paper) {
  return `<figure><img src="${paper.image}" alt="${paper.title} 架构图"><figcaption>${paper.title}</figcaption></figure>`;
}
function setPanel(panel, paper) {
  const display = panel.querySelector('.selected-architecture');
  const input = panel.querySelector('.model-search');
  const message = panel.querySelector('.panel-message');
  display.innerHTML = paper ? architectureMarkup(paper) : '<p>选择一个模型以显示架构图</p>';
  input.value = paper ? paper.model : '';
  message.textContent = '';
  renderSuggestions(panel);
}
function renderSuggestions(panel) {
  const input = panel.querySelector('.model-search');
  const list = panel.querySelector('.suggestion-list');
  const matches = suggestions(input.value);
  list.innerHTML = matches.map((paper) => `<li><button type="button" data-model="${paper.model}">${paper.model}</button></li>`).join('');
  list.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    const paper = findPaper(button.dataset.model);
    panel.querySelector('.model-search').value = paper.model;
    panel.querySelector('.panel-message').textContent = '';
    renderSuggestions(panel);
  }));
}
function initialisePanel(panel) {
  const input = panel.querySelector('.model-search');
  input.addEventListener('input', () => { panel.querySelector('.panel-message').textContent = ''; renderSuggestions(panel); });
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const paper = findPaper(input.value);
    if (paper) { setPanel(panel, paper); return; }
    panel.querySelector('.panel-message').textContent = '没有相关内容，请尝试其他模型名。';
    showToast('没有找到相关模型。');
  });
  panel.querySelector('.clear-panel').addEventListener('click', () => setPanel(panel, null));
}

document.querySelectorAll('.thumbnail-button').forEach((button) => button.addEventListener('click', () => {
  imageDialogImage.src = button.dataset.fullImage;
  imageDialogImage.alt = button.dataset.paperTitle;
  imageDialogTitle.textContent = button.dataset.paperTitle;
  imageDialog.showModal();
}));
document.querySelector('.close-image-dialog').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', (event) => { if (event.target === imageDialog) imageDialog.close(); });

const panels = document.querySelectorAll('.comparison-panel');
panels.forEach(initialisePanel);
function openComparison(leftPaper = null) {
  setPanel(panels[0], leftPaper);
  setPanel(panels[1], null);
  comparisonModal.removeAttribute('hidden');
  comparisonModal.classList.add('is-open');
  comparisonModal.hidden = false;
  (leftPaper ? panels[1] : panels[0]).querySelector('.model-search').focus();
}
window.paperCompareOpen = (model = '') => openComparison(model ? findPaper(model) : null);
function closeComparison() { comparisonModal.classList.remove('is-open'); comparisonModal.hidden = true; }
document.querySelector('.close-comparison-dialog').addEventListener('click', closeComparison);
comparisonModal.addEventListener('click', (event) => { if (event.target === comparisonModal) closeComparison(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeComparison(); });
