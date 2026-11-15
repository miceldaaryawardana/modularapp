// ==========================================================================
// js/logic.js - Modul Logika Bisnis, Validasi, & Kalkulasi Murni
// --------------------------------------------------------------------------
// Seluruh fungsi di modul ini adalah pure functions (fungsi murni).
// Tidak ada efek samping (side-effects) dan TIDAK MENYENTUH DOM sama sekali.
// ==========================================================================

/**
 * Memeriksa apakah suatu NIM sudah terdaftar di dalam array mahasiswa.
 * Mendukung parameter nimDiabaikan (berguna saat proses edit data agar
 * NIM mahasiswa yang sedang diedit tidak dianggap sebagai duplikat dirinya sendiri).
 * 
 * @param {string} nim - NIM yang akan dicek
 * @param {Array<Object>} [daftar=[]] - Array daftar mahasiswa saat ini
 * @param {string|null} [nimDiabaikan=null] - NIM yang dikecualikan dari pengecekan
 * @returns {boolean} true jika NIM sudah terdaftar pada mahasiswa lain, false jika belum
 */
export function nimSudahAda(nim, daftar = [], nimDiabaikan = null) {
  const nimCari = String(nim ?? "").trim();
  if (!nimCari || !Array.isArray(daftar)) return false;

  return daftar.some((mhs) => {
    // Abaikan jika ini adalah NIM mahasiswa yang sedang diedit
    if (nimDiabaikan !== null && String(mhs.nim).trim() === String(nimDiabaikan).trim()) {
      return false;
    }
    return String(mhs.nim).trim() === nimCari;
  });
}

/**
 * Memvalidasi data input mahasiswa.
 * Signature lama tetap valid (parameter daftar dan nimDiabaikan bersifat opsional).
 * 
 * Aturan Bisnis:
 * 1. Semua data wajib diisi (tidak boleh kosong atau spasi saja).
 * 2. Nilai harus berupa angka valid dalam rentang 0 sampai 100.
 * 3. NIM harus unik (tidak boleh ada mahasiswa lain dengan NIM sama).
 * 
 * @param {string} nama - Nama mahasiswa
 * @param {string} nim - Nomor Induk Mahasiswa
 * @param {string|number} nilai - Nilai mahasiswa
 * @param {Array<Object>} [daftar=[]] - Daftar mahasiswa untuk cek keunikan NIM
 * @param {string|null} [nimDiabaikan=null] - NIM yang diabaikan saat validasi mode edit
 * @returns {string} String pesan kesalahan, atau "" jika data valid
 */
export function validasiMahasiswa(nama, nim, nilai, daftar = [], nimDiabaikan = null) {
  const namaBersih = String(nama ?? "").trim();
  const nimBersih = String(nim ?? "").trim();
  const nilaiBersih = String(nilai ?? "").trim();

  // 1. Cek kelengkapan pengisian kolom
  if (namaBersih === "" || nimBersih === "" || nilaiBersih === "") {
    return "Semua data wajib diisi.";
  }

  // 2. Cek format dan rentang nilai angka 0 - 100
  const angkaNilai = Number(nilaiBersih);
  if (Number.isNaN(angkaNilai) || angkaNilai < 0 || angkaNilai > 100) {
    return "Nilai harus berupa angka 0 sampai 100.";
  }

  // 3. Cek keunikan NIM (hanya dijalankan jika daftar diberikan)
  if (Array.isArray(daftar) && daftar.length > 0) {
    if (nimSudahAda(nimBersih, daftar, nimDiabaikan)) {
      return "NIM sudah terdaftar.";
    }
  }

  // Lolos semua validasi
  return "";
}

/**
 * Menentukan status kelulusan mahasiswa berdasarkan nilai angka.
 * 
 * Aturan Kelulusan:
 * - Nilai >= 60 : "Lulus"
 * - Nilai < 60  : "Belum Lulus"
 * 
 * @param {string|number} nilai - Nilai mahasiswa
 * @returns {string} "Lulus" atau "Belum Lulus"
 */
export function cekKelulusan(nilai) {
  const angkaNilai = Number(nilai);
  return angkaNilai >= 60 ? "Lulus" : "Belum Lulus";
}

/**
 * Menyaring daftar mahasiswa berdasarkan kata kunci pencarian (Nama atau NIM).
 * Bersifat case-insensitive dan tidak merusak array asli.
 * 
 * @param {Array<Object>} [daftar=[]] - Array data mahasiswa yang akan difilter
 * @param {string} [kata=""] - Kata kunci pencarian
 * @returns {Array<Object>} Array baru hasil penyaringan
 */
export function filterMahasiswa(daftar = [], kata = "") {
  const kataBersih = String(kata ?? "").trim().toLowerCase();
  if (!kataBersih || !Array.isArray(daftar)) {
    return daftar;
  }

  return daftar.filter((mhs) => {
    const nama = String(mhs.nama ?? "").toLowerCase();
    const nim = String(mhs.nim ?? "").toLowerCase();
    return nama.includes(kataBersih) || nim.includes(kataBersih);
  });
}

/**
 * Menghitung ringkasan statistik mahasiswa (Total, Lulus, Belum Lulus).
 * 
 * @param {Array<Object>} [daftar=[]] - Daftar mahasiswa yang dihitung
 * @returns {{ totalMahasiswa: number, totalLulus: number, totalBelumLulus: number }}
 */
export function hitungRingkasan(daftar = []) {
  const totalMahasiswa = Array.isArray(daftar) ? daftar.length : 0;
  let totalLulus = 0;
  let totalBelumLulus = 0;

  if (Array.isArray(daftar)) {
    daftar.forEach((mhs) => {
      if (cekKelulusan(mhs.nilai) === "Lulus") {
        totalLulus++;
      } else {
        totalBelumLulus++;
      }
    });
  }

  return {
    totalMahasiswa,
    totalLulus,
    totalBelumLulus
  };
}
