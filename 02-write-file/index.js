const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
});

console.log('Введите текст (> exit или Ctrl + C для выхода)');

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exitProgram();
  else fs.appendFile(filePath, data, (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  console.log('Ctrl + C');
  exitProgram();
});

function exitProgram() {
  console.log('Программа завершена');
  process.exit();
}