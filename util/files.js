const fs = require('fs');
const path = require('path');

exports.deleteFiles = (arr) => {
    arr.forEach(item => {
        let filePath = path.join(__dirname, '../public' + item);
        fs.unlink(filePath, (err) => {
            if (err) {
                throw (err);
            }
        })
    })
}