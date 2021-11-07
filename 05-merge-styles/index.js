const fs = require('fs/promises');
const path = require('path');

async function merge() {
  const projectDistFolder = path.join(__dirname, 'project-dist');
  const stylesFolder = path.join(__dirname, 'styles');

  try {
    const files = await fs.readdir(stylesFolder, { withFileTypes: true });
    const data = [];

    for (const item of files) {
      const extName = item.name.split('.').slice(-1).toString();

      if (item.isFile() && extName == 'css') {
        const filePath = path.join(stylesFolder, item.name);
        const file = await fs.readFile(filePath, 'utf-8');
        data.push(file.trim());
      }
    }
    await fs.writeFile(path.join(projectDistFolder, 'bundle.css'), data.join('\n\n'));
    console.log('Стили объединены в project-dist/bundle.css');
  } catch (err) {
    console.log(err);
  }
}

merge();