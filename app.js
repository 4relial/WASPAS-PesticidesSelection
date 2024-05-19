const express = require('express');
const session = require('express-session');
const app = express();
const { waspas } = require('./utils/index')
const { pdf } = require('./utils/pdfmaker')
const { registerUser, changePassword, login, tambahData, allData,
    getData, editData, hapusData, profile, changeRole, hapusUser } = require('./utils/mongoDB')
var bodyParser = require('body-parser');
const { resolveInclude } = require('ejs');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded())
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))

const requireLogin = (req, res, next) => {
    if (req?.session?.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.use((req, res, next) => {
    if (req.path === '/login' || req.path === '/register' || req.path.toLowerCase().includes('css') || req.path.toLowerCase().includes('js')) {
        next();
    } else {
        requireLogin(req, res, next);
    }
});

app.get('/data', async (req, res) => {
    if (req?.session?.user?.role !== 'admin') {
        let data = await allData()
        let hitungWaspas = waspas(data)
        res.render('index', { data, hitungWaspas, isAdmin: false })
        console.log(hitungWaspas)
    } else {
        let data = await allData()
        console.log(data)
        let hitungWaspas = waspas(data)
        res.render('index', { data, hitungWaspas, isAdmin: true })
        console.log(hitungWaspas)
    }
});

app.get('/pdf', async (req, res) => {
    let data = await allData()
    let result = await pdf(data)
    setTimeout(() => {
        res.redirect('/pdf/report.pdf')
    }, 10_000);
});

app.get('/hasil', async (req, res) => {
    if (req?.session?.user?.role !== 'admin') {
        let data = await allData()
        let hitungWaspas = waspas(data)
        res.render('hasil', { data, hitungWaspas, isAdmin: false })
        console.log(hitungWaspas)
    } else {
        let data = await allData()
        console.log(data)
        let hitungWaspas = waspas(data)
        res.render('hasil', { data, hitungWaspas, isAdmin: true })
        console.log(hitungWaspas)
    }
});

app.get('/', async (req, res) => {
    if (req?.session?.user?.role) {
        res.render('landing')
    }
});

app.get('/details', async (req, res) => {
    let data = await allData()
    let hitungWaspas = waspas(data)
    res.render('details', { data, hitungWaspas, isAdmin: false })
    // console.log(hitungWaspas)
});

app.get('/profile', async (req, res) => {
    if (req?.session?.user) {
        let dataUser = await profile(req?.session?.user?.username)
        res.render('profile', { dataUser })
    }
});

app.get('/edituser', async (req, res) => {
    if (req?.session?.user?.role !== 'admin') {
        res.redirect('/');
    } else {
        res.render('editUser', { isValid: false, warning: "", notif: "" })
    }
});

app.post('/edituser', async (req, res) => {
    console.log(req.body)
    const { username } = req.body
    console.log(username)
    let dataUser = await profile(username)
    if (dataUser == 401) {
        res.render('editUser', { isValid: false, warning: "User tidak ditemukan", notif: "" })
    } else {
        res.render('editUser', { isValid: true, dataUser, warning: "", notif: "" })
    }
});

app.get('/add', (req, res) => {
    if (req?.session?.user?.role !== 'admin') {
        res.redirect('/');
    } else {
        res.render('tambahData', { error: "", result: "" })
    }

});

app.get('/edit', (req, res) => {
    if (req?.session?.user?.role !== 'admin') {
        res.redirect('/');
    } else {
        const nama = req.query.nama;
        if (!nama) {
            res.redirect('/')
        } else {
            getData(nama).then(result => {
                console.log(result)
                res.render('edit', { data: result, result: "", error: "" })
            })
        }
    }
});

app.get('/editrole', (req, res) => {
    if (req?.session?.user?.role !== 'admin') {
        res.redirect('/');
    } else {
        const nama = req.query.nama;
        const role = req.query.role;
        if (!nama || !role) {
            res.redirect('/')
        } else {
            changeRole(nama, role).then(result => {
                if (result == 200) {
                    profile(nama).then(dataUser => {
                        if (dataUser == 401) {
                            res.render('editUser', { isValid: false, warning: "User tidak ditemukan", notif: "" })
                        } else {
                            res.render('editUser', { isValid: true, dataUser, warning: "", notif: "Role Berhasil Diubah!" })
                        }
                    })
                }
            })
        }
    }
});

app.get('/deleteuser', (req, res) => {
    if (req?.session?.user?.role !== 'admin') {
        res.redirect('/');
    } else {
        const nama = req.query.nama;
        if (!nama) {
            res.redirect('/')
        } else {
            hapusUser(nama).then(result => {
                if (result == 500) {
                    res.render('editUser', { isValid: false, warning: "Error", notif: "" })
                } else {
                    res.render('editUser', { isValid: false, warning: "", notif: "User Berhasil Dihapus!" })
                }
            })
        }
    }
});

app.get('/delete', (req, res) => {
    if (req?.session?.user?.role !== 'admin') {
        res.redirect('/');
    } else {
        const nama = req.query.nama;
        if (!nama) {
            res.redirect('/')
        } else {
            hapusData(nama).then(result => {
                res.redirect('/data')
            })
        }
    }
});

app.post('/edit', (req, res) => {
    console.log(req.body)
    const { id, nama, harga, kemasan, type, jumlahPenyakit, efektifitas, kadaluarsa } = req.body
    editData(id, nama, harga, kemasan, type, jumlahPenyakit, efektifitas, kadaluarsa)
        .then(result => {
            console.log(result)
            if (result == 404) {
                res.send("Error 500")
            } else {
                res.render('edit', { data: result, result: "Edit Data Berhasil", error: "" })
            }
        })
});


app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/register', (req, res) => {
    if (req?.session?.user) {
        res.redirect('/');
    } else {
        res.render('register', { result: "" })
    }
})

