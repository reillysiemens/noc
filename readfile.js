fs = require('fs');

fs.readFile(process.argv[2], 'utf8', function(err, data) {
    if (err) throw err;
    var hosts = data.toString().split("\n");
    hosts.forEach(printLine)
})

function printLine(line) {
    if (line != '') {
        console.log(line);
    }
}
