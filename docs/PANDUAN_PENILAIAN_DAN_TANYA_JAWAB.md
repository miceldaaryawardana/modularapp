# Panduan Penilaian & Bank Tanya Jawab
## Modul Praktikum 09: Penerapan Prosedur, Fungsi, dan Modularisasi Program Visual

Dokumen ini disusun untuk dosen dan asisten dosen (asdos) sebagai acuan penilaian (*grading rubric*), pengujian lisan (*oral defense*), serta evaluasi pemahaman mahasiswa terhadap konsep modularisasi visual.

---

## 📊 1. Rubrik Penilaian Praktikum (Total: 100 Poin)

| Komponen | Bobot | Kriteria Penilaian Maksimal | Indikator Pengurangan Poin |
|---|:---:|---|---|
| **Struktur & Pemisahan Modul** | **25%** | - Modul terpisah persis: `data.js`, `logic.js`, `ui.js`, `app.js`.<br>- Menggunakan ES Modules murni (`import`/`export`).<br>- Jalur impor menyertakan ekstensi `.js`. | - Menyatukan file JS (-15)<br>- Menggunakan library/bundler (-20)<br>- Lupa ekstensi `.js` pada path impor (-5) |
| **Kepatuhan Larangan DOM** | **20%** | - `data.js` **100% bebas** dari objek `document`/`window`.<br>- `logic.js` **100% bebas** dari objek `document`/`window` (berupa *pure functions*). | - Terdapat pemanggilan `document.getElementById` atau sejenisnya di dalam `data.js` atau `logic.js` (-10 per file) |
| **Keamanan & Standar DOM** | **20%** | - Menampilkan data pengguna menggunakan `.textContent` pada `createElement`.<br>- Menghindari `.innerHTML` untuk teks nama/NIM/nilai.<br>- Form memiliki atribut `label for` dan `novalidate` terkoordinasi. | - Menggunakan `.innerHTML` untuk menyuntikkan data user (-15)<br>- Label tidak terhubung ke ID input (-5) |
| **Fungsionalitas & Validasi** | **20%** | - Validasi berjalan: field kosong & rentang nilai $0-100$.<br>- Penentuan kelulusan tepat: $\ge 60$ Lulus, $< 60$ Belum Lulus.<br>- Tambah dan hapus data bekerja mulus. | - Validasi angka tidak menangani nilai negatif atau $> 100$ (-10)<br>- Logika kelulusan salah (-10)<br>- Tombol hapus tidak berfungsi (-10) |
| **Desain & Responsivitas** | **15%** | - Tampilan rapi, kontainer maksimal 900px, form 480px.<br>- Indikator fokus tombol/input terlihat jelas (*accessibility*).<br>- Responsif di layar ponsel ($\le 600\text{px}$) tanpa *layout breaking*. | - Tidak responsif di layar mobile (-5)<br>- Tidak ada styling fokus keyboard (-5)<br>- Tampilan berantakan (-5) |

---

## 💬 2. Bank Pertanyaan Wawancara / Demo Praktikum

Gunakan 7 pertanyaan berikut untuk menguji apakah mahasiswa benar-benar memahami kode yang mereka buat atau sekadar menyalin (*copy-paste*):

### Pertanyaan 1 (Konseptual Modularitas)
> **Asdos:** *"Mengapa kita memisahkan kode menjadi 4 berkas JS terpisah, bukan dijadikan satu berkas saja seperti praktikum-praktikum sebelumnya?"*  
> **Jawaban yang Diharapkan:**  
> Untuk menerapkan prinsip **Pemisahan Peran (*Separation of Concerns*)**. Dengan memisahkan kode:
> 1. *Maintainability*: Kode lebih mudah dirawat dan diperbaiki jika terjadi bug.
> 2. *Testability*: Logika bisnis (`logic.js`) dan data (`data.js`) dapat diuji (*unit test*) secara mandiri tanpa membutuhkan browser atau tampilan HTML.
> 3. *Reusability*: Fungsi kalkulasi dan validasi dapat digunakan kembali di bagian lain aplikasi.

---

### Pertanyaan 2 (ES Modules vs Protokol file://)
> **Asdos:** *"Mengapa aplikasi ini wajib dijalankan lewat Live Server / HTTP Server lokal, dan apa yang terjadi jika berkas `index.html` diklik ganda langsung lewat File Explorer (`file:///`)?"*  
> **Jawaban yang Diharapkan:**  
> Peramban (*browser*) modern menerapkan kebijakan keamanan **CORS (*Cross-Origin Resource Sharing*)** pada JavaScript ES Modules (`<script type="module">`). Jika dibuka lewat protokol `file://`, peramban menganggap pemanggilan berkas modul lokal sebagai potensi ancaman keamanan lintas asal (*cross-origin*) dan akan memblokirnya dengan pesan galat *CORS request not supported*. Menjalankannya via server lokal menggunakan protokol `http://` sehingga modul dapat dimuat dengan aman.

