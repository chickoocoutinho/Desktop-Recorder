const { Menu  } = require("electron");
const isMac = process.platform === "darwin";

var MenuBuilder = function(mainWindow, appName) {

  // https://electronjs.org/docs/api/menu#main-process
  let defaultTemplate = function() {
    return [
      // { role: "appMenu" }
      ...(isMac
        ? [
            {
              label: appName,
              submenu: [
                {
                  role: "about"
                },
                {
                  type: "separator"
                },
                {
                  role: "services"
                },
                {
                  type: "separator"
                },
                {
                  role: "hide"
                },
                {
                  role: "hideothers"
                },
                {
                  role: "unhide"
                },
                {
                  type: "separator"
                },
                {
                  role: "quit"
                }
              ]
            }
          ]
        : []),
      // { role: "fileMenu" }
      {
        label: "File",
        submenu: [
          isMac
            ? {
                role: "close"
              }
            : {
                role: "quit"
              }
        ]
      },
      {
        label: "Window",
        submenu: [
          {
            role: "minimize"
          },
          {
            role: "zoom"
          },
          ...(isMac
            ? [
                {
                  type: "separator"
                },
                {
                  role: "front"
                },
                {
                  type: "separator"
                },
                {
                  role: "window"
                }
              ]
            : [
                {
                  role: "close"
                }
              ])
        ]
      },
      {
        role: "help",
        submenu: [
          {
            label: "Learn More",
            click: async () => {
              const { shell } = require("electron");
              await shell.openExternal("https://electronjs.org");
            }
          }
        ]
      }
    ];
  };

  return {
    buildMenu: function() {
      const menu = Menu.buildFromTemplate(defaultTemplate());
      Menu.setApplicationMenu(menu);

      return menu;
    }
  };
};

module.exports = MenuBuilder;
