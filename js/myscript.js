/**
 * 
 * GET ALL TAGS TO BE USED
 * 
 */
let allProductTag = document.getElementById("productList");
let allCategoryTag = document.getElementById("AllCats");
let getSearchTagText = document.getElementById("searchText");
let allCartTag = document.getElementById("cartList");
let CartTotalTag = document.getElementById("cartTotal");
let CountTag = document.getElementById("counter");


// DECLARE EMPTY ARRAY AND STRING
// let cart = [];
let productSearchText = "";
let categoryID = 0;
let htmlCategories = '<li><a data-catId="0" class="activeA getCat" href="#">All</a></li>';


/**
 * 
 * MODAL JAVASCRIPT CODE
 * 
 */

const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);


/**
 * 
 * DARKMODE
 * 
 */

var icon = document.getElementById("icon");
icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
}


/**
 * 
 * API REQUEST JAVASCRIPT CODE
 * 
 */

//PRODUCTS API
async function getAllProducts(offset = 0, limit = 20, categoryId = 0, searchText = "") {
    if (typeof offset !== "number" || typeof limit !== "number") {
        console.log("Invalid Offset or Limit Value");
        return;
    }

    if (typeof categoryId !== "number") {
        console.log("Invalid Category ID");
        return;
    }

    let Newcat = "", NewSearch = "";

    if (categoryId > 0) {
        Newcat = "&categoryId=" + categoryId;
    }

    if (searchText.trim().length > 0) {
        NewSearch = "&title=" + searchText.trim();
    }

    const AllResponse = await fetch("https://api.escuelajs.co/api/v1/products?offset=" + offset + "&limit=" + limit + Newcat + NewSearch)
    const Products = await AllResponse.json();

    // send product to front end
    displayProducts(Products);
}

