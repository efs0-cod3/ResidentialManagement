
// report modal section
const cReportBtn = document.querySelector('#crearReporte')
const modal = document.querySelector('.report-modal')
const closeModal = document.querySelector('.close-modal')

cReportBtn.addEventListener('click', () => {
  modal.style.left = '0'
  modal.style.opacity = '1'
})
closeModal.addEventListener('click', () => {
  modal.style.left = '2000px'
  modal.style.opacity = '0'
})
// report modal section
