const { norm } = require("./normalisasi")
function getMaxMinValue(arr, prop) {
    const values = arr.map(item => item[prop]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { max, min };
}


exports.waspas = (data) => {


    //Normalisasi Data
    const normData = [];

    data.forEach(function (obj) {
        const normObj = {
            nama: obj.nama,
            harga: norm.harga(obj.harga),
            kemasan: norm.kemasan(obj.kemasan),
            jumlahPenyakit: norm.jumlahPenyakit(obj.jumlahPenyakit),
            efektifitas: norm.efektivitas(obj.efektifitas),
            kadaluarsa: norm.kadaluarsa(obj.kadaluarsa)
        };
        normData.push(normObj);
    });

    // Value Maksimal dan Minimal
    const harga = getMaxMinValue(normData, 'harga');
    const kemasan = getMaxMinValue(normData, 'kemasan');
    const jumlahPenyakit = getMaxMinValue(normData, 'jumlahPenyakit');
    const efektifitas = getMaxMinValue(normData, 'efektifitas');
    const kadaluarsa = getMaxMinValue(normData, 'kadaluarsa');

    //Normalisasi Matriks
    const normMatriks = [];

    normData.forEach(function (obj) {
        const normObj = {
            nama: obj.nama,
            harga: (harga.min / obj.harga),
            kemasan: (obj.kemasan / kemasan.max),
            jumlahPenyakit: (obj.jumlahPenyakit / jumlahPenyakit.max),
            efektifitas: (obj.efektifitas / efektifitas.max),
            kadaluarsa: (obj.kadaluarsa / kadaluarsa.max)
        };
        
        // Cek apakah hasil pembagian memiliki 4 angka di belakang koma
        if (!Number.isInteger(normObj.harga * 10000)) {
            normObj.harga = normObj.harga.toFixed(4);
        }
        if (!Number.isInteger(normObj.kemasan * 10000)) {
            normObj.kemasan = normObj.kemasan.toFixed(4);
        }
        if (!Number.isInteger(normObj.jumlahPenyakit * 10000)) {
            normObj.jumlahPenyakit = normObj.jumlahPenyakit.toFixed(4);
        }
        if (!Number.isInteger(normObj.efektifitas * 10000)) {
            normObj.efektifitas = normObj.efektifitas.toFixed(4);
        }
        if (!Number.isInteger(normObj.kadaluarsa * 10000)) {
            normObj.kadaluarsa = normObj.kadaluarsa.toFixed(4);
        }
        
        normMatriks.push(normObj);
    });

    // console.log(data)

    const Qi = []
    normMatriks.forEach(function (obj) {
        Qi.push({
            nama: obj.nama, 
            nilaiQ: ((0.5 * ((obj.harga * 0.2) + (obj.kemasan * 0.2) + (obj.jumlahPenyakit * 0.2) + (obj.efektifitas * 0.3) + (obj.kadaluarsa * 0.1))) +
                (0.5 * ((Math.pow(obj.harga, 0.2)) * (Math.pow(obj.kemasan, 0.2)) * (Math.pow(obj.jumlahPenyakit, 0.2)) * (Math.pow(obj.efektifitas, 0.3)) * (Math.pow(obj.kadaluarsa, 0.1))))).toFixed(3)
        })
    })

    // console.log(Qi)
    Qi.sort(function(a, b) {
        return b.nilaiQ - a.nilaiQ;
      });

    let hasil = `Pestisida Terbaik adalah ${Qi[0].nama} dengan nilai ${Qi[0].nilaiQ}`
    const result = Qi[0].nama

    return { normData, normMatriks, Qi, result, hasil }
}