// display Products Function
function displayProducts(allProducts) {

    // set variable to concatenate all products together
    let htmlProducts = "";

    // check if products are not found then return no product found design
    if (allProducts.length === 0) {

        htmlProducts += `<div class="noProducts">
            <h3 class="notFound">Sorry No Product(s) Found</h3>
        </div>`;

        allProductTag.innerHTML = htmlProducts;
        return;
    }

    // return all product data if found and map it
    allProducts.map(product => {
        htmlProducts += `<div id="${product.id}" class="singleProduct">
        <div class="imgprod">
            <div class="coverImg"></div>
            <img id="prodImage" src="${product.images[0]}" alt="">
        </div>

        <div class="prodDetails">

            <div class="sellerImg">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <circle cx="13" cy="13" r="12.7826" fill="url(#pattern0)"/>
                    <defs>
                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_403_829" transform="translate(-0.166667) scale(0.00277778)"/>
                    </pattern>
                    <image id="image0_403_829" width="480" height="360" xlink:href="data:image/jpeg;base64,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"/>
                    </defs>
                </svg>                                    
            </div>

            <div class="details">
                <div class="productNameCat">
                    <h3 class="prodName" id="prodName">${product.title}</h3>
                    <p class="prodCat" id="prodCat">${product.category.name}</p>
                </div>

                <div class="pricesAndRatesAddCart">
                    <div class="pricesAndRates">
                        <div class="prices">
                            <p class="price" id="price" data-prodPrice="${product.price}">$${product.price}</p>
                            <p class="oldPrice" id="oldPrice">$${product.price * 3}</p>
                        </div>
                        <div class="ratesSales">
                            <p class="sales">${product.price + 20} sales</p>
                            <span class="rates">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.643 4.90392L14.7246 5.52493C15.0626 5.57473 15.3466 5.82079 15.4546 6.15767C15.5625 6.49747 15.4744 6.86656 15.2302 7.11848L12.2705 10.1122L12.9693 14.4066C13.0261 14.7582 12.8869 15.1155 12.6028 15.3235C12.3217 15.5315 11.9496 15.5579 11.6457 15.3909L7.99865 13.3843L4.35449 15.3909C4.04773 15.5579 3.67565 15.5315 3.39445 15.3235C3.11326 15.1155 2.97124 14.7582 3.03089 14.4066L3.72961 10.1122L0.769408 7.11848C0.524854 6.86656 0.43794 6.49747 0.545305 6.15767C0.652386 5.82079 0.935568 5.57473 1.27613 5.52493L5.35429 4.90392L7.18347 1.02754C7.33401 0.70485 7.65213 0.5 7.99865 0.5C8.34801 0.5 8.66613 0.70485 8.81667 1.02754L10.643 4.90392Z" fill="#FFC831"/>
                                </svg>  
                                5.0(10)                                               
                            </span>
                        </div>
                    </div>

                    <span class="cartbtn">
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.66669 3.20312C1.66669 2.81348 1.97894 2.5 2.36707 2.5H3.69488C4.3369 2.5 4.90596 2.875 5.17152 3.4375H17.1656C17.9331 3.4375 18.4934 4.16992 18.292 4.91406L17.0956 9.37598C16.8475 10.2959 16.0158 10.9375 15.0674 10.9375H6.64817L6.80575 11.7725C6.86996 12.1035 7.15886 12.3438 7.49446 12.3438H15.9078C16.296 12.3438 16.6082 12.6572 16.6082 13.0469C16.6082 13.4365 16.296 13.75 15.9078 13.75H7.49446C6.48474 13.75 5.61802 13.0293 5.43125 12.0361L3.92542 4.09668C3.905 3.98535 3.80869 3.90625 3.69488 3.90625H2.36707C1.97894 3.90625 1.66669 3.59277 1.66669 3.20312ZM5.40207 16.0938C5.40207 15.9091 5.4383 15.7262 5.50869 15.5556C5.57909 15.385 5.68227 15.23 5.81234 15.0994C5.94242 14.9688 6.09684 14.8652 6.26678 14.7945C6.43673 14.7239 6.61888 14.6875 6.80283 14.6875C6.98679 14.6875 7.16894 14.7239 7.33889 14.7945C7.50883 14.8652 7.66325 14.9688 7.79333 15.0994C7.9234 15.23 8.02658 15.385 8.09698 15.5556C8.16737 15.7262 8.2036 15.9091 8.2036 16.0938C8.2036 16.2784 8.16737 16.4613 8.09698 16.6319C8.02658 16.8025 7.9234 16.9575 7.79333 17.0881C7.66325 17.2187 7.50883 17.3223 7.33889 17.393C7.16894 17.4636 6.98679 17.5 6.80283 17.5C6.61888 17.5 6.43673 17.4636 6.26678 17.393C6.09684 17.3223 5.94242 17.2187 5.81234 17.0881C5.68227 16.9575 5.57909 16.8025 5.50869 16.6319C5.4383 16.4613 5.40207 16.2784 5.40207 16.0938V16.0938ZM15.2074 14.6875C15.5789 14.6875 15.9352 14.8357 16.1979 15.0994C16.4606 15.3631 16.6082 15.7208 16.6082 16.0938C16.6082 16.4667 16.4606 16.8244 16.1979 17.0881C15.9352 17.3518 15.5789 17.5 15.2074 17.5C14.8359 17.5 14.4796 17.3518 14.2169 17.0881C13.9543 16.8244 13.8067 16.4667 13.8067 16.0938C13.8067 15.7208 13.9543 15.3631 14.2169 15.0994C14.4796 14.8357 14.8359 14.6875 15.2074 14.6875ZM9.02072 7.1875C9.02072 7.50977 9.28336 7.77344 9.60437 7.77344H10.8884V9.0625C10.8884 9.38477 11.1511 9.64844 11.4721 9.64844C11.7931 9.64844 12.0557 9.38477 12.0557 9.0625V7.77344H13.3398C13.6608 7.77344 13.9234 7.50977 13.9234 7.1875C13.9234 6.86523 13.6608 6.60156 13.3398 6.60156H12.0557V5.3125C12.0557 4.99023 11.7931 4.72656 11.4721 4.72656C11.1511 4.72656 10.8884 4.99023 10.8884 5.3125V6.60156H9.60437C9.28336 6.60156 9.02072 6.86523 9.02072 7.1875Z" fill="#637381"/>
                        </svg>                                                                                    
                    </span>
                    
                    
                </div>
            </div>
        </div>
        </div>`;
    })


    // return all products to the HTML document using innerHTML attribute
    allProductTag.innerHTML = htmlProducts;


    let allAddToCartTAgs = document.getElementsByClassName("cartbtn");
    // loop all add to cart but and listen to one trigger at a time
    for (let p = 0; p < allAddToCartTAgs.length; p++) {

        // Trigger when single add to cart but is clicked on
        allAddToCartTAgs[p].addEventListener("click", function () {

            // Get single product container
            let singleProductCont = allAddToCartTAgs[p].closest(".singleProduct");

            // get product Price
            let pPrice = singleProductCont.querySelector("#price").getAttribute("data-prodPrice");

            // get Product Name
            let pName = singleProductCont.querySelector("#prodName").textContent;

            // get Product Image
            let pImg = singleProductCont.querySelector("#prodImage").getAttribute("src");

            // get Product Category
            let pCat = singleProductCont.querySelector("#prodCat").textContent;

            // create object of cart
            let cart = {
                "name": pName,
                "price": pPrice,
                "image": pImg,
                "category": pCat
            };

            // send cart data to localStroge
            let allCartData = addCartData(cart);

            displayCartList(allCartData);

            // show cart
            toggleModal();
        });
    }

}



//CATEGORY API
async function getAllCategories() {

    // call category API endpoint
    const AllCatResponse = await fetch("https://api.escuelajs.co/api/v1/categories")
    const Categories = await AllCatResponse.json();

    // send product to front end
    displayCategories(Categories);

}

