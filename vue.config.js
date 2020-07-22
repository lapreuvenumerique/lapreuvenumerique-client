const webpack = require("webpack");

module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: (config) => {
    return {
      plugins: [
        new webpack.DefinePlugin({
          APPLICATION_VERSION: JSON.stringify(
            require("./package.json").version
          ),
        }),
      ],
    };
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false,
    },
    electronBuilder: {
      builderOptions: {
        nsis: {
          perMachine: false,
          oneClick: false,
        },
        appId: "lapreuvenumerique.com",
        win: {
          icon: "build/icon.ico",
        },
      },
    },
  },
};
