// ==========================================================================
// js/ui.js - Modul Antarmuka Pengguna (User Interface & DOM)
// --------------------------------------------------------------------------
// Tanggung Jawab:
// 1. Merender tabel data mahasiswa (tampilkanData).
// 2. Merender kartu ringkasan statistik (tampilkanRingkasan).
// 3. Mengatur status formulir (bersihkanForm, setModeEdit).
// 4. Memusatkan pengelolaan pesan feedback status (tampilkanPesan).
// Keamanan:
// Menggunakan textContent pada elemen document.createElement untuk mencegah XSS.
// ==========================================================================

import { daftarMahasiswa, hapusData } from "./data.js";
import { cekKelulusan, hitungRingkasan, filterMahasiswa } from "./logic.js";

/**
 * Menampilkan pesan feedback/status ke elemen <p id="pesan">.
 * 
 * @param {string} teks - Kalimat pesan yang akan ditampilkan
 * @param {string} [tipe=""] - Jenis pesan ("sukses" | "error" | "info")
 */
export function tampilkanPesan(teks, tipe = "") {
  const elemenPesan = document.getElementById("pesan");
  if (!elemenPesan) return;

  elemenPesan.textContent = teks;

  if (!teks) {
    elemenPesan.className = "";
    elemenPesan.style.display = "none";
    return;
  }

  // Tentukan kelas styling
  let jenis = tipe;
  if (!jenis) {
    if (teks.toLowerCase().includes("berhasil")) {
      jenis = "sukses";
    } else {
      jenis = "error";
    }
  }

  elemenPesan.className = `pesan-${jenis}`;
  elemenPesan.style.display = "block";
}

/**
 * Mengosongkan form input dan mengembalikan fokus kursor ke input Nama.
 */
export function bersihkanForm() {
  const form = document.getElementById("formMahasiswa");
  if (form) {
    form.reset();
  }

  const inputNama = document.getElementById("nama");
  if (inputNama) {
    inputNama.focus();
  }
}

/**
 * Mengatur tampilan formulir antara Mode Tambah dan Mode Edit.
 * 
 * @param {boolean} aktif - true jika masuk mode edit, false jika kembali ke mode tambah
 * @param {Object|null} [mhs=null] - Data mahasiswa yang akan diedit { nama, nim, nilai }
 */
export function setModeEdit(aktif, mhs = null) {
  const headingForm = document.getElementById("form-heading");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnBatal = document.getElementById("btnBatal");
  const inNama = document.getElementById("nama");
  const inNim = document.getElementById("nim");
  const inNilai = document.getElementById("nilai");

  if (aktif && mhs) {
    if (headingForm) headingForm.textContent = "Edit Data Mahasiswa";
    if (btnSubmit) btnSubmit.textContent = "Simpan Perubahan";
    if (btnBatal) btnBatal.style.display = "inline-flex";

    if (inNama) inNama.value = mhs.nama;
    if (inNim) inNim.value = mhs.nim;
    if (inNilai) inNilai.value = mhs.nilai;

    if (inNama) inNama.focus();
  } else {
    if (headingForm) headingForm.textContent = "Tambah Data Mahasiswa";
    if (btnSubmit) btnSubmit.textContent = "Tambah Mahasiswa";
    if (btnBatal) btnBatal.style.display = "none";
    bersihkanForm();
  }
}

/**
 * Menampilkan ringkasan statistik (Total Mahasiswa, Lulus, Belum Lulus)
 * ke elemen #totalMahasiswa, #totalLulus, dan #totalBelumLulus.
 * 
 * @param {Array<Object>} [daftar=daftarMahasiswa] - Sumber data yang dihitung
 */
export function tampilkanRingkasan(daftar = daftarMahasiswa) {
  const ringkasan = hitungRingkasan(daftar);

  const elTotal = document.getElementById("totalMahasiswa");
  const elLulus = document.getElementById("totalLulus");
  const elBelumLulus = document.getElementById("totalBelumLulus");

  if (elTotal) elTotal.textContent = ringkasan.totalMahasiswa;
  if (elLulus) elLulus.textContent = ringkasan.totalLulus;
  if (elBelumLulus) elBelumLulus.textContent = ringkasan.totalBelumLulus;
}

