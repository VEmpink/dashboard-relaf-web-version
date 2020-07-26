'use strict';

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
 * Metode untuk mengubah Waktu Unix ke waktu biasa
 */
Number.prototype.toRegularDate = function() {
    let dates = new Date(this);
    let days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    let day = days[dates.getDay()];
    let date = dates.getDate();
    let month = dates.getMonth();
    let year = dates.getFullYear();
    let hour = dates.getHours();
    if (hour.toString().length === 1) {
        hour = '0' + dates.getHours();
    }
    let min = dates.getMinutes();
    if (min.toString().length === 1) {
        min = '0' + dates.getMinutes();
    }
    return day + ' ' + date + '/' + month + '/' + year + ' ' + hour + ':' + min;
}

/**
 * Metode untuk mengubah angka biasa ke mata uang indonesia
 */
Number.prototype.toIndonesianCurrency = function() {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency',
        currency: 'IDR' 
    }).format(this);
}

/**
 * Simpan pengaturan auto backup di `localStorage`
 * @param {object} obj 
 */
function saveAutoBackupSettings(obj) {
    return localStorage.setItem('autoBackupSettings', JSON.stringify(obj));
}

/**
 * Ambil pengaturan auto backup di `localStorage`
 * @returns {object}
 */
function getAutoBackupSettings() {
    return JSON.parse(localStorage.getItem('autoBackupSettings'));
}

/**
 * Hapus pengaturan auto backup di `localStorage`
 */
function removeAutoBackupSettings() {
    return localStorage.removeItem('autoBackupSettings');
}

/**
 * Simpan total data per pagination di `localStorage`
 * @param {number} val
 */
function saveTotalDataPerPagination(val) {
    return localStorage.setItem('dataPerPagination', val);
}

/**
 * Ambil total data per pagination yang tersimpan di `localStorage`
 */
function getTotalDataPerPagination() {
    return parseInt(localStorage.getItem('dataPerPagination'));
}

/**
 * Simpan nomor halaman pagination saat ini di `sessionStorage`
 * @param {number} val
 */
function saveCurrentNumberPagination(val) {
    return sessionStorage.setItem('currentNumberPagination', val);
}

/**
 * Ambil halaman pagination saat ini yang tersimpan di `sessionStorage`
 */
function getCurrentNumberPagination() {
    return parseInt(sessionStorage.getItem('currentNumberPagination'));
}

/**
 * Simpan Total halaman pagination di `sessionStorage`
 * @param {number} val
 */
function saveTotalPagination(val) {
    return sessionStorage.setItem('totalPagination', val);
}

/**
 * Ambil Total halaman pagination di `sessionStorage`
 */
function getTotalPagination() {
    return parseInt(sessionStorage.getItem('totalPagination'));
}

/**
 * Simpan code value penyortiran saat ini di `sessionStorage`
 * @param {string} val
 */
function saveCurrentSortVal(val) {
    return sessionStorage.setItem('currentSortValue', val);
}

/**
 * Ambil code value penyortiran saat ini di `sessionStorage`
 * @returns {string}
 */
function getCurrentSortVal() {
    return sessionStorage.getItem('currentSortValue');
}

/**
 * Simpan Id di `sessionStorage` dari data yang dipilih oleh pengguna yang ada di tabel
 * @param {[number]} val
 */
function saveSelectedDatatableId(val) {
    return sessionStorage.setItem('SelectedDatatableId', val);
}

/**
 * Ambil list Id di `sessionStorage` dari data yang telah dipilih
 * @returns {[number]}
 */
function getSelectedDatatableId() {
    return JSON.parse(sessionStorage.getItem('SelectedDatatableId'));
}

/**
 * Hapus Id dari data terpilih yang tersimpan di `sessionStorage`
 */
function removeSelectedDatatableId() {
    return sessionStorage.removeItem('SelectedDatatableId');
}

/**
 * Simpan FormData #form-select-date di `sessionStorage`
 * @param {object} val - FormData
 */
function saveFormData_FormSelectDate(val) {
    return sessionStorage.setItem('SelectedDate', JSON.stringify(val));
}

