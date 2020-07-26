/**
 * Tombol untuk restore database
 */
document.getElementById('selectFile').addEventListener('change', function(ev) {
    let reader = new FileReader();
    reader.readAsText(ev.target.files[0]);
    reader.addEventListener('load', function(e) {
        let result;
        try {
            result = JSON.parse(e.target.result);
        } catch (error) {
            showToastsMsg('error', 'File yang dipilih tidak valid!');
            return;
        }

        ipcRequest('restore-database', result, function(response) {
            showToastsMsg('success', response + ' Data berhasil dipulihkan!');
            getDatatable(
                getTotalDataPerPagination(),
                getCurrentNumberPagination(),
                getCurrentSortVal(),
                null,
                getFormData_FormSelectDate()
            );
        });
    });
});

/*
 * Main Form
 * Status aksinya double bisa menambahkan atau mengubah data pelanggan,
 * untuk mengubah data #main-form harus diberi class .active
 */
document.getElementById('main-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let thisElement = this,
        formData = {},
        formInput = this.getElementsByTagName('input');

    for (let i = 0; i < formInput.length; i++) {
        formData[formInput[i].name] = formInput[i].value;
    }

    /* Menambahkan data */
    if (thisElement.classList.value !== 'active') {
        ipcRequest('insert-data', formData, function(response) {
            document.getElementById('main-form-wrapper').classList.remove('active');
            document.getElementById('main-content').classList.remove('active');

            showToastsMsg('success', 'Data telah ditambahkan!');

            getDatatable(
                getTotalDataPerPagination(),
                getCurrentNumberPagination(),
                getCurrentSortVal(),
                null,
                getFormData_FormSelectDate()
            );
        });
    
    /* Mengubah data */
    }else {
        let unixId = getSelectedDatatableId()[0];

        ipcRequest('update-data', {
            idData: unixId,
            updateData: formData
        }, function(response) {
            document.getElementById('main-form-wrapper').classList.remove('active');
            document.getElementById('main-content').classList.remove('active');

            if (response == 1) { /* 1 = satu data telah diubah */
                showToastsMsg('success', 'Data yang dipilih telah diubah!');

                getDatatable(
                    getTotalDataPerPagination(),
                    getCurrentNumberPagination(),
                    getCurrentSortVal(),
                    document.getElementById('search-datatable').value,
                    getFormData_FormSelectDate()
                );
            }else {
                showToastsMsg('error', 'Gagal mengubah data!');
            }
        });
    }
});

/* Form untuk menampilkan datatable berdasarkan Tanggal yang dipilih dari dan sampai */
document.getElementById('form-select-date').addEventListener('submit', function(event) {
    event.preventDefault();

    let FormData = {};
    let FormInput = this.querySelectorAll('input');
    for (let i = 0; i < FormInput.length; i++) {
        if (FormInput[i].name.length > 0) {
            FormData[FormInput[i].name] = FormInput[i].value;
        }
    }

    getDatatable(getTotalDataPerPagination(),
                 1,
                 getCurrentSortVal(),
                 null,
                 FormData);

    saveCurrentNumberPagination(1);

    this.classList.remove('active');

    saveFormData_FormSelectDate(FormData);
    
    document.getElementById('info-selected-date').classList.add('is-show');

    document.querySelectorAll('#info-selected-date p')[0].innerHTML = 
    'Data dari tanggal <b>' + FormData.dateStart + '</b>' +
    ' sampai <b>' + FormData.dateEnd + '</b> sedang ditampilkan';

    document.getElementById('status-total-data').innerHTML = 'dari tanggal terpilih';
    document.getElementById('status-total-income').innerHTML = 'dari tanggal terpilih';
    document.getElementById('status-average-income').innerHTML = 'dari tanggal terpilih';
});

/* Mencari datatable berdasarkan nama tim dan asal tim, hasil muncul setelah tekan Enter */
const elInputSearchDatatable = document.getElementById('search-datatable');
elInputSearchDatatable.addEventListener('keypress', function(event) {
    if (event.charCode === 13 && this.value !== '') {
        getDatatable(15, 1, null, this.value);
        document.getElementById('table-footer').classList.add('is-hide');
    }
});

/*
 * Tampilkan kembali semua datatable ketika pengguna
 * menekan Backspace/Delete hingga valuenya kosong
 */
elInputSearchDatatable.addEventListener('keyup', function(event) {
    if (elInputSearchDatatable.value.length === 0) {
        getDatatable(getTotalDataPerPagination(),
                     getCurrentNumberPagination(),
                     getCurrentSortVal(),
                     null,
                     getFormData_FormSelectDate());

        document.getElementById('table-footer').classList.remove('is-hide');
    }
});