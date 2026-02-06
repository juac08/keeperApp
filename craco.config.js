const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const ignorePattern =
        /Critical dependency: the request of a dependency is an expression|react-datepicker/;
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        (warning) =>
          ignorePattern.test(
            `${warning?.message || ""} ${warning?.details || ""}`,
          ),
      ];
      return webpackConfig;
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
