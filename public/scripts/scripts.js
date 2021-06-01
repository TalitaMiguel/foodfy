// ** AVATAR UPLOAD ** 
const AvatarUpload = {
    selected(event) {
        const button = event.target.parentNode
        const buttonText = button.querySelector("p")
        buttonText.innerHTML = "Avatar Selecionado"
        buttonText.style.width = "200px"
        buttonText.style.fontsize = "18px"
        buttonText.style.background = "#2ED5C4"
    }
}

// ** Message Confirm Delete ** 
const Message = {
    confirmDelete() {
        const formDelete = document.querySelector("#form-delete")
        formDelete.addEventListener("submit", function(event) {
            const confirmation = confirm("Deseja realmente deletar?")
            if(!confirmation) {
                event.preventDefault()
            }
        })
    },
    confirmLogout() {
        const formLogout = document.querySelector("#form-logout")
        formLogout.addEventListener("submit", function(event) {
            const confirmation = confirm("Deseja realmente sair?")
            if(!confirmation) {
                event.preventDefault()
            }
        })
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value
        
        if (results.error) {
            Validate.displayErrors(input, results.error)
        }
        
    },
    displayErrors(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error")

        if (errorDiv) {
            errorDiv.remove()
        }
    },
    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) {
            error = "Email inválido"
        }

        return {
            error,
            value
        }
    }
}







