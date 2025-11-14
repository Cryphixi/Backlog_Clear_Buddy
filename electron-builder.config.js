const { app, BrowserWindow } = require('electron');
const path = require('path');

module.exports = {
  appId: 'com.backlogbuddy.app',
  productName: 'Backlog Buddy',
  directories: {
    output: 'dist-electron',
    buildResources: 'build',
  },
  files: [
    'out/**/*',
    'electron/dist/**/*',
    'package.json',
    '!node_modules/**/*',
    'node_modules/@genkit-ai/**/*',
    'node_modules/genkit/**/*',
  ],
  extraMetadata: {
    main: 'electron/dist/main.js',
  },
  mac: {
    category: 'public.app-category.games',
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64'],
      },
    ],
    icon: 'build/icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32'],
      },
      {
        target: 'portable',
        arch: ['x64'],
      },
    ],
    icon: 'build/icon.ico',
  },
  linux: {
    target: ['AppImage', 'deb'],
    category: 'Game',
    icon: 'build/icon.png',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 130,
        y: 150,
        type: 'file',
      },
    ],
  },
  publish: null, // Set to null for local builds, configure for auto-updater
};
