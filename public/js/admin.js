
const selection = document.getElementById('select')

selection.addEventListener('click', stValue)

function stValue () {
  if (selection.value === 'processing') {
    selection.classList.remove('status-solved')
    selection.classList.add('status-process')
  } else if (selection.value === 'solved') {
    selection.classList.remove('status-process')
    selection.classList.add('status-solved')
  }
}
