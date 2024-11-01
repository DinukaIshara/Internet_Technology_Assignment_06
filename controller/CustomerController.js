import CustomerModel from "../models/customerModel.js";
import {customer_arr} from "../db/database.js";

$(document).ready(function (){
    $("#customerId").val(generatedId());
});

const validateMobile = (mobile) => {
    const sriLankanMobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    return sriLankanMobileRegex.test(mobile);
}

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

let generatedId = function generatedId(){
    console.log(customer_arr.length + 1);
    let id = customer_arr.length + 1;
    return "C0" + id;

}

let setCustomerId = () => {
    $("#customerId").val(generatedId());
}

//Load data customer table
const loadCustomerTable = () => {
    $("#customerTableBody").empty();
    customer_arr.map((item, index) => {
        console.log(item);
        let data = `<tr><td>${item.id}</td><td>${item.first_name}</td><td>${item.last_name}</td><td>${item.mobile}</td><td>${item.email}</td><td>${item.address}</td></tr>`;
        $("#customerTableBody").append(data);
    });
}

//------- Select customer for table
$('#customerTableBody').on('click','tr', function () {
    selected_customer_index = $(this).index();

    let customer_data = customer_arr[selected_customer_index];
    // console.log(customer_data);

    $("#customerId").val(customer_data.id);
    $("#firstName").val(customer_data.first_name);
    $("#lastName").val(customer_data.last_name);
    $("#mobile").val(customer_data.mobile);
    $("#email").val(customer_data.email);
    $("#address").val(customer_data.address);
});

let selected_customer_index = null;


// -----------------------------Add Customers--------------------------
$("#add-customer").on("click",function (){
    console.log("Clicked button!!!");
    let id = generatedId();
    let fName = $("#firstName").val();
    let lName = $("#lastName").val();
    let mobile = $("#mobile").val();
    let eemail = $("#email").val();
    let address = $("#address").val();

    if (fName === "") {
        Swal.fire({
            icon: "error",
            title: "Invalid First Name",
            text: "Something went wrong!"
        });
    } else if (lName === "") {
        Swal.fire({
            icon: "error",
            title: "Invalid Last Name",
            text: "Something went wrong!"
        });
    } else if (!validateMobile(mobile)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Mobile Number",
            text: "Something went wrong!"
        });
    } else if (!validateEmail(eemail)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Something went wrong!"
        });
    } else if (address === "") {
        Swal.fire({
            icon: "error",
            title: "Invalid Address",
            text: "Something went wrong!"
        });
    }

    let customer = new CustomerModel(id,fName,lName,mobile,eemail,address);

    customer_arr.push(customer);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "Signed in successfully"
    });

    loadCustomerTable();

    clean_form();

});

// ---------------------Update Customer--------------------------

$("#update-customer").on("click",function () {
    //console.log("Clicked button!!!");
    let id = $("#customerId").val();
    let fName = $("#firstName").val();
    let lName = $("#lastName").val();
    let mobile = $("#mobile").val();
    let eemail = $("#email").val();
    let address = $("#address").val();

    if (fName === "") {
        Swal.fire({
            icon: "error",
            title: "Invalid First Name",
            text: "Something went wrong!"
        });
    } else if (lName === "") {
        Swal.fire({
            icon: "error",
            title: "Invalid Last Name",
            text: "Something went wrong!"
        });
    } else if (!validateMobile(mobile)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Mobile Number",
            text: "Something went wrong!"
        });
    } else if (!validateEmail(eemail)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Something went wrong!"
        });
    } else if (address === "") {
        Swal.fire({
            icon: "error",
            title: "Invalid Address",
            text: "Something went wrong!"
        });
    }

    let customer = new CustomerModel(id,fName,lName,mobile,eemail,address);

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            customer_arr[selected_customer_index] = customer;
            loadCustomerTable();
            clean_form();
            swalWithBootstrapButtons.fire({
                title: "Updated!",
                text: "Your file has been updated.",
                icon: "success"
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
            });
        }
    });

});

// ----------------Delete Customer---------------

$("#delete-customer").on("click",function () {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            customer_arr.splice(selected_customer_index,1);
            clean_form();
            loadCustomerTable();
            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
            });
        }
    });

});

$("#clear-customer").on("click", function () {
    clean_form();
});

const clean_form = () => {
    setCustomerId();
    $("#firstName").val('');
    $("#lastName").val('');
    $("#mobile").val('');
    $("#email").val('');
    $("#address").val('');
}

// --------Validation----------

// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const sriLankanMobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;

