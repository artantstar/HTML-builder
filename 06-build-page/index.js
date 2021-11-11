const fs = require('fs/promises');
const path = require('path');

const currentFolder = path.join(__dirname, '');
const projectDistFolder = path.join(__dirname, 'project-dist');

async function html() {
  try {
    const arr = await fs.readdir(currentFolder, { withFileTypes: true });
    const projectDistCheck = arr.some((item) => item.name == 'project-dist');

    if (projectDistCheck) await fs.rm(projectDistFolder, { force: true, maxRetries: 10, recursive: true });

    const template = path.join(__dirname, 'template.html');
    const componentsFolder = path.join(__dirname, 'components');
    const componentsFiles = await fs.readdir(componentsFolder, { withFileTypes: true });
    const templateData = await fs.readFile(template, 'utf-8');
    

    await fs.mkdir(projectDistFolder);
    await fs.writeFile(path.join(projectDistFolder, 'index.html'), templateData);

    for (const item of componentsFiles) {
      const fileName = item.name.split('.')[0];
      const fileExt = item.name.split('.')[1];

      if (item.isFile() && fileExt == 'html') {
        const filePath = path.join(componentsFolder, item.name);
        const fileData = await fs.readFile(filePath, 'utf-8');
        const tag = `{{${fileName}}}`;
        const dataFile = await fs.readFile(path.join(projectDistFolder, 'index.html'), 'utf-8');
        await fs.writeFile(path.join(projectDistFolder, 'index.html'), dataFile.replace(tag, fileData));
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function styles() {
  const stylesFolder = path.join(__dirname, 'styles');

  try {
    const files = await fs.readdir(stylesFolder, { withFileTypes: true });
    const data = [];

    for (const item of files) {
      const fileExt = item.name.split('.')[1];

      if (item.isFile() && fileExt == 'css') {
        const filePath = path.join(stylesFolder, item.name);
        const file = await fs.readFile(filePath, 'utf-8');
        data.push(file.trim());
      }
    }

    await fs.writeFile(path.join(projectDistFolder, 'style.css'), data.join('\n\n'));
  } catch (err) {
    console.log(err);
  }
}

async function copyDir(filesFolder, filesCopyFolder) {
  try {
    await fs.mkdir(filesCopyFolder);
    const data = await fs.readdir(filesFolder, { withFileTypes: true });

    for (const item of data) {
      const currentFiles = path.join(filesFolder, item.name);
      const copyFiles = path.join(filesCopyFolder, item.name);

      if (item.isFile()) {
        await fs.copyFile(currentFiles, copyFiles);
      } else {
        await copyDir(currentFiles, copyFiles);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function build() {
  try {
    await html();
    await styles();
    await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    console.log('Страница успешно создана');
  } catch (err) {
    console.log(err);
  }
}

build();