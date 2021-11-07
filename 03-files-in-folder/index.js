const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

const files = async () => {
  const data = await fs.readdir(dirPath, { withFileTypes: true });
  data.forEach(async (file) => {
    if (file.isFile()) {
      await fs.stat(path.join(dirPath, file.name)).then((stats) => {
        const extName = path.extname(path.join(dirPath, file.name));
        const fileName = path.basename(file.name, extName);
        console.log(`${fileName} - ${extName.slice(1)} - ${stats.size / 1024}kb`);
      }).catch((err) => console.error(err));
    }
  });
};

files().catch((err) => console.error(err));