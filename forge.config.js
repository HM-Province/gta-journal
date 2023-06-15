module.exports = {
  packagerConfig: {
    icon: './assets/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "GTAJournal",
        title: "GTA Journal",
        description: "Приложение GTA Journal для ПК",
        authors: "Gizuzu",
        setupExe: "Setup.exe",
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
