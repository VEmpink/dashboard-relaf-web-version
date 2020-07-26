/* Dropdown rata - rata penghasilan */
let menuDropdownAverageIncome = document.querySelectorAll('#dropdown-average-income p');
for (let i = 0; i < menuDropdownAverageIncome.length; i++) {
    menuDropdownAverageIncome[i].addEventListener('click', function (event) {
        switch (i) {
            case 1:
                actDropdownAverageIncome('perWeek', 'Per Minggu');
                break;
            case 2:
                actDropdownAverageIncome('perMonth', 'Per Bulan');
                break;

            case 3:
                actDropdownAverageIncome('perYear', 'Per Tahun');
                break;
        
            default:
                actDropdownAverageIncome('perDay', 'Per Hari');
                break;
        }
    });
}





/*
 * Dropdown Sort-By = mengurutkan data dari:
 * Tanggal terbaru, Tanggal terlama, Nama tim A sampai Z, Nama tim Z sampai A,
 * Asal tim A sampai Z, dan Asal tim Z - A
 */ 
let menuDropdownSortBy =
    document.getElementById('dropdown-sort-data').getElementsByTagName('p');

for (let index = 0; index < menuDropdownSortBy.length; index++) {
    menuDropdownSortBy[index].addEventListener('click', function (event) {
        switch (index) {
            /* Dari tanggal terlama */
            case 1:
                actDropdownSortData('sortByOldestDate', 'Tanggal terlama');
                break;

            /* Nama tim dari A sampai Z */
            case 2:
                actDropdownSortData('sortByNameTeam', 'Nama Tim A-Z');
                break;

            /* Nama tim dari Z sampai A */
            case 3:
                actDropdownSortData('sortByNameTeam-reverse', 'Nama Tim Z-A');
                break;

            /* Asal tim dari A sampai Z */
            case 4:
                actDropdownSortData('sortByFromTeam', 'Asal Tim A-Z');
                break;
            
            /* Asal tim dari Z sampai A */
            case 5:
                actDropdownSortData('sortByFromTeam-reverse', 'Asal Tim Z-A');
                break;

            /* Defaultnya dari tanggal terbaru */
            default:
                actDropdownSortData('', 'Tanggal terbaru');
                break;
        }
    });
}





/*
 * Dropdown untuk menampilkan DataPerPage,
 * hanya ada tiga menu 5, 10, dan 15 halaman
 * value diambil dari index element menu
 */
let menuDropdownDataPerPage = 
    document.getElementById('dropdown-data-per-page').getElementsByTagName('p');

for (let index = 0; index < menuDropdownDataPerPage.length; index++) {
    menuDropdownDataPerPage[index].addEventListener('click', function (event) {
        switch (index) {
            /* Index kedua 10 data per halaman */
            case 1:
                actDropdownDataPerPage(10);
                break;

            /* Index ketiga atau terakhir, menampilkan 15 data per halaman */
            case 2:
                actDropdownDataPerPage(15);
                break;

            /* Defaultnya atau index pertama, 5 data per halaman */
            default:
                actDropdownDataPerPage(5);
                break;
        }
    });
}