const getKeyEnvironmentVariable = (key) => {
    return process.env[key]
}

module.exports = getKeyEnvironmentVariable