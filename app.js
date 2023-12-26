// hämtar här elementen från HTML som kommer vara centrala i hela koden
const productsElement = document.querySelector(".products"); 
const cartItemsElement = document.querySelector(".cart-items");
const subtotalElement = document.querySelector(".subtotal");
const buyElement= document.querySelector(".checkout");
const deletElement = document.querySelector(".delet")

// rendera produkter som finns i produkt arrayen med obejkt.
function renderProducts(products) { // funktion för render products
  productsElement.innerHTML = ""; // börjar med ett tomt 
  products.forEach((product) => {// loopar för att gå igenom hela listan av array av obeject, vilket är produkter
    // ändrar diven som heter products i html, genom template literals för att använda HTML koden som en mall för alla produkter i arrayen av object. och meddelar vilken information som ska hämtas.
    productsElement.innerHTML += ` 
            <div class="item">
                <div class="item-container">
                    <div class="item-img">
                        <img src="${product.imgSrc}" alt="${product.name}">
                    </div>
                    <div class="desc">
                        <h2>${product.name}</h2>
                        <h2>${product.price}</h2>
                        <p>
                            ${product.description}
                        </p>
                    </div>
                    <div class="add-to-cart" onclick="addToCart(${product.id})"> <!-- en onclick event för att lägga till produkter i varukorgen, med product.id som parameter för att särskilja vilken vara som ska läggas till--->
                        <img src="./icons/bag-plus.png" alt="add to cart">
                    </div>
                </div>
            </div>
    `;
  });
}
renderProducts(products); // rendeer products för att uppdatera. 

// CART ARRAY
let cart = JSON.parse(localStorage.getItem("CART")) || []; // här skapas en ny tom array för att spara objecten/produkterna i, de sparas i localstorage som minns och sparar informationen. 
updateCart();

// add to cart
function addToCart(id) {// funktion för att lägga till i varukorg. 
  if (cart.some((product) => product.id === id)) { // ett if statment för att se om producten redan finns i cart arrayen. via att jämföra om id redan finns. some() kontrollerar om något element i arrayen passerar den specifika funktionen.
    changeNumberOfUnits("plus", id);// om id redan finns plussa på det id som är hittat.
  } else {
    const product =products.find((product) => product.id === id); //find, för att hitta den objectet, förutsättningen för att hitta produkten är via produktens id som ska stämma överrens med det id som finns i parametern för fuktionen. find() är en Jquery selector och används för att elementen som matchar selectorn ska användas.

    product.numberOfUnits = 1;// tilägg 1

    cart.push(product); // när id är korrekt, används push för att föra produkten till den nya arrayen som heter cart. 
  }

  updateCart();// en nya funktion för att uppdatera cart,
}

// update cart
function updateCart() { // funktionen för att uppdatera cart
  renderCartItems();//när den uppdateras justers produkt listan
  renderSubtotal();// när den uppdaters justeras subtotal

  // update local storage
  localStorage.setItem("CART", JSON.stringify(cart));
}

// render cart items
function renderCartItems() { // funktion för att render cartitems, likande den översta
  cartItemsElement.innerHTML = ""; // börjar med en tom innerHTML
  cart.forEach((item) => { // foreach metod för att render cartitem
    //cartitems inner HTML ändras, via backticks för HTML kod
    cartItemsElement.innerHTML += `
            <div class="cart-item" class="card">
                <div class="item-info" class="card-img-top"alt="" onclick="removeFromCart(${item.id})"> <!---onclick funktion för funktion removeFromeCart--->
                    <img src="${item.imgSrc}" alt="${item.name}">
                </div>
                <div class="unit-price" class = "card-title text-info">
                  ${item.price}<p>kr</p>
                </div>
                <div class="units">
                    <div class="btn minus" onclick="changeNumberOfUnits('minus' ,${item.id})">-</div> <!---onclick funktion för funktion plussa på, med parameter item.id--->
                    <div class="number">${item.numberOfUnits}</div> <!--- item.numberOfUnits för att den ska lägga till istället för att lägga till en helt nu---> 
                    <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>   <!---onclick funktion för funktion minus, med parameter för item.id--->         
                </div>
            </div>
        `;
  });
}

// render subtotal
function renderSubtotal() { // funktion för att räkna ut summan
  subtotal = 0; // börjar med att sätta på noll
  numberOfItems = 0; // börjar med att sätta items på noll

  cart.forEach((item) => { // forEach metod för att räkna på varje item, där av items som parameter
    subtotal += item.price * item.numberOfUnits; //räknar item price gånger item units
    numberOfItems += item.numberOfUnits; 
  });

  document.querySelector(".total-items-in-cart").innerHTML = numberOfItems;
  subtotalElement.innerText = `summan (${numberOfItems} st)${subtotal.toFixed( // subtotal är number of itmes som fixeras för att inte visa decimaler
    2
  )}kr`;
}
// change number of units
function changeNumberOfUnits(change, id) { // funktion för att lägga till och dra ifrån produkter
  cart = cart.map((product) => { //utgår från arrayen cart för att se om produkten finns där, via metoden map, som har en fuktuon att kontrollera varje elemnt i cart. 
    if (product.id === id) { // en if medtod för att kolla om id finns, och då kommer produkten ändas
      let numberOfUnits = product.numberOfUnits;

      if (change === "plus" && numberOfUnits < product.instock) {// om oncklick är plus kommer detta ske om det finns in stock
        numberOfUnits++; //öka med 2
      } else if (change === "minus" && numberOfUnits > 1) { // om onclick är minus, kommer detta ske om det är mer än ett ( för att inte kunna köpa "minus")
        numberOfUnits--; // minska med 1
      }

      return {
        ...product, // retunerar produkten
        numberOfUnits,
      };
    } else {
      return product;
    }
  });

  updateCart(); // uppdatera 
}

function deletCart(){ // radera hela varukorgen
cart= []; // funktionen gör att cart/varukorgen blir en tom array igen
subtotalElement.innerHTML= `subtotal (${0})kr`; // här sätts även summan ner till noll
updateCart();// uppdaterar vart för att den ska bli tom
}

function buyitems(){// funktionen för att gå vidare till varukorgen
  document.querySelector(".total-items-in-cart").innerHTML = numberOfItems; // antal som finns
  buyElement.innerText = `DU har har ${numberOfItems} blommor i varukorgen för en summa av ${subtotal.toFixed()}kr`;// här uträkning av de varor som finns och vad det kostar, denna funktion aktiveras på "oncklick"
}



