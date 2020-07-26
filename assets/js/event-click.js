/*
 * Event Delegation
 */
document.addEventListener('click', function(event) {
    const thisElement = event.target;

    if (thisElement.closest('#main-form-wrapper') ||
        thisElement.closest('#form-select-date')) {
        return;
    }

    /* Hapus class .active di semua element ketika pengguna meng-click diluarnya */
    const callAllElement = document.querySelectorAll('body *');
    for (let i = 0; i < callAllElement.length; i++) {
        if (callAllElement[i].classList.contains('active')) {
            callAllElement[i].classList.remove('active');
        }
    }

    /* Munculkan menu dropdown */
    if (thisElement.closest('.dropdown')) {
        if (thisElement.localName === 'li') {
            thisElement.parentNode.classList.add('active');
        }
    }

    /* Tampilkan #main-form untuk menambahkan datatable */
    if (thisElement.closest('#btn-add-database')) {
        document.getElementById('main-form-wrapper').classList.add('active');
        document.getElementById('title-main-form').innerHTML = 'Tambahkan data';
        document.getElementById('main-form-date').value = Date.now().toRegularDate();
        document.getElementById('main-form-submit').value = 'Tambahkan';
        document.getElementById('main-content').classList.add('active');

        /* Pastikan input value kosong sebelum membukanya */
        let formInput = document.querySelectorAll('#main-form input');;
        for (let i = 0; i < formInput.length; i++) {
            if (formInput[i].name !== 'date' && formInput[i].id !== 'main-form-submit') {
                formInput[i].value = '';
            }
        }
    }

    /* Tampilkan #form-select-date untuk menfilter data berdasarkan tanggal yang dipilih */
    if (thisElement.closest('#btn-select-date')) {
        document.getElementById('form-select-date').classList.add('active');
    }

    /* Mereset hasil dari #form-select-date  */
    if (thisElement.closest('#btn-reset-selected-date')) {
        removeFormData_FormSelectDate();

        getDatatable(getTotalDataPerPagination(),
                     1,
                     getCurrentSortVal());
        
        saveCurrentNumberPagination(1);

        document.querySelectorAll('#info-selected-date p')[0].innerHTML = '';
        document.getElementById('info-selected-date').classList.remove('is-show');

        document.getElementById('status-total-data').innerHTML = 'dari seluruh data';
        document.getElementById('status-total-income').innerHTML = 'dari seluruh data';
        document.getElementById('status-average-income').innerHTML = 'dari seluruh data';
    }

    /* Aksi klik untuk setiap list data yang ada didalam Tabel */
    if (thisElement.closest('.list-data')) {
        const thisList = thisElement.closest('.list-data');
        const unixId   = thisList.attributes['unix-id'].value;
        
        /* Unlick thiElement */
        if (thisList.classList.contains('is-selected')) {
            thisList.classList.remove('is-selected');
            let listUnixId = getSelectedDatatableId();
            /* hapus unixId thisElement dari listUnixId */
            let indexFound = listUnixId.indexOf(unixId);
            if (indexFound >= 0) {
                listUnixId.splice(indexFound, 1);
            }
            saveSelectedDatatableId(JSON.stringify(listUnixId));
        
        /* Click thisElement */
        }else {
            thisList.classList.add('is-selected');
            let listUnixId = getSelectedDatatableId();
            if (listUnixId === null) {
                saveSelectedDatatableId(JSON.stringify([unixId]));
            }else {
                /* Memastikan tidak ada duplikasi unixId thisElement di listUnixId */
                let indexFound = listUnixId.indexOf(unixId);
                if (indexFound >= 0) {
                    listUnixId.splice(indexFound, 1);    
                }
                listUnixId.push(unixId);
                saveSelectedDatatableId(JSON.stringify(listUnixId));
            }
        }

        let totalSelected = getSelectedDatatableId().length;

        document.getElementById('menu-selected-datatable').classList.add('is-show');
        document.querySelectorAll('#total-items-selected span')[0].innerHTML = totalSelected;
        
        if (totalSelected === 0) {
            document.getElementById('menu-selected-datatable').classList.remove('is-show');
        }

        if (totalSelected > 1) {
            document.getElementById('edit-selected-datatable').style.display = 'none';
        }else {
            document.getElementById('edit-selected-datatable').style.display = 'inline-block';
        }
    }else {
        /* Jika meng-klik diluar .list-data tetapi tidak di element dibawah ini */
        if (!thisElement.closest('#tbody') &&
            !thisElement.closest('#table-footer') &&
            !thisElement.closest('#menu-selected-datatable') &&
            !thisElement.closest('#before-delete-datatable')) {

            resetSelectedDatatable();
        }
    }

    /* Tampilkan #main-form untuk mengubah datatable */
    if (thisElement.closest('#edit-selected-datatable')) {
        ipcRequest('get-data', {date: parseFloat(getSelectedDatatableId()[0])}, function(data) {
            document.getElementById('main-form-wrapper').classList.add('active');        
            /* #main-form yg memiliki class .active dianggap statusnya untuk mengubah datatable */
            document.getElementById('main-form').classList.add('active');
            document.getElementById('title-main-form').innerHTML = 'Ubah data';
            document.getElementById('main-form-submit').value = 'Ubah data';
            document.getElementById('main-content').classList.add('active');

            let dataCustomer = JSON.parse(data)[0];
            let objProp = Object.keys(dataCustomer);

            /* Input value #main-form sama dengan value dari data terpilih yang ingin diubah */
            let formInput = document.querySelectorAll('#main-form input');
            for (let i = 0; i < formInput.length; i++) {
                if (objProp.includes(formInput[i].name)) {
                    formInput[i].value = dataCustomer[formInput[i].name];

                    if (formInput[i].name === 'date') {
                        formInput[i].value = dataCustomer[formInput[i].name].toRegularDate();
                    }
                }
            }
        });
    }

    /* Tampilkan Alert sebelum menghapus datatable terpilih */
    if (thisElement.closest('#delete-selected-datatable')) {
        document.getElementById('before-delete-datatable').classList.add('active');
    }

    /* Tombol untuk uncheck atau unselect semua datatable */
    if (thisElement.closest('#reset-selected-datatable')) {
        resetSelectedDatatable();
    }

    /* Mencegah hilangnya class .active saat click didalam elementnya */
    if (thisElement.closest('#before-delete-datatable')) {
        thisElement.closest('#before-delete-datatable').classList.add('active');
    }

    /* Hapus datatable terpilih saat click "Hapus" di #before-delete-datatable */
    if (thisElement.closest('#yes-deleteData')) {
        let listUnixId = getSelectedDatatableId();
        
        ipcRequest('remove-data', listUnixId, function(totalDeleted) {
            let total = parseFloat(totalDeleted);
            
            if (total > 0) {
                showToastsMsg('success', total + ' Data telah dihapus');
                resetSelectedDatatable();
                getDatatable(
                    getTotalDataPerPagination(),
                    getCurrentNumberPagination(),
                    getCurrentSortVal(),
                    document.getElementById('search-datatable').value,
                    getFormData_FormSelectDate()
                );
            }else {
                showToastsMsg('error', 'Gagal menghapus data terpilih!');
            }
        });
    }
    
    /* Hide #before-delete-datatable saat click "Tidak" */
    if (thisElement.closest('#no-deleteData')) {
        document.getElementById('before-delete-datatable').classList.remove('active');
    }

    /* Tombol nomor pagination */
    if (thisElement.closest('#pagination a')) {
        const TotalPagination = getTotalPagination();

        if (TotalPagination > 3) {
            let firstBtnPagination = document.querySelectorAll('#pagination a:first-child')[0];
            let lastBtnPagination = document.querySelectorAll('#pagination a:last-child')[0];

            /* Tombol PREV pagination */
            if (thisElement.closest('#pagination a:first-child')) {
                if (parseInt(thisElement.text) <= 1) {
                    thisElement.innerHTML = 1;
                }else {
                    lastBtnPagination.remove();
                    const oldFirstBtnValue = parseInt(thisElement.text);
                    let newFirstBtnPagination = document.createElement('a');                    
                    newFirstBtnPagination.innerHTML = oldFirstBtnValue - 1;
                    document.getElementById('pagination')
                    .insertBefore(newFirstBtnPagination, thisElement);
                }
            }

            /* Tombol NEXT pagination */
            if (thisElement.closest('#pagination a:last-child')) {
                if (parseInt(thisElement.text) >= TotalPagination) {
                    thisElement.innerHTML = TotalPagination;
                }else {
                    firstBtnPagination.remove();
                    const oldLastBtnValue = parseInt(thisElement.text);
                    let newLastBtnPagination = document.createElement('a');
                    newLastBtnPagination.innerHTML = oldLastBtnValue + 1;
                    document.getElementById('pagination').appendChild(newLastBtnPagination);
                }
            }
        }

        getDatatable(getTotalDataPerPagination(),
                     parseInt(thisElement.text),
                     getCurrentSortVal(),
                     null,
                     getFormData_FormSelectDate());
        
        saveCurrentNumberPagination(thisElement.text);

        let elementBtnPagination = document.querySelectorAll('#pagination a');
        for (let index = 0; index < elementBtnPagination.length; index++) {
            elementBtnPagination[index].classList = '';
        }
        thisElement.classList.add('pasif');
    }

    /* Tombol untuk langsung ke halaman pagination pertama */
    if (thisElement.closest('#first-page-pagination')) {
        getDatatable(getTotalDataPerPagination(),
                     1,
                     getCurrentSortVal(),
                     null,
                     getFormData_FormSelectDate());

        saveCurrentNumberPagination(1);
        
        let elementBtnPagination = document.querySelectorAll('#pagination a');
        for (let index = 0; index < elementBtnPagination.length; index++) {
            elementBtnPagination[index].classList = '';
            elementBtnPagination[index].innerHTML = index + 1;
        }
        elementBtnPagination[0].classList.add('pasif');
    }

    /* Tombol untuk langsung ke halaman pagination terakhir */
    if (thisElement.closest('#last-page-pagination')) {
        const lastPagination = getTotalPagination();

        getDatatable( getTotalDataPerPagination(),
                      lastPagination,
                      getCurrentSortVal(),
                      null,
                      getFormData_FormSelectDate() );
        
        saveCurrentNumberPagination(lastPagination);

        let elementBtnPagination = document.querySelectorAll('#pagination a');
        if (elementBtnPagination.length > 1) {
            const TotalPagination = lastPagination;

            let indexElReversed = [];
            for (let i = elementBtnPagination.length - 1; i >= 0; i--) {
                indexElReversed.push(i);
            }
            
            for (let i = 0; i < elementBtnPagination.length; i++) {
                elementBtnPagination[i].innerHTML = TotalPagination - indexElReversed[i];
                elementBtnPagination[i].classList = '';
                elementBtnPagination[elementBtnPagination.length - 1].classList.add('pasif');
            }
        }
    }

    /* Tutup toasts message */
    if (thisElement.closest('#btn-toasts')) {
        thisElement.closest('#btn-toasts').parentNode.remove('is-show');
    }
});