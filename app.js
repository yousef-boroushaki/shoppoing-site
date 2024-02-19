const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");


const productsDOM = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItem = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");


const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnLogin = document.querySelector('.btn-login');
const iconClose = document.querySelector('.icon-close1');

import { productsData } from "./products.js";

let cart = [];
let buttsDOM = [];

// login , register

 function showLogin() {
    backDrop.style.display = "block";
    wrapper.style.opacity = "1";
    wrapper.style.top = "30%";
    wrapper.style.left = "20%";
 }

 function closeLogin() {
    backDrop.style.display = "none";
    wrapper.style.opacity = "0";
    wrapper.style.top = "-100%";
}

iconClose.addEventListener("click" , closeLogin);

 btnLogin.addEventListener("click" , showLogin); 

registerLink.addEventListener('click' , ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click' , ()=> {
    wrapper.classList.remove('active');
});

btnLogin.addEventListener('click' , ()=> {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click' , ()=> {
    wrapper.classList.remove('active-popup');
});



// 1. get products

class Products {
    getProducts() {
        return productsData;
    }
}

// 2. displat products

class UI { 
    displayProducts(products) {
        let result = "";
        products.forEach(item => {
            result += `
    <section class="product">                         
        <div class="img-container">
            <img class="product-img" src=${item.imageUrl} />
        </div>    
           <div class="product-desc">
            <p class="product-title">${item.title}</p>
            <p class="product-price">$ ${item.price}</p>
           </div>
           <button class="add-to-cart" data-id = ${item.id} >add to cart</button>
    </section> `;
            productsDOM.innerHTML = result;
        });
    }
    getAddToCartBtns(){
        const addTocartBtn = [...document.querySelectorAll(".add-to-cart")];
        buttsDOM = addTocartBtn;
        
        addTocartBtn.forEach(btn => {
            const id = btn.dataset.id;
            // check if this product in cart or not
            const isInCart = cart.find(p => p.id === parseInt(id));
            if(isInCart) {
                btn.innerText = 'In Cart';
                btn.disabled = true;     
           }
        btn.addEventListener("click", (event) => {
             event.target.innerText = "In Cart";
             event.target.disabled =  true;
            // get product
            const  addedProduct = {...Storage.getPoducts(id),  quantity: 1};           
            // add to cart
            cart = [...cart, addedProduct];
            // save to local storage 
            Storage.saveCart(cart);  
            //upadet cart item 
            this.setCartValue(cart); 
            // add to cart item
            this.addCartItem(addedProduct);
            // get cart from storage
        });
        });
    } 
    setCartValue(cart) {
        // cart items
        // cart total price
        let   tempCartItems = 0;
        const totalPrice = cart.reduce((acc, curr) => {
            tempCartItems += curr.quantity;
             return acc + curr.quantity * curr.price; // 2 + 1 = 0
        },0);
        cartTotal.innerText = `total price : ${totalPrice.toFixed(2)} $`; // do raghm ashar toFixed 2
        cartItem.innerText = tempCartItems;
        
    }
    addCartItem(cartItem) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = ` 
        <img class="cart-item-img" src=${cartItem.imageUrl} alt="image 1">
        <div class="cart-item-desc">
            <h4>${cartItem.title}</h4>
            <h5>$ ${cartItem.price}</h5>
        </div>
        <div class="cart-item-controller">
            <i class="fa fa-arrow-up" aria-hidden="true" data-id=${cartItem.id}></i>
            <p>${cartItem.quantity}</p>
            <i class="fa fa-arrow-down" aria-hidden="true" data-id=${cartItem.id}></i>
        </div>
        <i class="fa fa-trash-o" style="font-size:30px" data-id=${cartItem.id}></i>
        `;
        cartContent.appendChild(div);
    }
    //  not delete items when reload
    setupApp(){
        // get cart from storage
        cart = Storage.getCart() || [];
        // addcartitem
        cart.forEach((cartItem) => this.addCartItem(cartItem));
        // set values: price + items
        this.setCartValue(cart);
    }
    cartLogic(){
        // clear cart
       clearCart.addEventListener('click', () => this.clearCart()); 

    //    cart func
        cartContent.addEventListener("click", (event) => {
            if(event.target.classList.contains("fa-arrow-up")) {
               const addQuantity = event.target;
            //    get item from cart
            const addedItem = cart.find(
                cItem => cItem.id == addQuantity.dataset.id
                );
                addedItem.quantity++;
                // update cart value
                this.setCartValue(cart);
                //  save cart
                Storage.saveCart(cart);
                // update cart item in UI
                addQuantity.nextElementSibling.innerText = addedItem.quantity;
            } else if(event.target.classList.contains("fa-trash-o")){
                const removeItem = event.target;
                const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);

                this.removeItem(_removedItem.id);
                Storage.saveCart(cart);
                cartContent.removeChild(removeItem.parentElement);

            }else if(event.target.classList.contains("fa-arrow-down")){
                const subQuantity = event.target;
                const subStracktedItem =
                 cart.find((c) => c.id == subQuantity.dataset.id);

                if(subStracktedItem.quantity === 1) {
                    this.removeItem(subStracktedItem.id);
                    cartContent.removeChild(subQuantity.parentElement.parentElement);
                }

                subStracktedItem.quantity--;
                this.setCartValue(cart);
                //  save cart
                Storage.saveCart(cart);
                // update cart item in UI
                subQuantity.previousElementSibling.innerText = subStracktedItem.quantity;

            }
    });
}


    clearCart() {
        // remove :
        cart.forEach(cItem => this.removeItem(cItem.id));
        // remove cart content children
        while (cartContent.children.length) {
        cartContent.removeChild(cartContent.children[0]);
    }
       closeModalFunction();
    }


    removeItem(id) {
        // update cart
        cart = cart.filter((cItem) => cItem.id !== id);
        // total price and title 
        this.setCartValue(cart);
        // update storage
        Storage.saveCart(cart);

        // update cart btn text
        this.getSingleButton(id);
    }

    getSingleButton(id) {
        const button = buttsDOM.find(
            (btn) => btn.dataset.id == parseInt(id));
        button.innerText = "add to cart";
        button.disabled = false; 
    }
}

// 3. storage
   
class Storage { 
    static  saveProducts(products) {
        localStorage.setItem("products" ,JSON.stringify(products));
    }
    static  getPoducts(id) {
        let _products = JSON.parse(localStorage.getItem("products"));
        return _products.find((p) => p.id === parseInt(id));    
    }
    static  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    }
    static  getCart(id) {
        return JSON.parse(localStorage.getItem("cart"));
           
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProducts();
    const ui = new UI();
    // set up : get cart and set up app
    ui.setupApp();
    ui.displayProducts(productsData);
    ui.getAddToCartBtns();
    ui.cartLogic();
    Storage.saveProducts(productsData);
});


function showModalFunction() {
    backDrop.style.display = "block";
    cartModal.style.opacity = "1";
    cartModal.style.top = "30%";
    cartModal.style.left = "40%";
}

function closeModalFunction() {
    backDrop.style.display = "none";
    cartModal.style.opacity = "0";
    cartModal.style.top = "-100%";
}


cartBtn.addEventListener("click" , showModalFunction);
closeModal.addEventListener("click" , closeModalFunction);
backDrop.addEventListener("click" , closeModalFunction);

