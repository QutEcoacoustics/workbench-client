import linkerPlugin from "@angular/compiler-cli/linker/babel";

export default {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [linkerPlugin],
            compact: false,
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};
