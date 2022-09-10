const selection = document.getElementById('select')

selection.addEventListener('click', stValue)

function stValue () {
  console.log(selection.value)
  if (selection.value === 'processing') {
    selection.classList.remove('status-solved')
    selection.classList.add('status-process')
  } else if (selection.value === 'solved') {
    selection.classList.remove('status-process')
    selection.classList.add('status-solved')
  }
}

// const updateBtn = document.getElementById('update')
// updateBtn.addEventListener('click', update)

// async function update () {
//   const reportId = this.parentElement.dataset.id
//   const updateSel = selection.value
//   // console.log(reportId)
//   try {
//     const response = await fetch('/reports/viewReport/' + `${reportId}` + '/updateStatus', {
//       method: 'PUT',
//       headers: { 'Content-type': 'application/json' },
//       body: JSON.stringify({
//         statusFromJs: updateSel
//       })
//     })
//     const data = await response.json()
//     console.log(data)
//   } catch (err) {
//     console.error(err)
//   }
// }
