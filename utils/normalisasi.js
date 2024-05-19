const norm = {
    efektivitas(value) {
        switch (value.toLowerCase()) {
            case "tidak efektif":
                return 1;
            case "kurang efektif":
                return 2;
            case "cukup efektif":
                return 3;
            case "efektif":
                return 4;
            case "sangat efektif":
                return 5;     
            default:
                return 0;
        }
    },
    harga(value) {
        if (value >= 100000) {
            return 5
        } else if (value < 100000 && value >= 70000) {
            return 4
        } else if (value < 70000 && value >= 40000) {
            return 3
        } else if (value < 40000 && value >= 10000) {
            return 2
        } else if (value < 10000) {
            return 1
        }
    },
    kemasan(value) {
        if (value >= 1000) {
            return 5
        } else if (value < 1000 && value >= 700) {
            return 4
        } else if (value <700 && value >= 400) {
            return 3
        } else if (value < 400 && value >= 100) {
            return 2
        } else if (value < 100) {
            return 1
        }
    },
    jumlahPenyakit(value) {
        if (value >= 8) {
            return 5
        } else if (value < 8 && value >= 6) {
            return 4
        } else if (value < 6 && value >= 4) {
            return 3
        } else if (value < 4 && value >= 2) {
            return 2
        } else if (value < 2) {
            return 1
        }
    },
    kadaluarsa(value) {
        if(value >= 5){
            return 5
        } else {
            return value
        }
    }
}

module.exports= { norm }