/**
 * Ambil FormData #form-select-date di `sessionStorage`
 * @returns {object}
 */
function getFormData_FormSelectDate() {
    return JSON.parse(sessionStorage.getItem('SelectedDate'));
}

/**
 * Menghapus FormData #form-selected-date di `sessionStorage`
 */
function removeFormData_FormSelectDate() {
    return sessionStorage.removeItem('SelectedDate');
}

/**
 * `XMLHttpRequest` method `POST`
 * 
 * Valid value `"/insert-data"`, `"/get-data"`, `"/update-data"`,
 * `"/remove-data"`, `"/backup-database"`,`"/restore-database"`,
 * @param {string} url - Valid value
 * @param {object} data - Atau `query` untuk `"/get-data"`, `"/update-data"` `"/remove-data"`
 * @param {Function} callback
 */
function ipcRequest(url, data, callback) {
    var xhr = new XMLHttpRequest;

    xhr.open('POST', url, true);
    
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function(e) {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                callback(this.response);
            }else {
                showToastsMsg('error', 'Kode Status ' + this.status);
            }
        }
    }

    xhr.send(JSON.stringify(data));
}

/**
 * Metode untuk menampilkan, mencari, atau me-refresh, sebuah data dengan secara spesifik.
 * @param {number} [dataPerPagination] - Max = 15, default = 5
 * @param {number} [currentPagination] - Default = 1
 * @param {string} [sortBy] - Valid value `"sortByOldestDate"`, `"sortByNameTeam"`,
 *      `"sortByNameTeam-reverse"`, `"sortByFormTeam"` atau `"sortByFormTeam-reverse"`,
 *      Default data diurutkan dari tanggal terbaru.
 * @param {string} [searchQuery] - Diisi untuk mencari data berdasarkan nama tim atau asalnya
 * @param {object} [filterDataByDate] - Diisi untuk mencari data dari tanggal dan sampai tanggal,
 *      parameter ini lebih ditunjukan untuk `#form-select-date`
 * @param {string} [getAverageIncome] - Menampilkan rata - rata penghasilan `"perDay"`,
 *      `"perWeek"`, `"perMonth"`, atau `"perYear"`
 */
