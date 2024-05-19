const PDFDocument = require('pdfkit-table');
const fs = require('fs');

// Data objek untuk tabel
const data = [
  { nama: 'John Doe', usia: 30, kota: 'Jakarta' },
  { nama: 'Jane Smith', usia: 25, kota: 'Surabaya' },
  { nama: 'Bob Johnson', usia: 35, kota: 'Bandung' }
];

// Membuat dokumen PDF baru
const doc = new PDFDocument({ margin: 30, size: 'A4' });

// Mengatur output file untuk menyimpan PDF
const outputStream = fs.createWriteStream('output.pdf');

// Mengatur judul
doc.fontSize(18).text('Judul Dokumen', { align: 'center' });
doc.moveDown();

// Membuat tabel
const table = {
  headers: ['Nama', 'Usia', 'Kota'],
  rows: []
};

// Mengisi data tabel
data.forEach(item => {
  const row = [item.nama, item.usia.toString(), item.kota];
  table.rows.push(row);
});

// Menggambar tabel
doc.table(table, {
  prepareHeader: () => doc.font('Helvetica-Bold'),
  prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
});

// Mengatur judul
doc.fontSize(18).text('Judul Dokumen', { align: 'center' });
doc.moveDown();
// Mengakhiri pembuatan dokumen PDF
doc.end();

// Mengalirkan output PDF ke file
doc.pipe(outputStream);

// Menangani peristiwa ketika selesai menulis ke file
outputStream.on('finish', () => {
  console.log('PDF telah berhasil dibuat.');
});

// Menangani kesalahan jika ada yang terjadi
doc.on('error', err => {
  console.error('Terjadi kesalahan saat membuat PDF:', err);
});
