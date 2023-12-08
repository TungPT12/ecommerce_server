const Order = require("../../models/Order");
// const Transaction = require("../../models/Transaction");

// const transactionPerPage = 8;

// exports.getTransactions = async (req, res) => {
//     try {
//         let { page } = req.query;
//         if (page) {
//             page = parseInt(page)
//         }
//         const transactions = await Transaction.find().populate({ path: 'hotelId', select: 'name' }).populate('userId');
//         if (!transactions) {
//             return res.status(400).send(JSON.stringify({
//                 message: "Cannot get transactions ! ",
//                 success: false
//             }))
//         }
//         if (transactions.length === 0) {
//             return res.send(JSON.stringify({
//                 page: 0,
//                 results: [],
//                 pageSize: 0,
//             }))
//         }
//         const total_pages = Math.ceil(transactions.length / transactionPerPage);
//         if (page > total_pages) {
//             return res.send(JSON.stringify({
//                 errors: `page must be less than or equal to ${total_pages}`,
//                 success: false
//             }));
//         }
//         const results = paging(transactions, transactionPerPage, page)
//         return res.send(JSON.stringify({
//             page: page ? page : 1,
//             results: results,
//             total_pages: total_pages
//         }))
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(JSON.stringify({
//             message: "Server Error",
//             success: false
//         }))
//     }
// }

exports.getOrdersNew = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createDate: -1 })
        const date = new Date();
        const thisYear = date.getFullYear();
        const thisMonth = date.getMonth() + 1;

        const ordersInThisMonth = orders.filter((order) => {
            return order.create_at.getMonth() + 1 === thisMonth && order.create_at.getFullYear() === thisYear;
        });

        const earningInMonth = ordersInThisMonth.reduce((sum, order) => {
            return sum = sum + order.totalPrice;
        }, 0)

        return res.send(JSON.stringify({
            countNewOrders: ordersInThisMonth.length,
            earningInMonth: earningInMonth,
            results: ordersInThisMonth
        }))
    } catch (error) {
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}


// exports.getNumberTransactions = async (req, res) => {
//     try {
//         const transactionsCount = await Transaction.find().count()
//         if (!transactionsCount) {
//             return res.status(400).send(JSON.stringify({
//                 message: "Cannot get number transactions  ! ",
//                 success: false
//             }))
//         }
//         return res.json({
//             totalTransaction: transactionsCount
//         })
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).send(JSON.stringify({
//             message: "Server Error",
//             success: false
//         }))
//     }
// }

// exports.getBalance = async (req, res) => {
//     try {
//         const transactions = await Transaction.find()
//         if (!transactions || transactions.length <= 0) {
//             return res.json({
//                 balance: 0,
//             })
//         }

//         const balance = transactions.reduce((initBalance, transaction) => {
//             return initBalance + transaction.price
//         }, 0)
//         return res.json({
//             balance: balance
//         })
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).send(JSON.stringify({
//             message: "Server Error",
//             success: false
//         }))
//     }
// }