function getDatatable(dataPerPagination, 
                      currentPagination,
                      sortBy,
                      searchQuery,
                      filterDataByDate,
                      getAverageIncome) {

    ipcRequest('get-data', {}, function(dataCustomer) {
        try {
            dataCustomer = JSON.parse(dataCustomer);
        } catch (error) {
            showToastsMsg('error', 'Fatal! File database tidak valid!');
        }

        /** Untuk PARAMETER searchQuery */
        let allDataCustomer = dataCustomer;
            
        /*
         * Menyaring datatable dengan tanggal,
         * Contoh: Ambil datatable dari tanggal 01/01/2020 sampai 10/10/2020
         */
        const dateSelected = filterDataByDate;
        const dataSelectedByDate = [];
        
        if (isObject(dateSelected)) {
            for (const key in dateSelected) {
                dateSelected[key] = Date.parse(dateSelected[key]); /* Hasil pasti numeric */
                
                if ( !isNumeric(dateSelected[key]) ) {
                    dateSelected[key] = Date.now();
                }
            }

            /*
             * Default Input Date adalah Jam 07:00 AM/Pagi
             * dateStart dikurang 7 Jam = Jam 00:00 AM/Pagi
             * dateEnd ditambah 17 Jam kurang 1 detik = Jam 23:59:59 PM/Malam
             * 
             * milidetik * detik * menit * jam
             */
            const _7H = 1000 * 60 * 60 * 7; /* 7 Jam */
            const _17H = 1000 * 60 * 60 * 17 - 1000; /* 17 Jam Kurang 1 detik */

            let dateStart = parseFloat(dateSelected.dateStart) - _7H;
            let dateEnd = parseFloat(dateSelected.dateEnd) + _17H;

            let dateEndToStart = dateEnd - _17H - _7H;
            let dateStartToEnd = dateStart + _17H + _7H;

            /* Contoh : dateStart = 10/10/2020 lebih besar dari dateEnd = 01/01/2020 */
            if (dateStart > dateEnd) {
                /* dateStart = 01/01/2020 00:00:00 AM */
                dateStart = dateEndToStart;
                /* dateEnd = 10/10/2020 23:59:59 PM */
                dateEnd = dateStartToEnd;
            }

            for (let i = 0; i < dataCustomer.length; i++) {
                if (dateStart <= dataCustomer[i].date && dateEnd >= dataCustomer[i].date) {
                    dataSelectedByDate.push(dataCustomer[i]);
                }
            }

            dataCustomer = dataSelectedByDate;
        }

        /* PARAMETER sortBy */
        dataCustomer.sort(function(a, b) {
            switch (sortBy) {
                case 'sortByOldestDate':
                    return parseFloat(a.date) - parseFloat(b.date);

                case 'sortByNameTeam':
                    return a.nameTeam.localeCompare(b.nameTeam);
                
                case 'sortByNameTeam-reverse':
                    return b.nameTeam.localeCompare(a.nameTeam);
            
                case 'sortByFromTeam':
                    return a.fromTeam.localeCompare(b.fromTeam);
            
                case 'sortByFromTeam-reverse':
                    return b.fromTeam.localeCompare(a.fromTeam);
            
                /* Default diurutkan dari tanggal terbaru */
                default:
                    return parseFloat(b.date) - parseFloat(a.date);
            }
        });

        /**
         * `Total seluruh data pelanggan`, akan ditampilkan dihalaman sebagai rekaman data
         */
        let totalDataCustomer = dataCustomer.length;

        /**
         * `Total seluruh pemasukkan`, akan ditampilkan dihalaman sebagai rekaman data
         */
        let totalIncome = 0;
            
        for (let i = 0; i < dataCustomer.length; i++) {
            totalIncome += dataCustomer[i].downPayment;
            totalIncome += dataCustomer[i].moneyPaid;
        }

        /*
         * PARAMETER getAverageIncome
         * Menghitung rata - rata penghasilan per hari sampai per tahun
         */
        /* Mencegah tanggal dari data pelanggan tidak berurutan */
        const sortDate = [];
        for (let i = 0; i < dataCustomer.length; i++) {
            sortDate.push(dataCustomer[i].date);
        }
        sortDate.sort();
        
        let oldData = sortDate[0]; /* Tanggal terlama (unix time) */
        let newData = sortDate[sortDate.length - 1]; /* Tanggal terbaru (unix time) */
        let getDistanceTime = newData - oldData || 1; /* milidetik, jika hasil 0 maka = 1 */
        let getSecs = getDistanceTime / 1000; /* 1000 milidetik = 1 detik */
        let getDay = Math.ceil(getSecs / 86400); /* 1 hari = 86400 Detik */
        let getWeek = Math.ceil(getDay / 7); /* 1 minggu = 7 hari */
        let getMonth = Math.ceil(getDay / 30); /* 1 bulan = 30 hari */
        let getYear = Math.ceil(getDay / 365); /* 1 tahun = 365 hari */

        /**
         * `Total rata - rata penghasilan` per hari sampai per tahun,
         * akan ditampilkan dihalaman sebagai rekaman data
         */
        let averageIncome = 0;
        switch (getAverageIncome) {
            case 'perWeek':
                averageIncome = totalIncome / getWeek;
                break;

            case 'perMonth':
                averageIncome = totalIncome / getMonth;
                break;

            case 'perYear':
                averageIncome = totalIncome / getYear;
                break;

            /* Default = perDay */
            default:
                averageIncome = totalIncome / getDay;
                break;
        }

        if (isNaN(averageIncome)) {
            averageIncome = 0;
        }

        /* PARAMETER dataPerPagination */
        if (!isNumeric(dataPerPagination) || dataPerPagination > 15) {
            dataPerPagination = 5;
        }

        /* PARAMETER currentPagination */
        if (!isNumeric(currentPagination) || currentPagination <= 0) {
            currentPagination = 1;
        }

        /* Data terpilih dibagi data per pagination, jika hasil 0 maka valuenya = 1 */
        let totalPagination = Math.ceil(dataCustomer.length / dataPerPagination) || 1;

        /* Mencegah nomor halaman pagination lebih besar dari max nomor halaman pagination */
        if (currentPagination >= totalPagination) {
            currentPagination = totalPagination;
        }

        let startIndex = dataPerPagination * (currentPagination - 1);
        let endIndex = dataPerPagination * currentPagination;

        /* PARAMETER searchQuery */
        if (typeof searchQuery === 'string' && searchQuery !== '') {
            const query = searchQuery.toLowerCase();
            
            dataCustomer = allDataCustomer.filter(function(item) {
                return item.date == query ||
                    item.nameTeam.toLowerCase().indexOf(query) >= 0 ||
                    item.fromTeam.toLowerCase().indexOf(query) >= 0;
            });

            startIndex = 0;
            endIndex = allDataCustomer.length;
        }

        dataCustomer = dataCustomer.slice(startIndex, endIndex);

        saveTotalPagination(totalPagination);

        /* Menampilkan rekaman data ke halaman */
        document.getElementById('value-total-data').innerHTML = totalDataCustomer;
        document.getElementById('value-total-income').innerHTML = totalIncome.toIndonesianCurrency();
        document.getElementById('value-average-income').innerHTML =
            averageIncome.toIndonesianCurrency();
        
        const parrentListDatatable = document.getElementById('tbody');
        parrentListDatatable.innerHTML = '';
        
        if (dataCustomer.length > 0) {
            dataCustomer.forEach(function(data) {
                const valuesDatatable =
                    '<p class="txt-center">' + data.date.toRegularDate() + '</p>' +
                    '<p>' + data.nameTeam + '</p>' +
                    '<p>' + data.fromTeam + '</p>' +
                    '<p class="txt-center">' + data.timeBegin + ' WIB</p>' +
                    '<p class="txt-center">' + data.timePlay + ' JAM</p>' +
                    '<p class="txt-center">' + data.downPayment.toIndonesianCurrency() + '</p>' +
                    '<p class="txt-center">' + data.moneyPaid.toIndonesianCurrency() + '</p>';
    
                const elementListDatatable = document.createElement('span');
                elementListDatatable.setAttribute('class', 'list-data');
                elementListDatatable.setAttribute('unix-id', data.date);
                elementListDatatable.innerHTML = valuesDatatable;

                /*
                 * Mencegah tanda terpilihnya datatable atau class .is-selected hilang
                 * saat memilih halaman pagination
                 */
                if (getSelectedDatatableId() !== null) {
                    let listSelectedId = getSelectedDatatableId();

                    if (listSelectedId.includes(data.date.toString())) {
                        elementListDatatable.classList.add('is-selected');
                    }
                }
    
                parrentListDatatable.appendChild(elementListDatatable);
            });
        }else {
            const elementListDatatable = document.createElement('span');
            elementListDatatable.setAttribute('id', 'no-datatable');
            elementListDatatable.innerHTML = '<h5>Tidak ada data</h5>';

            parrentListDatatable.appendChild(elementListDatatable);
        }

        /* PAGINATION */
        document.getElementById('pagination').innerHTML = '';
        
        /* Membuat nomor pagination */
        for (let index = 1; index < totalPagination + 1; index++) {
            /* Max hanya 3 nomor pagination yg tampil */
            if (index > 3) break;

            let paginationButton = document.createElement('a');
            paginationButton.innerHTML = index;
            document.getElementById('pagination').appendChild(paginationButton);
        }

        let elementBtnPagination = document.querySelectorAll('#pagination a');

        for (let index = 0; index < elementBtnPagination.length; index++) {
            /* Mengurutkan nomor pagination berdasarkan currentPagination */
            if (currentPagination >= 3) {
                let firstBtn = currentPagination - 1;
                let secondBtn = currentPagination;
                let lastBtn = currentPagination + 1;

                if (currentPagination >= totalPagination) {
                    firstBtn = totalPagination - 2;
                    secondBtn = totalPagination - 1;
                    lastBtn = totalPagination;

                    currentPagination = totalPagination;
                }

                switch (index) {
                    case 1:
                        elementBtnPagination[index].innerHTML = secondBtn;
                        break;

                    case 2:
                        elementBtnPagination[index].innerHTML = lastBtn;
                        break;   

                    default:
                        elementBtnPagination[index].innerHTML = firstBtn;
                        break;
                }
            }

            /* Cari nomor yg sama dgn currentPagination lalu tambah class .pasif */
            let valueBtnPagination = parseInt(elementBtnPagination[index].innerHTML);
            elementBtnPagination[index].classList = '';
            if (valueBtnPagination === currentPagination) {
                elementBtnPagination[index].classList.add('pasif');
                
                saveCurrentNumberPagination(currentPagination);
            }
        }
    });
}

