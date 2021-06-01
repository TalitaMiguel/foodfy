const hideShowButtons = document.querySelectorAll('.button')
const recipeContent = document.querySelectorAll('.recipe-hide-show')

if (hideShowButtons) {
    for (let i = 0; i < hideShowButtons.length; i++) {
        hideShowButtons[i].addEventListener('click', () => {
            if (recipeContent[i].classList.contains('show')) {
                recipeContent[i].classList.remove('show')
                hideShowButtons[i].textContent = "ESCONDER"
            } else {
                recipeContent[i].classList.add('show')
                hideShowButtons[i].textContent = "MOSTRAR"
            }
        })
    }
}