/**
 * Merender daftar mahasiswa ke dalam elemen <tbody id="daftarMahasiswa">.
 * Menerima parameter daftar (default: daftarMahasiswa) untuk mendukung pencarian.
 * 
 * @param {Array<Object>} [daftar=daftarMahasiswa] - Data mahasiswa yang akan dirender
 */
export function tampilkanData(daftar = daftarMahasiswa) {
  const tbody = document.getElementById("daftarMahasiswa");
  if (!tbody) return;

  // Bersihkan tabel sebelum render ulang
  tbody.textContent = "";

  // Jika daftar kosong, tampilkan baris pesan informatif
  if (!daftar || daftar.length === 0) {
    const trKosong = document.createElement("tr");
    trKosong.className = "empty-row";

    const tdKosong = document.createElement("td");
    tdKosong.colSpan = 5;
    tdKosong.textContent = "Belum ada data mahasiswa.";

    trKosong.appendChild(tdKosong);
    tbody.appendChild(trKosong);
    return;
  }

  // Iterasi dan buat baris data secara aman
  daftar.forEach((mhs) => {
    const tr = document.createElement("tr");

    // 1. Nama
    const tdNama = document.createElement("td");
    tdNama.textContent = mhs.nama;

    // 2. NIM
    const tdNim = document.createElement("td");
    tdNim.textContent = mhs.nim;

    // 3. Nilai
    const tdNilai = document.createElement("td");
    tdNilai.textContent = mhs.nilai;

    // 4. Status Kelulusan (dihitung melalui logic.js)
    const tdStatus = document.createElement("td");
    const status = cekKelulusan(mhs.nilai);
    const badgeStatus = document.createElement("span");
    badgeStatus.textContent = status;
    badgeStatus.className = `status-badge ${
      status === "Lulus" ? "status-lulus" : "status-belum-lulus"
    }`;
    tdStatus.appendChild(badgeStatus);

    // 5. Aksi (Tombol Edit dan Hapus Berdampingan)
    const tdAksi = document.createElement("td");
    const wrapAksi = document.createElement("div");
    wrapAksi.className = "action-cell";

    // Tombol Edit
    const btnEdit = document.createElement("button");
    btnEdit.type = "button";
    btnEdit.className = "btn btn-warning btn-edit";
    btnEdit.textContent = "Edit";
    btnEdit.dataset.nim = mhs.nim;
    btnEdit.setAttribute("aria-label", `Edit data ${mhs.nama}`);

    // Tombol Hapus
    const btnHapus = document.createElement("button");
    btnHapus.type = "button";
    btnHapus.className = "btn btn-danger btn-hapus";
    btnHapus.textContent = "Hapus";
    btnHapus.dataset.nim = mhs.nim;
    btnHapus.setAttribute("aria-label", `Hapus data ${mhs.nama}`);

    btnHapus.addEventListener("click", () => {
      hapusData(mhs.nim);
      // Reset form edit jika mahasiswa yang sedang diedit dihapus
      setModeEdit(false);

      // Pertahankan filter pencarian jika pengguna sedang mencari
      const inputCari = document.getElementById("cari");
      const kataKunci = inputCari ? inputCari.value : "";
      const dataTampil = kataKunci ? filterMahasiswa(daftarMahasiswa, kataKunci) : daftarMahasiswa;

      tampilkanData(dataTampil);
      tampilkanRingkasan();
      tampilkanPesan("Data berhasil dihapus.");
    });

    wrapAksi.appendChild(btnEdit);
    wrapAksi.appendChild(btnHapus);
    tdAksi.appendChild(wrapAksi);

    // Susun baris ke dalam tr
    tr.appendChild(tdNama);
    tr.appendChild(tdNim);
    tr.appendChild(tdNilai);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAksi);

    tbody.appendChild(tr);
  });
}