/**
 * Aksi untuk setiap menu di dropdown `#dropdown-average-income`
 * @param {string} getAverageIncome - sama dengan parameter kelima `getDatatable()`
 * @param {string} buttonValue - set button value `#dropdown-average-income`
 */
function actDropdownAverageIncome(getAverageIncome, buttonValue) {
    getDatatable(
        getTotalDataPerPagination(),
        getCurrentNumberPagination(),
        getCurrentSortVal(),
        null,
        getFormData_FormSelectDate(),
        getAverageIncome
    );

    document.querySelectorAll('#dropdown-average-income li')[0].innerHTML = buttonValue;
}

/**
 * Aksi untuk setiap menu di dropdown `#dropdown-sort-data`
 * @param {string} sortBy - sama dengan parameter ketiga `getDatatable()`
 * @param {string} buttonValue - set button value `#dropdown-sort-data`
 */
function actDropdownSortData(sortBy, buttonValue) {
    getDatatable(
        getTotalDataPerPagination(),
        getCurrentNumberPagination(),
        sortBy,
        null,
        getFormData_FormSelectDate()
    );

    saveCurrentSortVal(sortBy);
    
    document.querySelectorAll('#dropdown-sort-data li')[0].innerHTML = buttonValue;
}

/**
 * Aksi untuk setiap menu di dropdown `#dropdown-data-per-page`
 * @param {number} dataPerPagination - sama dengan parameter pertama `getDatatable()`
 */
