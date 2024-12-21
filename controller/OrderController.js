import {order_arr,order_detail_arr,customer_arr,item_arr} from "../db/database.js";
import OrderModel from "../models/orderModel.js";
import OrderDetailModel from "../models/orderDetailModel.js";
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

let selected_customer_index = null;

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

$("#cashOn").on('keypress', function (e){
    if(e.which === 13 ){
        netTotal = calculateNetValue();
        getBalance(netTotal);
    }
});

function getBalance(totalNet){
    console.log(totalNet);
    let cash = $("#cashOn").val();
    console.log(cash);
    let balance = cash - totalNet;
    console.log(balance)
    $("#balanceOn").val(balance);

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

let itemname;

$("#addCart").on('click', function (){
    let itemId = $("#itemOCode").val();
    itemname = $("#itemOName").val();
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
            $("#cash").focus();
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
    $("#orderDetailsTableBody").empty();
    cart_arr.map((cartItem, number) => {
        let data = `<tr>
                                <td>${cartItem.itemId}</td>
                                <td>${cartItem.price}</td>
                                <td>${cartItem.qty}</td>
                                <td>${cartItem.total}</td>
                                <td><button class="cart_remove btn-danger" data-id="${cartItem.itemId}" onclick="deleteItemCart('${cartItem.itemId}')" >Remove</button></td>
                            </tr>`

        $("#orderDetailsTableBody").append(data);
    })
}

function deleteItemCart(name) {
    selected_customer_index = $(this).index();

    cart_arr[selected_customer_index] = null;
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


}

function calculateNetValue(){
    let total = 0;
    cart_arr.map((cartItem, number)=>{
        total += cartItem.total
    })

    return total;
}

function clearItemSection(){
    $("#itemOCode").val("");
    $("#itemOName").val("");
    $("#itemPrice").val("");
    $("#itemQtyOnHand").val("");
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
    let cusNumber = $("#customerTel").val();
    let date = $("#orderDate").val();
    let cusName = $("#customerName").val();
    console.log(date)
    console.log(cusName);
    let itemId = $("#itemOCode").val();
    let orderQty = $("#orderQty").val();

    let cash = $("#cashOn").val();


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
        order_detail_arr.splice(0,order_detail_arr.length);
        console.log(order_array.length);
        console.log(orderDetail_array.length);
        setOrdersTable();
        setOrderDetailsTable();

    }



})


function updateItem(){
    cart_arr.map((cartItem, number)=>{
        let itemNumber = cartItem.itemId;
        console.log(itemNumber);
        let itemQty = cartItem.qty;
        console.log(itemQty);

        let item = item_arr.find(item => item._code === itemNumber)
        item._qty  = item._qty-itemQty;

    })
}


let orderId ;
let date ;
let cusId;
let itemId = $("#itemOCode").val();
subTotal = $("#orderTotal").val()

function saveOrder(){
    orderId = $("#orderId").val()
    date = $("#orderDate").val();
    console.log(orderId);
    let order = new OrderModel(orderId,date,subTotal,cusId);
    order_arr.push(order);
}

function saveOrderDetails(){
    cart_arr.map((cartItem, number)=>{
        let orderRow = new OrderDetailModel(orderId,cartItem.itemId, cartItem.qty);
        order_detail_arr.push(orderRow);
    })
}

function clearInvoiceDetails() {
    $("#customerTel").val("");
    $("#customerName").val("");
}

function blankCart(){
    //cart_array = [];
}

function clearPaymentDetails(){
    $("#orderTotal").text("00.00");
    $("#cashOn").val("");
    $("#balanceOn").val("");

}


//net total sub total reset wenna
//itemCombox
//itemUpdate wenna ona


























