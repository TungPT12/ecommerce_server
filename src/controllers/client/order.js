const Order = require("../../models/Order");
const User = require("../../models/User");
const getKeyEnvironmentVariable = require("../../utils/getKeyEnvironmentVariable");
const sendEmail = require("../../utils/send-email");
const winston = require("../../utils/winston");

exports.createOrder = async (req, res) => {
    try {
        const { name, email, items, phone, address, totalPrice } = req.body;
        const userId = req.userId;

        let itemsForEmail = [];
        let itemsForOrder = [];

        items.forEach((item) => {

            itemsForEmail.push(`<div>
                ${item.product.name}
            </div>
            <div>
                <img src="${item.product.images[0].includes("http") ? item.product.images[0] : (getKeyEnvironmentVariable('BASE_URL') + "/" + item.product.images[0])}" alt="asd"/>
            </div>
            <div>
                ${item.product.price}
            </div>
            <div>
                ${item.quantity}
            </div>
            <div>
                ${(item.quantity * item.product.price)}
            </div>
            `);
            itemsForOrder.push({
                product: item.product._id,
                price: item.product.price,
                quantity: item.quantity,
            })
        })
        console.log(itemsForEmail[0])
        const html = `<div>
            <h2>Xin chào ${name}</h2>
           <div>
                <h4>Phone: ${phone}</h4>
                <h4>Address: ${address}</h4>
           </div>
           <div>
                <div>
                    <div id="header-row">
                        <div>Tên Sản Phẩm</div>
                        <div>Hình Ảnh</div>
                        <div>Giá</div>
                        <div>Số Lượng</div>
                        <div>Thành Tiền</div>
                    </div>
                </div>
                <div>${itemsForEmail.join('')}</div>
           </div>
        </div> `

        const order = new Order({
            user: userId,
            name: name,
            email: email,
            phone: phone,
            items: items,
            address: address,
            totalPrice: totalPrice,
            delivery: 'Wating for progress',
            status: 'Wating for pay',
            items: itemsForOrder
        })
        const user = await User.findById(userId);
        const orderCreated = await order.save();
        if (orderCreated) {
            user.cart = {
                items: [],
                totalQuantity: 0
            }
            user.save();
            sendEmail(email, `Tung's Store`, html)
            winston.log({
                level: 'info',
                message: 'Hello distributed log files!'
            });
            return res.send(JSON.stringify({
                results: orderCreated
            }))
        }
        return res.status(200).send(JSON.stringify({
            message: "Cannot order!",
            success: false
        }))
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}