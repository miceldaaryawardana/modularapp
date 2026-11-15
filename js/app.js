// ==========================================================================
// js/app.js - Modul Penghubung Utama (Orchestrator)
// --------------------------------------------------------------------------
// Tanggung Jawab:
// 1. Mengorkestrasikan interaksi pengguna pada form, pencarian, dan tabel.
// 2. Menyimpan state aplikasi: modeEdit dan nimSedangDiedit.
// 3. Menghubungkan modul data.js, logic.js, dan ui.js sesuai tugas masing-masing.
//
// Alur Kerja Aplikasi (Data Flow):
// [1. form / cari] -> Pengguna berinteraksi (tambah, edit, cari).
//       ↓
// [2. app.js]      -> Mencegah reload form, membaca state (tambah/edit).
//       ↓
// [3. logic.js]    -> Memvalidasi data (validasiMahasiswa) & memfilter (filterMahasiswa).
//       ↓
// [4. data.js]     -> Menyimpan, menghapus, atau mengubah data & sync ke LocalStorage.
//       ↓
// [5. ui.js]       -> Merender tabel (tampilkanData), ringkasan (tampilkanRingkasan),
//                     dan notifikasi pesan (tampilkanPesan).
// ==========================================================================

import { daftarMahasiswa, tambahData, ubahData } from "./data.js";
import { validasiMahasiswa, filterMahasiswa } from "./logic.js";
import {
  tampilkanData,
  tampilkanRingkasan,
  bersihkanForm,
  tampilkanPesan,
  setModeEdit
} from "./ui.js";

// Ambil referensi elemen DOM yang dibutuhkan
const formMahasiswa = document.getElementById("formMahasiswa");
const inputNama = document.getElementById("nama");
const inputNim = document.getElementById("nim");
const inputNilai = document.getElementById("nilai");
const inputCari = document.getElementById("cari");
const btnBatal = document.getElementById("btnBatal");
const tbodyMahasiswa = document.getElementById("daftarMahasiswa");

// State Mode Edit (disimpan di app.js)
let modeEdit = false;
let nimSedangDiedit = null;

/**
 * 1. Event Listener Submit Form (Menangani Tambah Data & Simpan Perubahan Edit)
 */
formMahasiswa.addEventListener("submit", (event) => {
  event.preventDefault();

  const nama = inputNama.value;
  const nim = inputNim.value;
  const nilai = inputNilai.value;

  // Validasi input melalui logic.js:
  // Sertakan daftarMahasiswa untuk pengecekan NIM unik.
  // Jika sedang modeEdit, abaikan nimSedangDiedit agar tidak dianggap duplikat.
  const pesanError = validasiMahasiswa(
    nama,
    nim,
    nilai,
    daftarMahasiswa,
    modeEdit ? nimSedangDiedit : null
  );

  if (pesanError !== "") {
    tampilkanPesan(pesanError);
    return;
  }

  const dataMahasiswa = {
    nama: nama.trim(),
    nim: nim.trim(),
    nilai: Number(nilai)
  };

  if (modeEdit) {
    // Mode Edit: Ubah data di data.js
    const berhasil = ubahData(nimSedangDiedit, dataMahasiswa);
    if (berhasil) {
      tampilkanPesan("Data berhasil diperbarui.");
    } else {
      tampilkanPesan("Gagal memperbarui: Data mahasiswa tidak ditemukan.", "error");
    }
    // Kembalikan form ke mode tambah
    modeEdit = false;
    nimSedangDiedit = null;
    setModeEdit(false);
  } else {
    // Mode Tambah: Tambahkan data baru ke data.js
    tambahData(dataMahasiswa);
    tampilkanPesan("Data berhasil ditambahkan.");
    bersihkanForm();
  }

  // Perbarui tampilan tabel dan kartu ringkasan
  const kataKunci = inputCari ? inputCari.value : "";
  const dataTampil = kataKunci ? filterMahasiswa(daftarMahasiswa, kataKunci) : daftarMahasiswa;
  tampilkanData(dataTampil);
  tampilkanRingkasan();
});

/**
 * 2. Event Listener Aksi Tabel (Melalui Event Delegation pada tbody)
 * Menangani klik tombol Edit dan sinkronisasi state jika tombol Hapus ditekan.
 */
tbodyMahasiswa.addEventListener("click", (event) => {
  // Aksi Tombol Edit
  const btnEdit = event.target.closest(".btn-edit");
  if (btnEdit) {
    const nim = btnEdit.dataset.nim;
    const mhs = daftarMahasiswa.find((item) => String(item.nim).trim() === String(nim).trim());

    if (mhs) {
      modeEdit = true;
      nimSedangDiedit = mhs.nim;
      setModeEdit(true, mhs);
      tampilkanPesan(`Mengedit data: ${mhs.nama}`, "info");
    }
    return;
  }

  // Aksi Sinkronisasi Tombol Hapus (jika data yang sedang diedit ternyata dihapus)
  const btnHapus = event.target.closest(".btn-hapus");
  if (btnHapus) {
    const nim = btnHapus.dataset.nim;
    if (modeEdit && String(nimSedangDiedit).trim() === String(nim).trim()) {
      modeEdit = false;
      nimSedangDiedit = null;
    }
  }
});

/**
 * 3. Event Listener Tombol Batal Edit
 */
if (btnBatal) {
  btnBatal.addEventListener("click", () => {
    modeEdit = false;
    nimSedangDiedit = null;
    setModeEdit(false);
    tampilkanPesan("");
  });
}

/**
 * 4. Event Listener Pencarian Real-Time (Nama / NIM)
 */
if (inputCari) {
  inputCari.addEventListener("input", () => {
    const kataKunci = inputCari.value;
    const dataTerfilter = filterMahasiswa(daftarMahasiswa, kataKunci);
    tampilkanData(dataTerfilter);
  });
}

/**
 * Inisialisasi Tampilan Awal:
 * Render data tabel (yang otomatis termuat dari LocalStorage) dan kartu ringkasan.
 */
tampilkanData();
tampilkanRingkasan();
