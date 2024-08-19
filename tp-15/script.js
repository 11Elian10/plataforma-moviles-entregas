document.addEventListener("DOMContentLoaded", () => {
    const recipeList = document.getElementById("recipe-list");
    const modal = document.getElementById("recipe-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalImg = document.getElementById("modal-img");
    const modalInstructions = document.getElementById("modal-instructions");
    const modalIngredients = document.getElementById("modal-ingredients");
    const closeModal = document.getElementsByClassName("close")[0];

    // URL de la API para obtener recetas de comida china
    const apiUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Chinese";

    // Diccionario de traducciones para los ingredientes
    const ingredientTranslations = {
        "Chicken": "Pollo",
        "Soy Sauce": "Salsa de Soja",
        "Rice": "Arroz",
        "Ginger": "Jengibre",
        "Garlic": "Ajo",
        "Sesame Oil": "Aceite de Sésamo",
        "Scallions": "Cebolletas",
        "Salt": "Sal",
        "Sugar": "Azúcar",
        // Añadir más ingredientes según sea necesario...
    };

    // Diccionario de traducciones para las instrucciones
    const instructionTranslations = {
        "Chop the chicken into bite-sized pieces": "Cortar el pollo en trozos pequeños",
        "Marinate the chicken with soy sauce and ginger": "Marinar el pollo con salsa de soja y jengibre",
        "Heat the sesame oil in a wok": "Calentar el aceite de sésamo en un wok",
        // Añadir más traducciones según sea necesario...
    };

    // Función para obtener y mostrar recetas
    async function fetchRecipes() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const meals = data.meals;

            meals.forEach(meal => {
                const recipeDiv = document.createElement("div");
                recipeDiv.classList.add("recipe");

                const recipeImg = document.createElement("img");
                recipeImg.src = meal.strMealThumb;
                recipeImg.alt = meal.strMeal;

                const recipeName = document.createElement("h2");
                recipeName.textContent = meal.strMeal;

                const recipeButton = document.createElement("button");
                recipeButton.textContent = "Ver detalles";
                recipeButton.addEventListener("click", () => {
                    showRecipeDetails(meal.idMeal);
                });

                recipeDiv.appendChild(recipeImg);
                recipeDiv.appendChild(recipeName);
                recipeDiv.appendChild(recipeButton);
                recipeList.appendChild(recipeDiv);
            });
        } catch (error) {
            console.error("Error al obtener recetas:", error);
        }
    }

    // Función para mostrar los detalles de una receta
    async function showRecipeDetails(id) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await response.json();
            const meal = data.meals[0];

            modalTitle.textContent = meal.strMeal;
            modalImg.src = meal.strMealThumb;
            modalInstructions.textContent = translateInstructions(meal.strInstructions);

            modalIngredients.innerHTML = ""; // Limpiar lista de ingredientes
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== "") {
                    const li = document.createElement("li");
                    li.textContent = `${translateIngredient(ingredient)} - ${measure}`;
                    modalIngredients.appendChild(li);
                }
            }

            modal.style.display = "block";
        } catch (error) {
            console.error("Error al obtener detalles de la receta:", error);
        }
    }

    // Función para traducir ingredientes
    function translateIngredient(ingredient) {
        return ingredientTranslations[ingredient] || ingredient; // Devuelve la traducción o el original si no hay traducción
    }

    // Función para traducir instrucciones
    function translateInstructions(instructions) {
        let translatedInstructions = instructions;
        for (let key in instructionTranslations) {
            translatedInstructions = translatedInstructions.replace(key, instructionTranslations[key]);
        }
        return translatedInstructions;
    }

    // Cerrar el modal al hacer clic en el botón de cerrar
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Cerrar el modal al hacer clic fuera de la ventana modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    // Llamada a la función para obtener recetas al cargar la página
    fetchRecipes();
});
