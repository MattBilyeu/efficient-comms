const fs = require('fs');

exports.deleteFiles = (arr) => {
    arr.forEach(item => {
        let filePath = '../' + item;
        fs.unlink(filePath, (err) => {
            if (err) {
                throw (err);
            }
        })
    })
}