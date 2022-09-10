const stts = document.getElementById('sts')

function statusUpdate () {
  if (stts.innerText === 'processing') {
    stts.classList.remove('status-solved')
    stts.firstElementChild.classList.remove('circle-solved')
    stts.firstElementChild.classList.add('circle-process')
    stts.classList.add('status-process')
  } else if (stts.innerText === 'solved') {
    stts.classList.remove('status-process')
    stts.classList.add('status-solved')
    stts.firstElementChild.classList.remove('circle-process')
    stts.firstElementChild.classList.add('circle-solved')
  }
}
statusUpdate()
