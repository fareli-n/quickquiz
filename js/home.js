let category="";
const categoryEl = document.querySelector("#category")
const categoryError = document.querySelector("#error-massage");
const loader = document.querySelector(".loader");
const container = document.querySelector(".container");

function  loadPage () { 
        loader.classList.add("hidden");
        container.style.display="";
}

// const buttonEl = document.getElementById("category-botton");
// buttonEl.addEventListener("click", (e)=>{
    // });
categoryEl.addEventListener("change", (e)=> {
    if (categoryEl.value ==="") {
        categoryError.textContent = "Choose a Category!";
        categoryError.classList.add("category-error");
        categoryError.classList.remove("hidden");
    }else {
        categoryError.classList.remove("category-error");
        categoryError.classList.add("hidden");

    }
})
function initGame(e){
    e.preventDefault();
    category = categoryEl.value;
    if (category === "") {
        categoryError.textContent = "Choose a Category!";
        categoryError.classList.add("category-error");
        categoryError.classList.remove("hidden");
    } else {
         categoryError.classList.remove("category-error");
         categoryError.classList.add("hidden");
        return window.location.assign(`./game.html?category=${category}`);
    }
    
}