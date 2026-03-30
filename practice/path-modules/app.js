const { log } = require('console');
const path = require('path');

// console.log(path);

//getting file name from a path
console.log(path.basename('D:/SEM 6/AWT/AWT_Codes/practice/path-modules/app.js'))

//getting the directory name
console.log(path.dirname('D:/SEM 6/AWT/AWT_Codes/practice/path-modules/app.js'))

//getting the extension type of file
console.log(path.extname('D:/SEM 6/AWT/AWT_Codes/practice/path-modules/app.js'))

//join paths (works across operating systems)
console.log(path.join('/practice','files','test.txt'))

//getting absolute path
console.log(path.resolve('test.txt'))

//access special path properties
console.log(__filename);
console.log(__dirname);

