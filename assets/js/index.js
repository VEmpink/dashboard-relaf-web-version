/* Tampilkan data pelanggan ketika halaman telah diLoad */
getDatatable(
    getTotalDataPerPagination(),
    getCurrentNumberPagination(),
    getCurrentSortVal(),
    null,
    getFormData_FormSelectDate()
);

/* Cek pengaturan auto backup db yang tersimpan di localStorage */
if (getAutoBackupSettings() !== null) {
    let settings = getAutoBackupSettings();
    setStatusAutoBackupSettings('on', settings);
    setAutoBackupDB('start', settings);
}

/*
 * Cek FormData #form-select-date di sessionStorage jika ada
 * tetap tampilkan #info-selected-date
 */
if (getFormData_FormSelectDate() !== null) {
    const formData = getFormData_FormSelectDate();

    document.getElementById('info-selected-date').classList.add('is-show');

    document.querySelectorAll('#info-selected-date p')[0].innerHTML = 
    'Data dari tanggal <b>' + formData.dateStart + '</b>' +
    ' sampai <b>' + formData.dateEnd + '</b> sedang ditampilkan';

    document.getElementById('status-total-data').textContent = 'dari tanggal terpilih';
    document.getElementById('status-total-income').textContent = 'dari tanggal terpilih';
    document.getElementById('status-average-income').textContent = 'dari tanggal terpilih';
}

/*
 * Hapus sessionStorage "SelectedDatatableID" saat refresh halaman (CTRL + R),
 * untuk mencegah penambahan value sebelumnya
 */
if (getSelectedDatatableId() !== null) {
    removeSelectedDatatableId();
}

/* Cek "currentSortValue" di sessionStorage */
const btnDropdownSortData = document.querySelectorAll('#dropdown-sort-data li')[0];
switch (getCurrentSortVal()) {
    case 'sortByOldestDate':
        btnDropdownSortData.innerHTML = 'Tanggal terlama';
        break;

    case 'sortByNameTeam':
        btnDropdownSortData.innerHTML = 'Nama Tim A-Z';
        break;

    case 'sortByNameTeam-reverse':
        btnDropdownSortData.innerHTML = 'Nama Tim Z-A';
        break;

    case 'sortByFromTeam':
        btnDropdownSortData.innerHTML = 'Asal Tim A-Z';
        break;
    
    case 'sortByFromTeam-reverse':
        btnDropdownSortData.innerHTML = 'Asal Tim Z-A';
        break;

    default:
        btnDropdownSortData.innerHTML = 'Tanggal terbaru';
        break;
}

/* Cek "dataPerPagination" di localStorage */
const btnDataPerPagination = document.querySelectorAll('#dropdown-data-per-page li')[0];
if (isNaN(getTotalDataPerPagination())) {
    btnDataPerPagination.innerHTML = 5;
}else {
    btnDataPerPagination.innerHTML = getTotalDataPerPagination();
}