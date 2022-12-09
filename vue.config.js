const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Calculator App",
        appId: "test.com",
        win: {
          // target: ["nsis"],
          icon: "public/cal_icon.png",
          // requestedExecutionLevel: "requireAdministrator",
        },
        nsis: {
          installerIcon: "public/favicon.ico",
          uninstallerIcon: "public/favicon.ico",
          uninstallDisplayName: "CPU Monitor",
          oneClick: false,
          // allowToChangeInstallationDirectory: true,
        },
      },
    },
  },
});
