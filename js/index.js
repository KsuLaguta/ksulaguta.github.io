let services = [];

const loginReg = document.querySelector('.reg-block');
const logForm = document.querySelector(".login-form");
const main = document.querySelector('main');
const header = document.querySelector('header');
const modalService = document.querySelector('.modal-service');
const modalBasket = document.querySelector('.modal-basket');
const closeModal = document.querySelectorAll('.close-modal');
const inputDate = document.querySelector('input[type=date]');
const inputTime = document.querySelector('input[type=time]');
const onModalError = document.querySelector('p.onError');
const onModalSuccess = document.querySelectorAll('p.success');
const orderBtn = document.querySelector('#orderbtn');
var selectedService = {title: null, date: null, time: null, img: null};
var isEmpty = true;
let selectedServices = [];

//Get data from json
async function getResource () {
    let res = await fetch('http://localhost:3000/products');
    
    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
}

//After getting data, push items to services array
getResource()
.then(res => {
    res.products.map(el => services.push(el))
})
//Create items array
.then (() => {
        let items = [];

        services.map ((el, i) => { 
            let item = document.createElement('div');
            item.classList.add('service');
            item.classList.add('col-3');
            item.classList.add('col-xl-3');
            item.classList.add('col-md-5');
            item.classList.add('col-11');
            item.setAttribute('id', i);

            item.innerHTML = `
            <div class="img"><img src=${el.img} alt=""></div>
            <h5>${el.title}</h5>
            <p>${el.desc}</p>
            <button onclick="onBook('${el.title}','${el.img}')" class="btn btn-primary">Book</button>
        `;
        items.push(item);
        });

        return items;
})
//Paste each item to parent block
.then (items => {
    let parent = document.querySelector('.items');
    items.map(el => {parent.append(el)});
})


//Function relates to main page.
function onBook (title, img) {
    if (localStorage.getItem('userToken') === null){
        loginReg.style.display = 'block';
        logForm.style.display = 'block';
        main.style.display = 'none';
    }
    else {
        modalService.style.display = 'block';
        selectedService.title = title; // set title of service into the object
        selectedService.img = img; // set img of service into the object
    }
}

function onCloseModal () {
    modalService.style.display = 'none';
    modalBasket.style.display = 'none';
}

//User can't choose previous date
const date = new Date();
const datestring = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
inputDate.setAttribute('min', `${datestring}`);

//Function, when book clicked in service modal
function onBookInModal () {
    if (inputDate.value !== '' && inputTime.value !== '') {
        selectedService.date = inputDate.value;
        selectedService.time = inputTime.value;
        
        selectedServices.push(selectedService); // push selected service to array
        localStorage.setItem('orderArr', JSON.stringify(selectedServices)); // set localstorage from array
        selectedService = {};
        inputDate.value = null;
        inputTime.value = null;
        onCloseModal();
    }
    else {
        onModalError.style.display = 'block';
        setTimeout(() => onModalError.style.display = 'none', 3000)
    }
}

//Basket

function onBasketOpen () {
    modalBasket.style.display = "block";
    basketArr = JSON.parse(localStorage.getItem('orderArr'));
    let basketItems = [];
    let parent = document.querySelector('ul.order-list');
    parent.innerHTML = '';

    if (localStorage.getItem('userToken') !== null) {
        orderBtn.style.display = 'block';
        if (basketArr !== null) {
            isEmpty = false;
            basketArr.map (el => {
                let item = document.createElement('li');
                item.classList.add('basket-item');

                item.innerHTML = `
                    <div class="img-bl"><img src="${el.img}" alt=""></div>
                    <div class="text">
                        <div class="title">${el.title}</div>
                        <div class="date">${el.date} || ${el.time}</div>
                    </div>  
                `;
                basketItems.push(item);
                parent.append(item);
            })
        } else {
            let item = document.createElement ('li');
            item.classList.add('empty');
            item.innerHTML = 'The basket is empty';
            parent.append(item);
        }
    } else {
        let item = document.createElement ('div');
        item.classList.add('empty');
        item.innerHTML = 'You are not logged in. Please Log In';
        orderBtn.style.display = 'none';
        parent.append(item);
    }
    
}

//When user orders from basket modal
function onOrder () {
    if (!isEmpty) {
        localStorage.removeItem('orderArr');
        onModalSuccess[1].style.display = 'block';
        setTimeout(() => {onModalSuccess[1].style.display = 'none'; onCloseModal();}, 3000);
    } else {return;}
}