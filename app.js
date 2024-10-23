// API credentials
const appId = 'ce50fb24';  // Replace with your Nutritionix appId
const apiKey = '27a8f39421082d67b55473390272ddda';  // Replace with your Nutritionix apiKey

document.addEventListener('DOMContentLoaded', () => {
  // Detect which form is present on the page and assign the corresponding logic.

  const recipeForm = document.getElementById('recipe-form');
  const nutrientForm = document.getElementById('nutrient-form');
  const comparisonForm = document.getElementById('comparison-form'); // Assuming you have a comparison form.

  // 1. Recipe Nutrition Calculator Logic
  if (recipeForm) {
    const recipeResults = document.getElementById('recipe-results');

    recipeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const ingredients = document.getElementById('recipe-input').value.trim();

      if (ingredients) {
        try {
          const data = await fetchNutritionData(ingredients);
          displayRecipeResults(data);
        } catch (error) {
          recipeResults.innerHTML = 'Error fetching data. Please try again.';
          console.error('Error:', error);
        }
      } else {
        recipeResults.innerHTML = 'Please enter some ingredients.';
      }
    });

    function displayRecipeResults(foods) {
      let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
      let resultsHTML = `<h2>Nutrition Facts</h2>`;

      foods.forEach((food) => {
        totalCalories += food.nf_calories;
        totalProtein += food.nf_protein;
        totalCarbs += food.nf_total_carbohydrate;
        totalFat += food.nf_total_fat;

        resultsHTML += `
          <div class="food-item">
            <h3>${food.food_name}</h3>
            <p><strong>Serving Size:</strong> ${food.serving_qty} ${food.serving_unit}</p>
            <p><strong>Calories:</strong> ${food.nf_calories} kcal</p>
            <p><strong>Protein:</strong> ${food.nf_protein} g</p>
            <p><strong>Carbs:</strong> ${food.nf_total_carbohydrate} g</p>
            <p><strong>Fat:</strong> ${food.nf_total_fat} g</p>
          </div><hr />`;
      });

      resultsHTML += `
        <h3>Total Nutritional Value</h3>
        <p><strong>Total Calories:</strong> ${totalCalories.toFixed(2)} kcal</p>
        <p><strong>Total Protein:</strong> ${totalProtein.toFixed(2)} g</p>
        <p><strong>Total Carbs:</strong> ${totalCarbs.toFixed(2)} g</p>
        <p><strong>Total Fat:</strong> ${totalFat.toFixed(2)} g</p>`;

      recipeResults.innerHTML = resultsHTML;
    }
  }

  // 2. Nutrient Calculator Logic
  if (nutrientForm) {
    const nutrientResults = document.getElementById('nutrient-results');

    nutrientForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const foodItem = document.getElementById('food-item').value.trim();

      if (foodItem) {
        try {
          const data = await fetchNutritionData(foodItem);
          displayNutrientResults(data);
        } catch (error) {
          nutrientResults.innerHTML = 'Error fetching data. Please try again.';
          console.error('Error:', error);
        }
      } else {
        nutrientResults.innerHTML = 'Please enter a valid food item.';
      }
    });

    function displayNutrientResults(food) {
      nutrientResults.innerHTML = `
        <h2>Nutrition Facts</h2>
        <div class="food-item">
          <h3>${food.food_name}</h3>
          <p><strong>Serving Size:</strong> ${food.serving_qty} ${food.serving_unit}</p>
          <p><strong>Calories:</strong> ${food.nf_calories} kcal</p>
          <p><strong>Protein:</strong> ${food.nf_protein} g</p>
          <p><strong>Carbs:</strong> ${food.nf_total_carbohydrate} g</p>
          <p><strong>Fat:</strong> ${food.nf_total_fat} g</p>
        </div>`;
    }
  }

  // 3. Nutrient Comparison Logic (if applicable)
  if (comparisonForm) {
    const comparisonResults = document.getElementById('comparison-results');

    comparisonForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const items = document.getElementById('comparison-input').value.trim();

      if (items) {
        try {
          const data = await fetchNutritionData(items);
          displayComparisonResults(data);
        } catch (error) {
          comparisonResults.innerHTML = 'Error fetching data. Please try again.';
          console.error('Error:', error);
        }
      } else {
        comparisonResults.innerHTML = 'Please enter valid food items.';
      }
    });

    function displayComparisonResults(foods) {
      let resultsHTML = `<h2>Nutrient Comparison</h2>`;

      foods.forEach((food) => {
        resultsHTML += `
          <div class="food-item">
            <h3>${food.food_name}</h3>
            <p><strong>Serving Size:</strong> ${food.serving_qty} ${food.serving_unit}</p>
            <p><strong>Calories:</strong> ${food.nf_calories} kcal</p>
            <p><strong>Protein:</strong> ${food.nf_protein} g</p>
            <p><strong>Carbs:</strong> ${food.nf_total_carbohydrate} g</p>
            <p><strong>Fat:</strong> ${food.nf_total_fat} g</p>
          </div><hr />`;
      });

      comparisonResults.innerHTML = resultsHTML;
    }
  }

  // Common Fetch Function
  async function fetchNutritionData(query) {
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': appId,
        'x-app-key': apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error('Failed to fetch nutrition data.');
    const data = await response.json();
    return data.foods;
  }
});
