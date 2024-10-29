export default class ItemModel {
    constructor(id, item_name, qty, item_description, price) {
        this._id = id;
        this._item_name = item_name;
        this._qty = qty;
        this._item_description = item_description;
        this._price = price;
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get item_name() {
        return this._item_name;
    }

    set item_name(value) {
        this._item_name = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }

    get item_description() {
        return this._item_description;
    }

    set item_description(value) {
        this._item_description = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }
}