function actDropdownDataPerPage(dataPerPagination) {
    const currentTotalPagination = getTotalPagination();
    const currentDataPerPagination = getTotalDataPerPagination();
    let currentPagination = getCurrentNumberPagination();
    const currentSortBy = getCurrentSortVal();
    
    const reCalculateTotalPagination = 
        Math.ceil(currentTotalPagination * currentDataPerPagination / dataPerPagination);
        
    /* Mencegah halaman pagination melebihi Max-nya */
    if (currentPagination > reCalculateTotalPagination) {
        currentPagination = reCalculateTotalPagination;
        saveCurrentNumberPagination(currentPagination);
    }

    getDatatable(
        dataPerPagination,
        currentPagination,
        currentSortBy,
        null,
        getFormData_FormSelectDate()
    );
    
    saveTotalDataPerPagination(dataPerPagination);
    
    document.querySelectorAll('#dropdown-data-per-page li')[0].innerHTML = dataPerPagination;
}

/**
 * Me-reset atau uncheck semua datatable yang terpilih
 */
function resetSelectedDatatable() {
    let selectedList = document.querySelectorAll('.is-selected');
    
    for (let i = 0; i < selectedList.length; i++) {
        selectedList[i].classList.remove('is-selected');
    }

    document.getElementById('menu-selected-datatable').classList.remove('is-show');

    removeSelectedDatatableId();
}

/**
 * Untuk men-set status aktif atau tidaknya pengaturan auto backup
 * @param {string} status 
 * @param {object} settings 
 */
