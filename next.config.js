module.exports = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.liquid$/,
      use: "raw-loader",
    })

    return config
  },
}