---

### Pertanyaan 3 (Pure Functions pada logic.js)
> **Asdos:** *"Apa yang dimaksud dengan Pure Function pada `logic.js` dan apa syaratnya?"*  
> **Jawaban yang Diharapkan:**  
> *Pure function* adalah fungsi yang:
> 1. Menghasilkan luaran (*return value*) yang sama persis untuk argumen masukan yang sama (*deterministik*).
> 2. **Tidak menimbulkan efek samping (*side-effects*)**, artinya tidak mengubah variabel di luar fungsinya, tidak mengubah argumen yang diterima, dan tidak menyentuh antarmuka web (DOM/Window/Storage).

---

### Pertanyaan 4 (Keamanan XSS)
> **Asdos:** *"Di modul `ui.js`, mengapa kita menggunakan `document.createElement()` dan `.textContent` alih-alih `innerHTML` saat merender baris tabel mahasiswa?"*  
> **Jawaban yang Diharapkan:**  
> Untuk mencegah celah keamanan **Cross-Site Scripting (XSS)**. Jika menggunakan `innerHTML`, data masukan pengguna yang mengandung tag HTML atau skrip jahat (contoh: `<img src=x onerror=alert(1)>`) akan dieksekusi oleh peramban. Sedangkan `.textContent` memperlakukan seluruh karakter masukan murni sebagai teks biasa (*string literal*) tanpa menginterpretasikannya sebagai kode HTML.

---

### Pertanyaan 5 (Manipulasi Array pada data.js)
> **Asdos:** *"Jelaskan bagaimana fungsi `hapusData(nim)` bekerja dan mengapa kita memeriksa `index !== -1` sebelum memanggil `splice()`?"*  
> **Jawaban yang Diharapkan:**  
> Fungsi `findIndex()` mencari letak indeks elemen mahasiswa yang memiliki NIM sesuai parameter. Jika data tidak ditemukan, `findIndex()` mengembalikan nilai `-1`. Pengecekan `index !== -1` wajib dilakukan karena jika `splice(-1, 1)` dieksekusi, JavaScript akan menghapus elemen terakhir dari array, yang akan menyebabkan kesalahan penghapusan data yang tidak diinginkan.

---

### Pertanyaan 6 (Event Handling & Form Submission)
> **Asdos:** *"Mengapa pada event listener submit di `app.js` baris pertama harus memanggil `event.preventDefault()`?"*  
> **Jawaban yang Diharapkan:**  
> Karena perilaku bawaan (*default behavior*) formulir HTML saat di-submit adalah mengirimkan permintaan HTTP GET/POST dan memuat ulang (*reload*) halaman. Pemanggilan `event.preventDefault()` membatalkan aksi default tersebut sehingga aplikasi satu halaman (*Single Page Application*) kita dapat memproses data menggunakan JavaScript tanpa kehilangan state memori array.

---

### Pertanyaan 7 (Aksesibilitas & UX)
> **Asdos:** *"Mengapa elemen `<p id="pesan">` diberi atribut `role="status"` dan `aria-live="polite"`?"*  
> **Jawaban yang Diharapkan:**  
> Untuk standar aksesibilitas (*Web Accessibility / a11y*). Atribut tersebut memberitahu pembaca layar (*screen reader*) bagi penyandang disabilitas netra bahwa area tersebut adalah area pesan status dinamis yang harus dibacakan kepada pengguna ketika teksnya berubah, tanpa mengganggu navigasi yang sedang berlangsung (*polite*).

---

## 💡 3. Soal Tantangan Pengayaan (Tugas Tambahan Mandiri)

Bagi mahasiswa yang telah menyelesaikan modul dasar dengan sempurna, asdos dapat memberikan tantangan pengayaan berikut:

1. **Tantangan 1: Pencegahan Duplikasi NIM**
   - Modifikasi `logic.js` atau `data.js` untuk memeriksa apakah NIM yang dimasukkan sudah terdaftar sebelumnya.
   - Jika sudah ada, kembalikan pesan error: `"NIM sudah terdaftar."`.
2. **Tantangan 2: Fitur Pencarian Mahasiswa (Filter)**
   - Tambahkan input teks pencarian di atas tabel.
   - Buat fungsi penyaring di `ui.js` yang hanya menampilkan mahasiswa yang nama atau NIM-nya cocok dengan kata kunci pencarian.
3. **Tantangan 3: Persistensi Data dengan LocalStorage**
   - Tambahkan fungsi penyimpanan otomatis ke `localStorage` pada `data.js` agar data mahasiswa tidak hilang saat halaman di-refresh.

