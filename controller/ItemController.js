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