app.get('/login', (req, res) => {
    if (req?.session?.user) {
        console.log(req?.session?.user)
        res.redirect('/');
    } else {
        res.render('login', { result: "", notif: "" })
    }
})

app.get('/changepassword', (req, res) => {
    if (req?.session?.user) {
        res.render('changePassword', { result: "", notif: "" })
    }
})

app.post('/changepassword', async (req, res) => {
    // console.log(req.body)

    const { password, sandi, sandi1 } = req.body
    console.log(password, sandi, sandi1)
    if (sandi !== sandi1) {
        res.render('changePassword', { result: "Ulangi Sandi Baru Dengan Benar!", notif: "" })
    } else {
        let hasil = await changePassword(req.session?.user?.username, password, sandi)
        if (hasil == 200) {
            res.render('changePassword', { result: "", notif: "Ganti Password Berhasil" })
        } else if (hasil == 402) {
            res.render('changePassword', { result: "Sandi Salah!", notif: "" })
        } else {
            res.render('changePassword', { result: "Terjadi Kesalahan!", notif: "" })
        }
    }
});

app.post('/add', (req, res) => {
    // console.log(req.body)

    const { nama, harga, kemasan, type, jumlahPenyakit, efektifitas, kadaluarsa } = req.body
    // res.send(nama + harga + kemasan + type + jumlahPenyakit + efektifitas + kadaluarsa)
    tambahData(nama, harga, kemasan, type, jumlahPenyakit, efektifitas, kadaluarsa)
        .then(result => {
            if (result == "name invalid") {
                res.render('tambahData', { error: "Nama Sudah Ada", result: "" })
            } else if (result == 402) {
                res.render('tambahData', { error: "Silakan Pilih Efektivitas!", result: "" })
            } else {
                res.render('tambahData', { error: "", result: "Tambah Data Berhasil" })
            }
        })
});

app.post('/login', (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    login(username, password).then(result => {
        switch (result) {
            case "username invalid": {
                res.render('login', { result: "Username Tidak Terdaftar", notif: "" })
                break
            }
            case "password invalid": {
                res.render('login', { result: "Sandi Salah", notif: "" })
                break
            }
            default: {
                if (result?.username) {
                    req.session.user = { email: result.email, username: result.username, role: result.role };
                    res.redirect('/')
                } else {
                    res.render('login', { result: "Error", notif: "" })
                }
            }
        }
    }).catch(e => {
        console.log(e)
        res.render('login', { result: "Error", notif: "" })
        return
    })
});

app.post('/register', async (req, res) => {
    const username = req.body.username.toLowerCase()
    const password = req.body.password
    const nama = req.body.name
    const email = req.body.email.toLowerCase()
    // console.log(email, username, password)
    registerUser(username, password, email, "user", nama).then(result => {
        switch (result) {
            case "username invalid": {
                res.render('register', { result: "Username telah terdaftar" })
                break
            }
            case "email invalid": {
                res.render('register', { result: "Email telah terdaftar" })
                break
            }
            case "success": {
                res.render('login', { result: "", notif: "Berhasil Mendaftar, Silakan Login" })
                break
            }
            default: {
                res.render('register', { result: "(501) Terjadi Kesalahan" })
            }
        }
    }).catch(e => {
        console.log(e)
        res.send("(501) Terjadi Kesalahan")
        return
    })
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
