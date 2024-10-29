import ItemModel from "../models/itemModel.js";
import {item_arr} from "../db/database.js";

$(document).ready(function (){
    $("#itemId").val(generatedId());
});

let generatedId = function generatedId(){
    console.log(item_arr.length + 1);
    let id = item_arr.length + 1;
    return "I0" + id;

}
let setItemId = () => {
    $("#itemId").val(generatedId());
}

let selected_item_index = null;
const loadItemTable = () => {
    $("#itemTableBody").empty();
    item_arr.map((item, index) => {
        console.log(item);
        let data = `<tr><td>${item.id}</td><td>${item.item_name}</td><td>${item.qty}</td><td>${item.item_description}</td><td>${item.price}</td></tr>`;
        $("#itemTableBody").append(data);
    });
}

//------- Select item for table
$('#itemTableBody').on('click','tr', function () {
    selected_item_index = $(this).index();

    let item_data = item_arr[selected_item_index];

    $("#itemId").val(item_data.id);
    $("#itemName").val(item_data.item_name);
    $("#quantity").val(item_data.qty);
    $("#itemDescription").val(item_data.item_description);
    $("#price").val(item_data.price);
});

// --------------------------------Add-Item-----------------------------

$("#add-item").on("click",function (){
    let id = generatedId();
    let item_name = $("#itemName").val();
    let qty = $("#quantity").val();
    let item_description = $("#itemDescription").val();
    let price = $("#price").val();

    let item = new ItemModel(id,item_name,qty,item_description,price);

    item_arr.push(item);

    loadItemTable();

    clean_form();

});

// ---------------------Update Item--------------------------

$("#update-item").on("click",function () {
    let id = $("#itemId").val();
    let item_name = $("#itemName").val();
    let qty = $("#quantity").val();
    let item_description = $("#itemDescription").val();
    let price = $("#price").val();

    let item = new ItemModel(id,item_name,qty,item_description,price);

    item_arr[selected_item_index] = item;
    loadItemTable();
    clean_form();


});

// -------------Delete Item--------------------

$("#delete-item").on("click",function () {

    item_arr.splice(selected_item_index,1);
    clean_form();
    loadItemTable();
});


// -------------- Clear item form -----------------
$("#clear-item").on("click", function () {
    clean_form();
});


const clean_form = () => {
    setItemId();
    $("#itemName").val("");
    $("#quantity").val("");
    $("#itemDescription").val("");
    $("#price").val("");
}