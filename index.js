var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    app = express(),
    Datastore = require('nedb'),
    db = new Datastore({ filename: 'assets/db/customer.db', autoload: true }),
    bodyParser = require('body-parser');
    port = 3778;
    
/**
 * Cheking primitive value `integer`, `return false;` jika `NaN`
 */
function isNumeric(val) {
    return !isNaN( parseFloat(val) ) && isFinite(val);
}

/**
 * Metode cepat untuk checking object
 */
function isObject(val) {
    return typeof val === 'object' && val !== null;
}

/**
 * List objek properti yang valid
 */
function listAllowedObjProp() {
    return [
        'date',
        'nameTeam',
        'fromTeam',
        'timeBegin',
        'timePlay',
        'downPayment',
        'moneyPaid'
    ];
}

/**
 * Pemeriksaan properti objek data customer.
 * 
 * Sebuah data customer harus memiliki properti `.date`, `.nameTeam`, `.fromTeam`,
 * `.timeBegin`, `.timePlay`, `.downPayment`, dan `.moneyPaid`.
 * 
 * Jika satu saja properti tersebut tidak ada, maka data customer tersebut
 * tidak akan dianggap valid
 * @param {object} obj
 */
function isValidDataCustomer(obj) {
    var bool = false,
        allowedObjProp = listAllowedObjProp(),
        countTrue = 0;

    for (let i = 0; i < allowedObjProp.length; i++) {
        if (obj.hasOwnProperty(allowedObjProp[i])) {
            countTrue++;
        }
    }

    if (countTrue === 7) {
        bool = true;
    }
    
    return bool;
}

/**
 * Metode untuk menghapus properti objek yang tidak valid, gunakan metode ini sebelum atau
 * sesudah metode `isValidDataCustomer()`
 * 
 * juga digunakan untuk mengisi default value untuk properti `.date`, `.timePlay`,
 * `.downPayment`, dan `.moneyPaid` jika value tersebut tidak lolos dari metode `isNumeric()`
 * @param {object} obj
 */
function filterAllowedObjProp(obj) {
    var allowedObjProp = listAllowedObjProp(),
        _obj = {};
    
    let objKeys = Object.keys(obj);
    for (let i = 0; i < objKeys.length; i++) {
        if (!allowedObjProp.includes( objKeys[i]) ) {
            delete obj[ objKeys[i] ];
        }
    }

    obj.date = parseFloat(obj.date);
    obj.downPayment = parseFloat(obj.downPayment);
    obj.moneyPaid = parseFloat(obj.moneyPaid);

    if (!isNumeric(obj.date)) {
        obj.date = Date.now();
    }

    if (!isNumeric(obj.timePlay)) {
        obj.timePlay = 0;
    }

    if (!isNumeric(obj.downPayment)) {
        obj.downPayment = 0;
    }

    if (!isNumeric(obj.moneyPaid)) {
        obj.moneyPaid = 0;
    }

    _obj = obj;

    return _obj;
}

/**
 * Metode pemberian nama file backup database disertai tanggal dan waktu
 */
function databaseFileName() {
    let dates = new Date();
    let month = dates.getMonth() + 1;
    let dateForFileName = dates.getDate() + '-' + month + '-' +
        dates.getFullYear();
    let timeForFileName = dates.getHours() + '-' + dates.getMinutes();

    return '/database_date' + dateForFileName + '_time' + timeForFileName + '.json';
}

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/insert-data', function(req, res) {
    if (req.xhr) {
        var data = req.body;
        
        if (isValidDataCustomer(data)) {
            data = filterAllowedObjProp(data);
            data.date = Date.now(); /* Generate Id */
            
            db.insert(data, function(err, doc) {
                if (err) throw err;
                res.send('');
            });
        }else {
            res.sendStatus(400);
        }
    }else {
        res.sendStatus(400);
    }
});

app.post('/get-data', function(req, res) {
    if (req.xhr) {
        let query = req.body;
        db.find(query, function(err, data) {
            res.send(JSON.stringify(data));
        });
    }else {
        res.status(400).send('Bad Request');
    }
});

app.post('/update-data', function(req, res) {
    if (req.xhr) {
        var idData = parseFloat(req.body.idData);
        var updateData = req.body.updateData;
        
        if (isValidDataCustomer(updateData)) {
            updateData = filterAllowedObjProp(updateData);
            updateData.date = idData; /* Tanggal masuknya data tidak bisa diubah */
            
            db.update({ date: idData }, updateData, function(err, num, upsert) {
                if (err) throw err;
                res.send(num.toString());
            });
        }else {
            res.sendStatus(400);
        }
    }else {
        res.sendStatus(400);
    }
});

app.post('/remove-data', function(req, res) {
    if (req.xhr) {
        var listId = req.body;
        var countDeletedData = 0;

        for (let i = 0; i < listId.length; i++) {
            db.remove({ date: parseFloat(listId[i]) }, function(err, num) {
                if (err) throw err;
                countDeletedData += num;

                if (i === listId.length - 1) { /* -1 karena index dimulai dari 0 */
                    res.send(countDeletedData.toString());
                }
            });
        }
    }else {
        res.sendStatus(400);
    }
});

app.get('/backup-database', function(req, res) {
    let pathDB = __dirname + '/assets/db/' + databaseFileName() + '.json';

    db.find({}, function(err, data) {
        fs.writeFile(pathDB, JSON.stringify(data), function(err) {
            if (err) {
                res.sendStatus(500);
                return;
            }

            res.download(pathDB, function(err) {
                fs.unlinkSync(pathDB);
            });
        });
    });
});

app.post('/restore-database', function(req, res) {
    if (req.xhr) {
        var data = req.body,
            totalData = data.length,
            totalInserted = 0;

        for (let i = 0; i < totalData; i++) {
            if (isValidDataCustomer(data[i])) {
                db.insert(filterAllowedObjProp(data[i]), function(err, doc) {
                    if (err) throw err;
                    totalInserted++;
                    if (i === totalData - 1) {
                        res.send(totalInserted.toString());
                    }
                });
            }
        }
    }else {
        res.sendStatus(400);
    }
});

app.listen(port, function() {
    console.log('Aplikasi berhasil dijalankan!');
    console.log('Buka Browser seperti Google Chrome atau Mozila');
    console.log(`dan ketikan link http://localhost:${port}`);
});