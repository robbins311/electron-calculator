const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Calculator App",
        win: {
          icon: "public/cal_icon.png",
        },
        mac: {
          icon: "public/cal_icon.icns",
        },
        nsis: {
          installerIcon: "public/favicon.ico",
          uninstallerIcon: "public/favicon.ico",
          uninstallDisplayName: "CPU Monitor",
          oneClick: false,
        },
      },
    },
  },
});
