/*
[Food Recipe App]
- Select Elements
*/

const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn");
// Aceess To Meals Container
let mealsContainer = document.getElementById("meals-container");
let errorMsg = document.querySelector("#food-category .error-msg");
let foodCategory = document.querySelector(".head .category");

// Access To mealDetails Conatiner
const mealDetails = document.getElementById("meal-details");


searchBtn.addEventListener("click", _ => {
    // Run mealSearchResult Function
    mealSearchResult();
    // Run searchStatusMessage Function
    searchStatusMessage();
});


// [1] Create Get Food Meals Data Function
function getFoodMealsData() {

    let myRequest = new XMLHttpRequest();

    myRequest.onload = function() {

        if (this.readyState === 4 && this.status === 200) {

            // Convert Meals Data From JSON Obj To Javascript Obj
            let mealsData = JSON.parse(this.response);

            const mealsArray = mealsData.categories;

            // Looping On Meals Array
            for (let i = 0; i < mealsArray.length; i++) {
                const meal = mealsArray[i];

                // console.log(meal);

                // Hide Any Pork Meal
                if (meal.strCategory === "Pork") continue;

                // Get Meal Data
                const {
                    idCategory:mealId,
                    strCategory:mealName,
                    strCategoryDescription:mealDescrip,
                    strCategoryThumb:mealImg,
                } = meal;

                // Run addMealItemToContainer Fun
                addMealItemToContainer(mealImg, mealName, mealDescrip);
                // // Run mealDetailsModal Function
                mealDetailsModal(mealImg, mealName, mealDescrip);
            };

        };
    };

    myRequest.open("Get", "https://www.themealdb.com/api/json/v1/1/categories.php", true);

    myRequest.send();
};

getFoodMealsData();


// [2] Create Add Meal Item  To ContainerFunction
function addMealItemToContainer(mealImg, mealName) {

    // Create Meal item (Div)
    let div = document.createElement("div");
    div.className = "meal-item";

    // Set Category Attribute To Meal item (Div)
    div.dataset.category = mealName;

    let theData = `
        <img src="${mealImg}" alt="Meal img" class="img-fluid">
        <div class="box-body">
            <strong class="meal-name">${mealName}</strong>
            <button class="details-btn">get details</button>
        </div>
    `

    div.innerHTML = theData;

    // Append  Meal item (Div) To Meals Container
    mealsContainer.appendChild(div);

    // Run mealSearchResult Function
    mealSearchResult();

    // Access To All Get Details Btn
    const detailsBtns = div.querySelectorAll(".meal-item .details-btn");

    // Looping On detailsBtns
    detailsBtns.forEach((btn) => {

        btn.addEventListener("click", displayMealDetails);
    });

};


// [3] Create Meal search Result Function
function mealSearchResult() {

    // Access To All Meal Item
    let meals = mealsContainer.getElementsByClassName("meal-item");

    // Get Array From Meals Value
    let mealsArray = Array.from(meals);

    // Looping On mealsArray
    mealsArray.forEach(meal => {

        // Get Data-Category Attribute
        let dataCat = meal.dataset.category;

        meal.style.display = "none";

        if (searchInput.value === dataCat) {
            meal.style.display = "block";
        }
    });
};


// [4] Create Search Status Message
function searchStatusMessage() {

    let categories = [];

    // Access To All Meal Item
    let meals = mealsContainer.getElementsByClassName("meal-item");

    // Get Array From Meals Value
    let mealsArray = Array.from(meals);

    // Looping On mealsArray
    mealsArray.forEach(meal => {

        // Get Data-Category Attribute
        let dataCat = meal.dataset.category;

        // Push All Data Category Value To categories Arr
        categories.push(dataCat);
    });

    if (searchInput.value === "") {
        errorMsg.innerText = "Please Write Your Food Category?";
        // Empty foodCategory Element
        foodCategory.innerText = "";
    
    } else if (searchInput.value[0] === searchInput.value[0].toLowerCase()) {
        errorMsg.innerText = "Please Write the first letter in uppercase";
    
    } else if (!categories.includes(searchInput.value)) {
        errorMsg.innerText = "this food category is not available";
        // Empty foodCategory Element
        foodCategory.innerText = "";

    } else {
        // Empty errorMsg Element
        errorMsg.innerText = "";

        // Get searchInput.value Index
        let catIndex = categories.indexOf(searchInput.value);
        foodCategory.innerText = categories[catIndex];

        // Empty searchInput.value
        searchInput.value = "";
    };
};


// [5] Create Meal Details Modal Function
function mealDetailsModal(mealImg, mealName, mealDescrip) {

    // Create Meal Modal Element
    let div = document.createElement("div");
    div.className = "meal-modal";
    // Set Data Name Attribute To Meal Modal Element
    div.setAttribute("data-name", mealName);

    let modalContent = `
        <button class="close-btn">
            <i class="fas fa-times"></i>
        </button>
        <span class="meal-name">${mealName}</span>
        <div class="decrip-area">
            <h3 class="text">Description</h3>
            <p class="text-muted" style="margin: 10px 0;">${mealDescrip}</p>
            <div class="meal-img">
                <img src="${mealImg}" alt="Meal img">
            </div>
            <a href="#" class="watch-link">watch video</a>
    `;

    div.innerHTML = modalContent;

    // Append Meal Modal Element To mealDetails Conatiner
    mealDetails.appendChild(div);
};


// [6] Create Dispaly Meal Details Function
function displayMealDetails(e) {

    // Add Show Class To mealDetails Container
    mealDetails.classList.add("active");

    let deatilsBtn = e.target;

    // Get Meal Item
    let mealItem = deatilsBtn.parentElement.parentElement;

    // Get Data Category Attribute
    let dataCat = mealItem.dataset.category;

    // Access To All Meeal Modal
    let mealsModals = mealDetails.querySelectorAll(".meal-modal");

    mealsModals.forEach(modal => {
        // Get Data Name Attribute
        let dataName = modal.getAttribute("data-name");

        modal.style.display = "none";

        if (dataName === dataCat) {
            // Show The Meal Modal
            modal.style.display = "block";
        };

        // Access To All Close Btn
        const closeBtn = modal.querySelector(".close-btn");

        closeBtn.onclick = function () {
            // Remove Show Class From mealDetails Container
            mealDetails.classList.remove("active");
        }
    });
};

// Remove Active class From meal-details Element
document.addEventListener("click", e => {
    if (e.target.id === "meal-details") {
        e.target.classList.remove("active");
    }
});