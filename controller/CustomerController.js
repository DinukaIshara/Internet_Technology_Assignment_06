import CustomerModel from "../models/customerModel.js";
import {customer_arr} from "../db/database.js";

$(document).ready(function (){
    $("#customerId").val(generatedId());
});

let generatedId = function generatedId(){
    console.log(customer_arr.length + 1);
    let id = customer_arr.length + 1;
    return "C0" + id;

}
