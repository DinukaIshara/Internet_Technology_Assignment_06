import {order_arr,order_detail_arr,customer_arr,item_arr} from "../db/database.js";
//import orderModel from "../models/orderModel.js";
// import orderDetailModel from "../models/orderDetailModel.js";
import {setOrdersTable,setOrderDetailsTable} from "./OrderDetailsController.js";

//$("inputCode1")

let subTotal;
let cart_arr = [];


$(document).ready(function (){
    setOrderId();

})

function generateNextOrderId(){
    let id =  order_arr.length +1;
    return "O0" + id;
}

function setOrderId(){
    $("#orderId").val(generateNextOrderId());
    console.log(generateNextOrderId());
}

$("#customerTel").on('keypress', function (e){
    if(e.which === 13 ){
        let telephoneNo = $(this).val();

        if(!searchCustomer(telephoneNo)){
            alert("No customer found.")
        }

    }
});


function searchCustomer(telephoneNo){

    let customer = customer_arr.find(customer => customer._mobile === telephoneNo);
    console.log(customer);
    if(customer !== undefined){
        $("#customerName").val(customer._first_name);
        cusId = customer._id;
        return true;
    }else {
        return false;
    }


}

export function loadItemCbx(){
    console.log("2");
    $("#itemOCode").empty();
    $("#itemOCode").append(`<option>select a item</option>`);
    item_arr.map((item, number) => {
        let data = ` <option>${item._id}</option>`

        console.log(data);
        $("#itemOCode").append(data);

    })
}


$("#itemOCode").on('input', function (){
    console.log("selected");
    let id = $(this).val();
    let codeId = item_arr.findIndex(item => item._id === id);
    if(codeId !== 'code' ){
        $("#itemOName").val(item_arr[codeId]._item_name);
        $("#itemQtyOnHand").val(item_arr[codeId]._qty);
        $("#itemPrice").val(item_arr[codeId]._price);
        $("#orderQty").focus();

    }else{
        $("#itemOName").val("");
        $("#itemQtyOnHand").val("");
        $("#itemPrice").val("");
    }

})



$("#addCart").on('click', function (){
    let itemId = $("#itemOCode").val();
    let price = +$("#itemPrice").val();
    let qty = +$("#orderQty").val();
    let total = price * qty;

    let qtyOnHand = +$("#itemQtyOnHand").val();
    let orderQty = +$("#orderQty").val();


    if (orderQty < qtyOnHand){
        let cartIndex = cart_arr.findIndex(cartItem => cartItem.itemId === itemId);
        if(cartIndex < 0){
            let cart_item = {
                itemId: itemId,
                price: price,
                qty: qty,
                total: total
            }

            cart_arr.push(cart_item);
            loadCart();
            setTotalValues();
            clearItemSection();
            $("#inputDiscount").focus();
        }else{
            cart_arr[cartIndex].qty = qty;
            cart_arr[cartIndex].total = cart_arr[cartIndex].qty * price;
            loadCart();
            setTotalValues();
            clearItemSection();

        }
    }else{
        alert("Not enough qty on hand")
    }
});


function loadCart(){
    $("#cartTableBody").empty();
    cart_arr.map((cartItem, number) => {
        let data = `<tr>
                                <td>${cartItem.itemId}</td>
                                <td>${cartItem.price}</td>
                                <td>${cartItem.qty}</td>
                                <td>${cartItem.total}</td>
                                <td><button class="cart_remove btn-danger" data-id="${cartItem.itemId}">Remove</button></td>
                            </tr>`

        $("#cartTableBody").append(data);
    })
}

$("#cartTableBody").on('click','button',function (){
    const itId = $(this).data("id");
    cart_arr = cart_arr.filter(cartItem => cartItem.itemId !== itId);
    loadCart();
    setTotalValues();
});


let netTotal=0;

function setTotalValues(){
    netTotal = calculateNetValue();
    $("#orderTotal").text(`${netTotal}`);

    subTotal = netTotal;
    $("#subTotal").text(`${subTotal}`);
    /* let dis = +$("#inputDiscount").val()/100 ;
     if(dis == 0 ){
         dis =1;
     }

     let discount = netTotal * dis;
     let subTotal = netTotal - discount;
     $("#subTotal").text(`${subTotal}`);*/


}

function calculateNetValue(){
    let total = 0;
    cart_arr.map((cartItem, number)=>{
        total += cartItem.total
    })

    return total;
}



