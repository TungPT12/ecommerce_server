exports.searchProductByCategoryId = (products, categoryId) => {
    if (!categoryId) {
        return products;
    }
    const productsFilterByCategoryId = products.filter((product) => {
        return product.category._id.toString() === categoryId
    })
    return productsFilterByCategoryId
}

exports.searchProductByName = (products, name) => {
    if (!name) {
        return products;
    }
    const productsFilterByName = products.filter((product) => {
        return product.name.toLowerCase().includes(name.toLowerCase())
    });
    return productsFilterByName
}