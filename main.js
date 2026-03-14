const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { app, BrowserWindow, dialog, ipcMain } = require("electron");

function getConfigPath() {
  return path.join(app.getPath("userData"), "config.json");
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(getConfigPath(), "utf8"));
  } catch {
    return {};
  }
}

function writeConfig(nextConfig) {
  fs.mkdirSync(path.dirname(getConfigPath()), { recursive: true });
  fs.writeFileSync(getConfigPath(), JSON.stringify(nextConfig, null, 2), "utf8");
}

function detectViceExecutable() {
  const candidates = [
    "C:\\Program Files\\GTK3VICE-3.9\\bin\\x64sc.exe",
    "C:\\Program Files\\GTK3VICE-3.8\\bin\\x64sc.exe",
    "C:\\Program Files\\WinVICE\\x64sc.exe",
    "C:\\Program Files (x86)\\WinVICE\\x64sc.exe"
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

ipcMain.handle("vice:get-config", async () => {
  const config = readConfig();
  return {
    vicePath: config.vicePath || detectViceExecutable()
  };
});

ipcMain.handle("vice:choose-executable", async () => {
  const result = await dialog.showOpenDialog({
    title: "Valaszd ki a VICE executable fajlt",
    properties: ["openFile"],
    filters: [
      { name: "Executable", extensions: ["exe"] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const config = readConfig();
  config.vicePath = result.filePaths[0];
  writeConfig(config);

  return {
    canceled: false,
    vicePath: config.vicePath
  };
});

ipcMain.handle("vice:launch", async (_event, payload) => {
  const config = readConfig();
  const vicePath = config.vicePath || detectViceExecutable();

  if (!vicePath || !fs.existsSync(vicePath)) {
    return {
      ok: false,
      error: "VICE executable nincs beallitva vagy nem talalhato."
    };
  }

  const tempDir = path.join(os.tmpdir(), "c64-visual-assembler");
  fs.mkdirSync(tempDir, { recursive: true });
  const fileName = payload?.fileName || `program-${Date.now()}.prg`;
  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(payload.bytes));

  try {
    const child = spawn(vicePath, [filePath], {
      detached: true,
      stdio: "ignore"
    });
    child.unref();

    return {
      ok: true,
      vicePath,
      filePath
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "VICE inditas sikertelen."
    };
  }
});

ipcMain.handle("project:save", async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: "Save C64 Visual Assembler Project",
    defaultPath: `c64-project-${Date.now()}.c64va.json`,
    filters: [
      { name: "C64 Visual Assembler Project", extensions: ["json", "c64va"] },
      { name: "JSON", extensions: ["json"] }
    ]
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  try {
    fs.writeFileSync(result.filePath, JSON.stringify(payload, null, 2), "utf8");
    return {
      ok: true,
      filePath: result.filePath
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Saving project failed."
    };
  }
});

ipcMain.handle("project:load", async () => {
  const result = await dialog.showOpenDialog({
    title: "Open C64 Visual Assembler Project",
    properties: ["openFile"],
    filters: [
      { name: "C64 Visual Assembler Project", extensions: ["json", "c64va"] },
      { name: "JSON", extensions: ["json"] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  try {
    const filePath = result.filePaths[0];
    const raw = fs.readFileSync(filePath, "utf8");
    return {
      ok: true,
      filePath,
      project: JSON.parse(raw)
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Loading project failed."
    };
  }
});

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 980,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: "#2f2a8a",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "build", "commodore64.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