$("#inputDiscount").on('keypress', function (e){
    if(e.which === 13 ){
        let dis = +$("#inputDiscount").val();
        if(!dis || dis == 0 ){
            subTotal = netTotal;
            $("#subTotal").text(`${subTotal}`);
        }else{
            dis = dis/100;
            let discount = netTotal * dis;
            subTotal = netTotal - discount;
            $("#subTotal").text(`${subTotal}`);
        }
        $("#inputCash").focus();


    }});

function clearItemSection(){
    $("#itemOCode").val("");
    $("#inputQtyOnHand").val("");
    $("#itemPrice").val("");
    $("#orderQty").val("");

}

$("#inputCash").on('keypress', function (e){
    if (e.which === 13){
        let cash = $("#inputCash").val();
        if (cash>subTotal){
            let balance = cash - subTotal;
            $("#inputBalance").val(balance);
        }else{
            alert("insufficient input to cash");
        }
    }
})

$("#btn_placeOrder").on('click', function (){
    let cusNumber = $("#inputCustomerTelephone1").val();
    let date = $("#inputDate").val();
    let cusName = $("#inputCustomerName2").val();
    console.log(date)
    console.log(cusName);
    let itemDesc = $("#inputDesc1").val();
    let orderQty = $("#inputOrderQty").val();

    let cartItems = cart_array.length;
    let discount = $("#inputDiscount").val();
    let cash = $("#inputCash").val();


    if(!cusName){
        Swal.fire({
            icon: "error",
            title: "Customer Name Field empty",
            text: "Enter customer telephone number and press 'Enter Key' to search customer",

        });

    }else if(!date){
        Swal.fire({
            icon: "error",
            title: "Date Field empty",
            text: "Select a date from calendar",

        });
    }/*else if(!itemDesc){
        Swal.fire({
            icon: "error",
            title: "Items Fields empty",
            text: "Select a item from select box",

        });
    }*/else if(!discount){
        Swal.fire({
            icon: "error",
            title: "Discount Fields empty",
            text: "Enter discount amount",

        });

    }else if(cartItems == 0){
        Swal.fire({
            icon: "error",
            title: "No items added to the cart",
            text: "Add items to the cart",

        });
    }else if(!cash ){
        Swal.fire({
            icon: "error",
            title: "Cash field is empty",
            text: "Fill the cash field",

        });
    }else{
        saveOrder();
        saveOrderDetails();
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Order has been placed",
            showConfirmButton: false,
            timer: 1500
        });
        setOrderId();
        clearInvoiceDetails();
        updateItem();
        blankCart();
        loadCart();
        clearPaymentDetails();
        console.log(order_array.length);
        console.log(orderDetail_array.length);
        setOrdersTable();
        setOrderDetailsTable();

    }



})


function updateItem(){
    cart_array.map((cartItem, number)=>{
        let itemNumber = cartItem.itemId;
        console.log(itemNumber);
        let itemQty = cartItem.qty;
        console.log(itemQty);

        let item = item_array.find(item => item._code === itemNumber)
        console.log(item._desc);
        item._qty  = item._qty-itemQty;

    })
}


let orderId ;
let date ;
let cusId;
let itemId = $("#inputItemId").val();
subTotal = $("#subTotal").val();

function saveOrder(){
    orderId = $("#inputOrderId").val()
    date = $("#inputDate").val();
    console.log(orderId);
    let order = new OrderModel(orderId,date,subTotal,cusId);
    order_array.push(order);
}

function saveOrderDetails(){
    cart_array.map((cartItem, number)=>{
        let orderRow = new OrderDetailsModel(orderId,cartItem.itemId, cartItem.qty);
        orderDetail_array.push(orderRow);
    })
}

function clearInvoiceDetails() {
    $("#inputCustomerTelephone1").val("");
    $("#inputCustomerName2").val("");
}

function blankCart(){
    //cart_array = [];
}

function clearPaymentDetails(){
    $("#netTotal").text("--");
    $("#subTotal").text("--");
    $("#inputDiscount").val("");
    $("#inputCash").val("");
    $("#inputBalance").val("");

}

/*let orderId = $("#inputOrderId").val();
let date = $("#inputDate").val();
let cusId;
let itemId = $("#inputItemId").val();
let subTotal = $("#subTotal").val();
//cart_arrray

function saveOrder(){
    let order = new OrderModel(orderId,date,subTotal,cusId);
    order_array.push(order);
}

function saveOrderDetails(){
    cart_array.map((cartItem, number)=>{
        let orderRow = new OrderDetailsModel(orderId,cartItem.itemId, cartItem.qty);
        cart_array.push(orderRow);

    })

}*/


//net total sub total reset wenna
//itemCombox
//itemUpdate wenna ona

