// display Categories Function
function displayCategories(allCategories) {

    // map all categories together
    allCategories.map(category => {
        htmlCategories += `<li><a class="getCat" data-catId="${category.id}" href="#">${category.name}</a></li>`
    })

    // return all category html response to the document
    allCategoryTag.innerHTML = htmlCategories;

    // get all category tags for loop
    let allCATSectionTAgs = document.getElementsByClassName("getCat");

    // loop all category button and listen to one trigger at a time
    for (let c = 0; c < allCATSectionTAgs.length; c++) {

        //Trigger when single category is clicked on
        allCATSectionTAgs[c].addEventListener("click", function () {
            let singleCatGet = allCATSectionTAgs[c].getAttribute("data-catId");
            categoryID = parseInt(singleCatGet)

            // remove active from a specific catgory
            var r = 0;
            while (r < allCATSectionTAgs.length) {
                allCATSectionTAgs[r++].className = 'getCat';
            }

            // make active class on the category
            allCATSectionTAgs[c].className = 'getCat activeA';

            // get product list
            getAllProducts(0, 20, categoryID, productSearchText);
        });

    }
}


// remove from cart
function removeFromCart(index, allCartData) {
    allCartData.splice(index, 1);

    window.localStorage.setItem('myCart', JSON.stringify(allCartData));

    return allCartData;
}


function getAllCartFromLocalStorage() {

    let localStorageCart = JSON.parse(window.localStorage.getItem("myCart")) ?? [];

    return localStorageCart;
}


// set cart
function addCartData(newCartData) {

    if (newCartData === null || newCartData === undefined) {
        console.log("Invalid Cart Data")
        return false;
    }

    // get cart if existing
    let Latestcart = JSON.parse(window.localStorage.getItem("myCart")) ?? [];

    if (Latestcart.length === 0) {
        Latestcart.push(newCartData);

        window.localStorage.setItem('myCart', JSON.stringify(Latestcart));
    } else {

        Latestcart.push(newCartData);

        window.localStorage.setItem('myCart', JSON.stringify(Latestcart));
    }

    return Latestcart;

}


// display cart list data
function displayCartList(allCartData) {

    let allCartHtml = "";
    let totalPrice = 0;

    if (allCartData.length === 0) {
        allCartHtml = `<div class="noProducts">
        <h3 class="notFound">Sorry your cart is empty</h3>
    </div>`;

        allCartTag.innerHTML = allCartHtml;
        return;
    }


    allCartData.map(sCart => {
        totalPrice = totalPrice + parseInt(sCart.price);
        allCartHtml += `<div class="singleCart">
                        <div class="left">
                            <div class="prodImg">
                                <img src="${sCart.image}" alt="">
                            </div>

                            <div class="prodDATA">
                                <h4 class="prodName">${sCart.name}</h4>
                                <p class="category">${sCart.category}</p>
                            </div>
                            
                        </div>

                        <div class="right">

                            <p class="price">$${sCart.price}</p>

                            <div class="deleteBtn">
                                <img src="https://s3-alpha-sig.figma.com/img/7af9/e5a0/edee039aa8eafa44db7ddf8306eac4b5?Expires=1684108800&Signature=FEEtoxq5ao~5mES42mp1mIoubrB6riO6oOyyEwbMVYRT~Q-5CJaYRElY31Zul9j16NG5qq7s4CjO9y3Tz-8hAcDd2iA-v7FiDJcA~D6UysDmRLpI4fArF-uZwRLsuQzcSfBnBkghbwrV3R1zcTM6ng4OCtnMaH0Nye4mmOsKWZYmHOhG3L4yS-fbDdR~rPwJEpael1jb9fUGgIBTUW6eMAtQyVYNtXE144yPOlXnMaJHwrSQae76Z2jTJlsevmbmWOxyW-frWE28hNB1YWLxhwUi-Wqvz8Lmbhrn9WxDM0SiRziqZM9IEkA9JOkkkwjDPCyAKe5Pft-h-P-GYPWb-A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" alt="">      
                            </div>

                        </div>
                    </div>`
    });


    CartTotalTag.innerText = "$" + totalPrice;
    allCartTag.innerHTML = allCartHtml;


    let getRemovePodBtnTags = document.getElementsByClassName("deleteBtn");
    for (let b = 0; b < getRemovePodBtnTags.length; b++) {
        getRemovePodBtnTags[b].addEventListener("click", function () {
            let singleCartCont = getRemovePodBtnTags[b].closest(".singleCart");

            singleCartCont.remove();

            displayCartList(removeFromCart(b, allCartData));

        });
    }



    CountTag.innerText = allCartData.length;

}

window.onload = (event) => {

    // listen to four different eventlistener at a time while typing or changing value in the search input
    ["keyup", "input", "change", "paste"].forEach(EL => {
        getSearchTagText.addEventListener(EL, function () {

            // get All product API request called to return products according to search/ filter
            getAllProducts(0, 20, categoryID, productSearchText);

            // set search text to global variable so it can be used elsewhere
            productSearchText = this.value;

        })
    })


    // call all category and all product function when page loaded without any search text or filtering
    getAllCategories();
    getAllProducts(7, 43);
    displayCartList(getAllCartFromLocalStorage())

};

