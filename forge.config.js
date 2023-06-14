module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "GTAJournal",
        description: "Приложение GTA Journal для ПК",
        authors: "Gizuzu",
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
