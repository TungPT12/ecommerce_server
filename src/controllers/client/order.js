const Order = require("../../models/Order");
const User = require("../../models/User");
const formatPrice = require("../../utils/FormatPrice");
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
            itemsForEmail.push(`
               <div id="row" style="display: flex;font-size: 1.2rem;">
                    <div style="text-align: center;width:30%;border:1px solid #fff;color:#fff;margin: 0.6px;overflow: hidden;word-break: break-word;padding:4px;">
                        ${item.product.name}
                    </div>
                    <div style="text-align: center;width:10%;border: 1px solid #fff;color: #fff;margin:0.6px;padding: 7px 8px 4px 8px;">
                        <img style="width: 100%" src="${item.product.images[0].includes("http") ? item.product.images[0] : (getKeyEnvironmentVariable('BASE_URL') + "/" + item.product.images[0])}" alt="asd"/>
                    </div>
                    <div style="text-align: center;width:20%;border: 1px solid #fff;color: #fff;margin:0.6px;overflow: hidden;word-break: break-word;padding:4px;">
                        ${formatPrice((item.product.price).toString())} VND
                    </div>
                    <div style="text-align: center;width:10%;border: 1px solid #fff;color: #fff;margin:0.6px;overflow: hidden;word-break: break-word;padding:4px;">
                        ${item.quantity}
                    </div>
                    <div style="text-align: center;width:20%;border: 1px solid #fff;color: #fff;margin:0.6px;overflow: hidden;word-break: break-word;padding:4px;">
                        ${formatPrice((item.quantity * item.product.price).toString())} VND
                    </div>
               </div>
            `);
            itemsForOrder.push({
                product: item.product._id,
                price: item.product.price,
                quantity: item.quantity,
            })
        })
        const html = ` 
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                </head>
                <body>
                    <div style="background-color:#000;color:#fff;padding:3rem;font-family: 'Roboto';">
                        <h1>Xin chào: ${name}</h1>
                        <div style="font-size: 1rem;margin: 2.5rem 0;"">
                            <h4 style="margin-bottom: 0.5rem;">Phone: ${phone}</h4>
                            <h4 style="margin: 0 0;">Address: ${address}</h4>
                        </div>
                        <div>
                            <div>
                                <div id="header-row" style="display: flex;font-size: 1rem">
                                    <div style="text-align: center;width:30%;border: 1px solid #fff;color: #fff;margin:0.6px;overflow: hidden;word-break: break-word;padding:14px 4px;">Tên Sản Phẩm</div>
                                    <div style="text-align: center;width:10%;border: 1px solid #fff;color: #fff;margin:0.6px;overflow: hidden;word-break: break-word;padding:14px 8px;">Hình Ảnh</div>
                                    <div style="text-align: center;width:20%;border: 1px solid #fff;color: #fff;margin:0.6px;overflow: hidden;word-break: break-word;padding:14px 4px;">Giá</div>
                                    <div style="text-align: center;width:10%;border: 1px solid #fff;color: #fff;margin:0.6px;overflow: hidden;word-break: break-word;padding:14px 4px;">Số Lượng</div>
                                    <div style="text-align: center;width:20%;border: 1px solid #fff;color: #fff;margin:0.6px;overflow: hidden;word-break: break-word;padding:14px 4px;">Thành Tiền</div>
                                </div>
                            </div>
                            <div>
                                ${itemsForEmail.join('')}
                            </div>
                        </div>
                        <div style="color: #fff;margin:2rem 0rem;">
                            <h1 style="color: #fff;margin: 0;">Tổng Thanh Toán</h1>
                            h1 style="color: #fff;margin: 0;">${formatPrice(totalPrice.toString())} VND</h1>
                        </div>
                        <h1 style="color: #fff;">Cảm ơn bạn !</h1>
                    </div>
                </body>
            </html> `

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

exports.getOrders = async (req, res) => {
    try {
        const userId = req.userId;



        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send(JSON.stringify({
                message: "Not Found User!",
                success: false
            }))
        }
        const orders = await Order.find();
        return res.send(JSON.stringify({
            results: orders
        }))

        // return res.status(400).send(JSON.stringify({
        //     message: "Cannot order!",
        //     success: false
        // }))
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}



