"use strict";

/* main.js, elctron 진입점 */
import { app, protocol, BrowserWindow, autoUpdater, dialog } from "electron";
import { isDev } from "electron-is-dev";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  // window default width, height(min, max값도 가능)
  const win = new BrowserWindow({
    width: 520,
    height: 660,
    resizable: true,
    // 앱 실행시 window 중앙 위치
    // center: true,
    // window 항상 최상단 위치, 기본값 false
    alwaysOnTop: true,
    // 메뉴바 숨김여부
    autoHideMenuBar: true,
    webPreferences: {
      // node기반 라이브러리 사용여부, 기본값 true
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // preload 스크립트, 기본값 true
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  // devMode 일때 devtools autoOpen, electron-is-dev 추가해야함
  if (isDev) {
    win.webContents.openDevTools();
  }
}

//[생명주기] 모든 창이 닫히면 자동으로 앱 종료
app.on("window-all-closed", () => {
  // darwin(unix) 운영체제 = macOS
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  autoUpdater.checkForUpdates();
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
autoUpdater.on("checking-for-update", function () {
  console.log("Checking-for-update");
});
autoUpdater.on("error", function (error) {
  console.error("error", error);
});
autoUpdater.on(
  "download-progress",
  function (bytesPerSecond, percent, total, transferred) {
    console.log(`${bytesPerSecond}, ${percent}, ${total}, ${transferred}`);
  }
);
//다운로드 완료되면 업데이트
autoUpdater.on(
  "update-downloaded",
  function (event, releaseNotes, releaseName) {
    console.log("update-downloaded");
    const dialogOpts = {
      type: "info",
      buttons: ["재시작", "종료"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail:
        "새로운 버전이 다운로드 되었습니다. 애플리케이션을 재시작하여 업데이트를 적용해 주세요.",
    };
    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) {
        autoUpdater.quitAndInstall();
      } else {
        app.quit();
        app.exit();
      }
    });
  }
);
//신규 업로드가 있을경우 === 구버전
autoUpdater.on("update-available", function () {
  console.log("A new update is available");
});

//신규 업로드가 없을경우 === 최신버전
autoUpdater.on("update-not-available", function () {
  console.log("update-not-available");
});
