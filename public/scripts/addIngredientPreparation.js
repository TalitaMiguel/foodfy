function addIngredient() {
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".ingredient")
  
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
  
    if (newField.children[0].value == "") return false
  
    newField.children[0].value = ""
    ingredients.appendChild(newField)
}

let checkClassAddIngredient = document.querySelector(".add-ingredient")

if (checkClassAddIngredient) {
    document
        .querySelector(".add-ingredient")
        .addEventListener("click", addIngredient)
}


function addPreparation() {
    const preparation = document.querySelector("#preparation")
    const fieldContainer = document.querySelectorAll(".preparation")
    
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
    
    if (newField.children[0].value == "") return false
    
    newField.children[0].value = ""
    preparation.appendChild(newField)
}
      
let checkClassAddPreparation = document.querySelector(".add-preparation")

if (checkClassAddPreparation) {
    document
        .querySelector(".add-preparation")
        .addEventListener("click", addPreparation)
}