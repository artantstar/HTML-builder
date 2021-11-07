const fs = require('fs/promises');
const path = require('path');

async function copy() {
  const currentFolder = path.join(__dirname, '');
  const filesFolder = path.join(__dirname, 'files');
  const filesCopyFolder = path.join(__dirname, 'files-copy');

  try {
    const data = await fs.readdir(currentFolder, { withFileTypes: true });
    const filesCheck = data.some((item) => item.name == 'files');
    const filesCopyCheck = data.some((item) => item.name == 'files-copy');

    if (filesCopyCheck) await fs.rm(filesCopyFolder, { force: true, maxRetries: 10, recursive: true });
    if (filesCheck) {
      await copyFiles(filesFolder, filesCopyFolder);
      console.log('Файлы успешно скопированы');
    } else console.log('Папка отсутствует, копирование невозможно');
  } catch (err) {
    console.log(err);
  }
}

async function copyFiles(filesFolder, filesCopyFolder) {
  await fs.mkdir(filesCopyFolder);
  const data = await fs.readdir(filesFolder, { withFileTypes: true });

  for (const item of data) {
    const currentFiles = path.join(filesFolder, item.name);
    const copyFiles = path.join(filesCopyFolder, item.name);

    if (item.isFile()) {
      await fs.copyFile(currentFiles, copyFiles);
    } else {
      await copyCurrentDir(currentFiles, copyFiles);
    }
  }
}

copy();