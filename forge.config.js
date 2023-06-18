module.exports = {
  packagerConfig: {
    icon: './assets/icon',
    asar: true,
    prune: true
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "GTAJournal",
        title: "GTA Journal",
        description: "Приложение GTA Journal для ПК",
        authors: "Gizuzu",
        setupExe: "Setup.exe",
      },
    },
    {
      name: '@electron-forge/maker-zip'
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        devContentSecurityPolicy: "connect-src 'self' https://gta-journal.ru 'unsafe-eval'",
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "HM-Province",
          name: "gta-journal",
        },
        prerelease: true,
      },
    },
  ],
};
