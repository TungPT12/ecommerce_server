const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                },
                _id: false
            }
        ],
        totalQuantity: {
            type: Number,
            required: true
        },
    },
    avatar: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    isCounselor: {
        type: Boolean,
        required: true,
    },
    isDisable: {
        type: Boolean,
        required: true,
    },
})

userSchema.methods.addToCart = async function (productId, quantity) {
    let cartItems = this.cart.items;
    // timf kiem vị trí món hàng
    const itemPosition = cartItems.findIndex((item) => {
        return item.product.toString() === productId;
    });

    //  tìm thấy trong giỏ hàng
    if (itemPosition > -1) {
        cartItems[itemPosition].quantity = cartItems[itemPosition].quantity + quantity;
    } else {
        // khoong tim thấy trong giỏ hàng
        cartItems.push({
            product: productId,
            quantity: quantity
        })
    }
    this.cart.totalQuantity = this.cart.totalQuantity + quantity;
    this.cart.items = cartItems;
    user = await this.save();
    const items = user.cart.items;
    return this.cart
}

userSchema.methods.deleteProductInCart = async function (productId) {
    let cartItems = this.cart.items;

    // timf kiem vị trí món hàng
    const itemPosition = cartItems.findIndex((item) => {
        return item.product.toString() === productId;
    });

    const quantityItem = cartItems[itemPosition].quantity;
    cartItems.splice(itemPosition, 1)

    this.cart.totalQuantity = this.cart.totalQuantity - quantityItem;
    this.cart.items = cartItems;
    user = await this.save();
    return this.cart
}

userSchema.methods.decreaseProductInCart = async function (productId) {
    let cartItems = this.cart.items;

    // timf kiem vị trí món hàng
    const itemPosition = cartItems.findIndex((item) => {
        return item.product.toString() === productId;
    });
    if (cartItems[itemPosition].quantity > 1) {
        cartItems[itemPosition].quantity = cartItems[itemPosition].quantity - 1;
        this.cart.totalQuantity = this.cart.totalQuantity - 1;
        this.cart.items = cartItems;
        user = await this.save();
    }
    return this.cart
}


module.exports = mongoose.model('User', userSchema)