function setStatusAutoBackupSettings(status, settings) {
    let elStatusSettings = document.getElementById('status-settings');
    let elAutoBackupInterval = document.getElementById('auto-backup-interval');
    let elPathAutoBackup = document.getElementById('path-auto-backup');
    let elTurnOffAutoBackup = document.getElementById('turnoff-auto-backup');
    let elNotice = document.getElementById('notice-auto-backup');

    if (status === 'on') {
        elStatusSettings.classList.add('is-active');
        elTurnOffAutoBackup.classList.add('is-show');
        elStatusSettings.innerHTML = 'On';
        elAutoBackupInterval.value = settings.interval;
        elPathAutoBackup.innerHTML = settings.dirPath;
    }else {
        elStatusSettings.classList.remove('is-active');
        elTurnOffAutoBackup.classList.remove('is-show');
        elNotice.classList.remove('is-show');
        elStatusSettings.innerHTML = 'Off';
        elAutoBackupInterval.value = '';
        elPathAutoBackup.innerHTML = 'Tentukan lokasi penyimpanan';
        removeAutoBackupSettings();
    }
}

/**
 * Metode untuk memulai auto backup, dengan waktu yang sudah ditentukan pengguna
 * dan akan dilakukkan dari sisi server
 * @param {string} set - set tindakan auto backup db ke `'start'`, `'restart'`, atau `'turnoff'`
 * @param {object} settings - pengaturan yang sudah diset dan tersimpan di `localStorage`
 */
function setAutoBackupDB(set, settings) {
    getDataCustomer().then(function(data) {
        const args = {
            set: set,
            autoBackup: settings,
            data: data
        };
    
        ipcRequest('autoBackupDB', args);
        ipcReceive('autoBackupSettingsVal', function(event, response) {
            if (typeof response === 'object') {
                document.getElementById('auto-backup-interval').value = response.intervalTime;
                document.getElementById('path-auto-backup').innerHTML = response.dirPath;
            }
        });
        
        /* Sama seperti metode ipcReceive() bedanya menerima dari server berkali kali */
        window.onReceive.fromServer('resultAutoBackup', function(event, response) {
            if (typeof response === 'number') {
                showToastsMsg('success', 'Auto backup ' + response + ' data');
            }

            /* Mencegah bug electron ipcRenderer.on() */
            window.removListener.fromServer('resultAutoBackup');
        });
    }).catch(function(err) {
        console.error(err);
        showToastsMsg('error', 'Gagal memulai auto backup!');
    });
}

/**
 * Tampilkan `toasts message` hanya ada tipe `success` sama `error` saja
 * @param {string} type - tipe `"success"` dan `"error"`
 * @param {string} message - Pesan apa saja
 */
function showToastsMsg(type, message) {
    let elToastsWrapper = document.getElementById('toasts-wrapper');
    let elToastsMessage = document.createElement('div');
    let toastsTitle = '';
    let toastsIcon = '';

    switch (type) {
        case 'success':
            elToastsMessage.setAttribute('class', 'type-success');
            toastsIcon = 'ti-face-smile';
            toastsTitle = 'Berhasil!';
            break;
    
        default:
            elToastsMessage.setAttribute('class', 'type-error');
            toastsIcon = 'ti-alert';
            toastsTitle = 'Kesalahan!';
            break;
    }

    elToastsMessage.setAttribute('id', 'toasts-message');
    
    elToastsMessage.innerHTML = 
        '<span id="toasts-icon" class="va-middle ' + toastsIcon + '"></span>' +
        '<div class="display-ib txt-left va-middle">' +
            '<h5>' + toastsTitle + '</h5>' + 
            '<p class="display-ib">' + message + '</p>' +
        '</div>' +
        '<span id="btn-toasts" class="va-middle ti-close"></span>';

    /* Hide toasts message setelah muncul selama 5 detik */
    setTimeout( function() {
        elToastsMessage.classList.add('is-hide');

        /* Tunggu animasi-nya selesai baru .remove() element-nya */
        elToastsMessage.addEventListener('animationend', function () {
            this.remove();
        });
    }, 5000);

    elToastsWrapper.appendChild(elToastsMessage);
}