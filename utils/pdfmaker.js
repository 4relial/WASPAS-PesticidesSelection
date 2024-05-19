const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const { waspas } = require('./index')

exports.pdf = async (data, rank) => {
    console.log(data)
    let result = waspas(data)

    // Membuat dokumen PDF baru
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Mengatur output file untuk menyimpan PDF
    const outputStream = fs.createWriteStream('./public/pdf/report.pdf');

    doc.fontSize(18).text('Laporan Perhitungan Data Pestisida Terbaik di Kelompok Tani Family Saiyo', { align: 'center' });
    doc.moveDown();
    // Mengatur judul
    doc.fontSize(18).text('Daftar Pestisida', { align: 'left' });

    // Membuat tabel
    const table = {
        headers: ['Nama', 'Harga', 'Kemasan', 'Jumlah Penyakit', 'Kadaluarsa', 'Efektivitas'],
        rows: []
    };

    // Mengisi data tabel
    data.forEach(item => {
        const row = [item.nama, item.harga, item.kemasan, item.jumlahPenyakit, item.kadaluarsa, item.efektifitas];
        table.rows.push(row);
    });

    // Menggambar tabel
    doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
    });

    // Mengatur judul
    doc.moveDown();
    doc.fontSize(18).text('Hasil Perhitungan', { align: 'left' });

    const table2 = {
        headers: ['Nama', 'Nilai Akhir', 'Ranking'],
        rows: []
    };

    // Mengisi data tabel
    result.Qi.forEach((item, index) => {
        const row = [item.nama, item.nilaiQ, index + 1];
        table2.rows.push(row);
    });

    // Menggambar tabel
    doc.table(table2, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
    });
    // Mengakhiri pembuatan dokumen PDF
    doc.end();

    // Mengalirkan output PDF ke file
    doc.pipe(outputStream);

    // Menangani peristiwa ketika selesai menulis ke file
    outputStream.on('finish', () => {
        console.log('PDF telah berhasil dibuat.');
        return 'pdf/report.pdf'
    });

    // Menangani kesalahan jika ada yang terjadi
    doc.on('error', err => {
        console.error('Terjadi kesalahan saat membuat PDF:', err);
    });
}