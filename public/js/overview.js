
// report modal section
const cReportBtn = document.querySelector('#crearReporte')
const createReportModal = document.querySelector('.report-modal')
const closeModal = document.querySelector('.close-modal')

cReportBtn.addEventListener('click', () => {
  createReportModal.style.left = '0'
  createReportModal.style.opacity = '1'
})
closeModal.addEventListener('click', () => {
  createReportModal.style.left = '2000px'
  createReportModal.style.opacity = '0'
})
// closed report modal section

// view report section
const viewReport = document.querySelectorAll('#row')

Array.from(viewReport).forEach((el) => {
  el.addEventListener('click', getReport)
})

function getReport () {
  const reportId = this.dataset.id
  window.location.href = `reports/viewReport/${reportId}`
}

// status
const stts = document.querySelectorAll('.status')

function stats () {
  Array.from(stts).forEach(el => {
    if (el.innerText === 'processing') {
      el.classList.remove('status-solved')
      el.firstElementChild.classList.remove('circle-solved')
      el.firstElementChild.classList.add('circle-process')
      el.classList.add('status-process')
    } else if (el.innerText === 'solved') {
      el.classList.remove('status-process')
      el.classList.add('status-solved')
      el.firstElementChild.classList.remove('circle-process')
      el.firstElementChild.classList.add('circle-solved')
    }
  })
}
stats()
