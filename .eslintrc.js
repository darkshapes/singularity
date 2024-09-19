module.exports = {
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
      },
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      },
    },
  },
};