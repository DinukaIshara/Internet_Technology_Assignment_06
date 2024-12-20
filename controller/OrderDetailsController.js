import {customer_arr, order_arr, order_detail_arr} from "../db/database.js";


export function setOrdersTable(){
    $("#orderTableBody").empty()
    order_arr.map((order,number) => {
        let data = `<tr>
                           <td >${order._id}</td>
                           <td >${order._cusId}</td>
                           <td >${order._total}</td>
                           <td >${order._date}</td>
                           </tr>`
        $("#orderTableBody").append(data);
    })
}

export function setOrderDetailsTable(){
    $("#orderHistoryBody").empty()

    order_detail_arr.map((orderDetail,number) => {
        let data = `<tr>
                           <td>${orderDetail._orderId}</td>
                           <td>${orderDetail._itemId}</td>
                           <td>${orderDetail._qty}</td>
                           </tr>`
        $("#orderHistoryBody").append(data);
    });
}