// ==========================================================================
// js/data.js - Modul Pengelolaan Data Mahasiswa & Penyimpanan LocalStorage
// --------------------------------------------------------------------------
// Modul ini mengelola data state dalam memori dan menyimpannya secara otomatis
// ke LocalStorage agar data tetap tersimpan saat halaman web dimuat ulang.
// PENTING:
// Variabel daftarMahasiswa tetap bertipe const dan seluruh mutasi dilakukan
// in-place (menggunakan array mutation: push, splice, length = 0)
// agar referensi live binding import pada modul lain (seperti ui.js) tidak putus.
// Modul ini murni data dan TIDAK MENYENTUH DOM sama sekali.
// ==========================================================================

const STORAGE_KEY = "aplikasi_mahasiswa_modular_data";

/**
 * Array penampung seluruh data objek mahasiswa.
 * Bersifat const dengan mutasi in-place.
 */
export const daftarMahasiswa = [];

/**
 * Menyimpan data array daftarMahasiswa ke LocalStorage peramban.
 * Dilengkapi try-catch untuk menangani kondisi penyimpanan gagal atau kuota penuh.
 */
function simpanKeLocalStorage() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarMahasiswa));
  } catch (error) {
    console.error("Gagal menyimpan ke localStorage:", error);
  }
}

/**
 * Membaca data mahasiswa dari LocalStorage dan memuatnya ke dalam daftarMahasiswa in-place.
 * Dilengkapi try-catch untuk mengantisipasi data JSON yang rusak/corrupt.
 */
function muatDariLocalStorage() {
  if (typeof localStorage === "undefined") return;
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsedData = JSON.parse(rawData);
      if (Array.isArray(parsedData)) {
        // Kosongkan array in-place tanpa mengubah referensi variabel const
        daftarMahasiswa.length = 0;
        daftarMahasiswa.push(...parsedData);
      }
    }
  } catch (error) {
    console.error("Gagal memuat data dari localStorage:", error);
  }
}

/**
 * Menambahkan satu objek data mahasiswa baru ke array dan menyimpannya ke LocalStorage.
 * 
 * @param {Object} mahasiswa - Objek data mahasiswa { nama, nim, nilai }
 */
export function tambahData(mahasiswa) {
  daftarMahasiswa.push(mahasiswa);
  simpanKeLocalStorage();
}

/**
 * Menghapus satu data mahasiswa berdasarkan NIM dan memperbarui LocalStorage.
 * 
 * @param {string} nim - NIM mahasiswa yang akan dihapus
 * @returns {boolean} true jika data berhasil dihapus, false jika NIM tidak ditemukan
 */
export function hapusData(nim) {
  const index = daftarMahasiswa.findIndex(
    (mhs) => String(mhs.nim).trim() === String(nim).trim()
  );

  if (index !== -1) {
    daftarMahasiswa.splice(index, 1);
    simpanKeLocalStorage();
    return true;
  }

  return false;
}

/**
 * Mengubah data mahasiswa yang sudah ada berdasarkan NIM lama.
 * 
 * @param {string} nimLama - NIM mahasiswa sebelum diedit
 * @param {Object} dataBaru - Objek data pembaruan { nama, nim, nilai }
 * @returns {boolean} true jika berhasil diubah, false jika tidak ditemukan
 */
export function ubahData(nimLama, dataBaru) {
  const index = daftarMahasiswa.findIndex(
    (mhs) => String(mhs.nim).trim() === String(nimLama).trim()
  );

  if (index !== -1) {
    daftarMahasiswa[index] = {
      ...daftarMahasiswa[index],
      ...dataBaru
    };
    simpanKeLocalStorage();
    return true;
  }

  return false;
}

// Muat data yang tersimpan di LocalStorage secara otomatis saat modul pertama kali diimpor
muatDariLocalStorage();
