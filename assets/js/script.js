
//Header-seach
var headerSearch = document.querySelector('.header-search input')
headerSearch.addEventListener('input', function (e) {
  let txtSearch = e.target.value.trim().toLowerCase()
  let listProductDOM = document.querySelectorAll('.product__item')
  listProductDOM.forEach(item => {
    if (item.innerText.toLowerCase().includes(txtSearch)) {
      item.classList.remove('hide')
    } else {
      item.classList.add('hide')
      item.classList.remove('.product__item')
    }
  })
})

// Responsive
var btnOpen=document.querySelector(".res_btn")
var modal=document.querySelector(".modal")
var iconClose=document.querySelector(".modal-header i")

function toggleModal(){
  modal.classList.toggle('hide')
}
btnOpen.addEventListener('click', toggleModal)
iconClose.addEventListener('click', toggleModal)
// modal.addEventListener('click', toggleModal)

