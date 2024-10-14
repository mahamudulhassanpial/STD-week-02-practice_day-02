const searchBox = document.getElementById('search-box');
const searchButton = document.getElementById('handleSearch');
const mealContainer = document.getElementById('meal-container');
const mealDetails = document.getElementById('meal-details');

async function searchMealsByLetter() {
  const letter = searchBox.value.trim();

  if (letter.length !== 1 || !/[a-zA-Z]/.test(letter)) {
    alert('Please enter a single letter.');
    return;
  }

  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  const data = await response.json();

  mealContainer.innerHTML = '';
  mealDetails.innerHTML = '';

  if (data.meals) {
    displayMeals(data.meals);
    searchBox.value = '';
  } else {
    mealContainer.innerHTML = '<p> No meals found.</p>';
  }
}
function displayMeals(meals) {
  mealContainer.style.display = 'block';
  mealDetails.style.display = 'none';

  meals.forEach(meal => {
    const mealCard = document.createElement('div');
    mealCard.classList.add('meal-card');
    
    mealCard.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h2>${meal.strMeal}</h2>
    `;


    mealCard.addEventListener('click', () => {
      mealContainer.style.display = 'none';
      displayMealDetails(meal.idMeal);
    });

    mealContainer.appendChild(mealCard);
  });
}

async function displayMealDetails(mealId) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await response.json();
  const meal = data.meals[0];

  mealDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h3>Ingredients:</h3>
    <ul>
      ${getIngredients(meal)}
    </ul>
  `;
  mealDetails.style.display = 'block';
}

function getIngredients(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients += `<li>${meal[`strIngredient${i}`]}</li>`;
      } else {
        break;
      }
    }
    return ingredients;
  }

searchButton.addEventListener('click', searchMealsByLetter);
