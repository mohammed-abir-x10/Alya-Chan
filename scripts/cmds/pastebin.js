const PastebinAPI = require('pastebin-js');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "pastebin",
    version: "1.0",
    author: "SANDIP",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Upload files to Pastebin and send link",
    },
    longDescription: {
      en: "This command uploads files to Pastebin and sends the link to the uploaded file.",
    },
    category: "Utility",
    guide: {
      en: "To use this command, type !pastebin <filename>. The file must be located in the 'cmds' folder.",
    },
  },

  onStart: async function ({ api, event, args }) {
    const pastebin = new PastebinAPI({
      api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9', // Use environment variables
      api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
    });

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage("Please provide a filename to upload.", event.threadID);
    }

    // Check for file with or without `.js` extension
    const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
    const filePathWithExtension = path.join(__dirname, '..', 'cmds', `${fileName}.js`);

    const filePath = fs.existsSync(filePathWithoutExtension)
      ? filePathWithoutExtension
      : fs.existsSync(filePathWithExtension)
      ? filePathWithExtension
      : null;

    if (!filePath) {
      return api.sendMessage("File not found in the 'cmds' folder.", event.threadID);
    }

    // Read the file and upload to Pastebin
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        return api.sendMessage("An error occurred while reading the file.", event.threadID);
      }

      try {
        const paste = await pastebin.createPaste({
          text: data,
          title: fileName,
          format: null,
          privacy: 1, // Private paste
        });

        const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");
        api.sendMessage(`File uploaded to Pastebin: ${rawPaste}`, event.threadID);
      } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while uploading to Pastebin. Please try again later.", event.threadID);
      }
    });
  },
};
