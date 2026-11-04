// Minifica _dev/Index-SORGENTE.html → ../index.html (il file pubblicato da GitHub Pages)
const { minify } = require('html-minifier-terser');
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'Index-SORGENTE.html'), 'utf8');
minify(src, { collapseWhitespace: true, conservativeCollapse: true, removeComments: true, minifyCSS: true, minifyJS: { mangle: true } }).then((o) => {
  fs.writeFileSync(path.join(__dirname, '..', 'index.html'), o);
  console.log('index.html', Buffer.byteLength(o), 'byte');
});
