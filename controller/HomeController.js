
let customer_nav = document.getElementById("customerForm");
let customer_section = document.getElementById("customerSection");

let item_nav = document.getElementById("itemForm");
let item_section = document.getElementById("itemSection");

let order_his_nav = document.getElementById("orderForm");
let order_history_section = document.getElementById("orderHistorySection");
customer_nav.addEventListener("click",function (){
    home_section.style.display="none"
    customer_section.style.display="block";
    item_section.style.display="none";
    order_section.style.display="none";
    order_history_section.style.display="none";
});

item_nav.addEventListener("click",function (){
    home_section.style.display="none"
    customer_section.style.display="none";
    item_section.style.display="block";
    order_section.style.display="none";
    order_history_section.style.display="none";
});

order_his_nav.addEventListener("click",function (){
    home_section.style.display="none"
    customer_section.style.display="none";
    item_section.style.display="none";
    order_section.style.display="none";
    order_history_section.style.display="block";
});