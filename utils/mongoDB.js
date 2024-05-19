const mongoose = require('mongoose');
const uri = "Your Mongo db Url" //mongodb+srv://username:passwordY@clusterXXXXXXX
mongoose.connect(uri).catch(e => console.log(e))

const schemaUser = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        require: true,
    },
    password: String,
    role: String,
    email: String
})

const schemaData = new mongoose.Schema({
    nama: String,
    harga: Number,
    kemasan: Number,
    typeKemasan: String,
    jumlahPenyakit: Number,
    efektifitas: String,
    kadaluarsa: Number
});

const registerUser = async (username, password, email, role = "user", name) => {
    const collectionUser = mongoose.model('users', schemaUser);
    const checkUsername = await collectionUser.findOne({ username: username })
    const checkEmail = await collectionUser.findOne({ email: email })
    if (checkUsername) {
        return "username invalid"
    } else if (checkEmail) {
        return "email invalid"
    } else {
        const regist = new collectionUser({
            name: name,
            username: username,
            password: password,
            role: role,
            email: email
        })
        await regist.save()
        return "success"
    }
}

const profile = async (username) => {
    const collectionUser = mongoose.model('users', schemaUser);
    const user = await collectionUser.findOne({ username: username })
    if (!user) {
        return 401
    } else {
        return user
    }
}

const changePassword = async (username, oldPassword, newPassword) => {
    const collectionUser = mongoose.model('users', schemaUser);
    const user = await collectionUser.findOne({ username: username })
    if (!user) {
        return 401
    } else if(oldPassword !== user.password) {
        return 402
    } else if(oldPassword == user.password) {
        await collectionUser.updateOne({ username: username }, {
            $set: {
                password: newPassword
            }
        })
        return 200
    }
}

const changeRole = async (username, role) => {
    const collectionUser = mongoose.model('users', schemaUser);
    const user = await collectionUser.findOne({ username: username })
    if (!user) {
        return 401
    } else {
        await collectionUser.updateOne({ username: username }, {
            $set: {
                role: role
            }
        })
        return 200
    }
}

const hapusUser = async (nama) => {
    const collectionUser = mongoose.model('users', schemaUser);
    collectionUser.deleteOne({ username: nama }).then(function () {
        console.log(`Data Dihapus`)
        return 200
    }).catch(function (error) {
        console.log(error)
        return 500
    });
}

const login = async (username, password) => {
    const collectionUser = mongoose.model('users', schemaUser);
    const user = await collectionUser.findOne({ username: username })
    if (!user) {
        return "username invalid"
    } else if (user.password !== password) {
        return "password invalid"
    } else {
        return user
    }
}

const tambahData = async (nama, harga, kemasan, typeKemasan, jumlahPenyakit, efektifitas, kadaluarsa) => {
    const collection = mongoose.model('data', schemaData);
    const checkName = await collection.findOne({ nama: nama })
    if(!efektifitas || efektifitas == 0) return 402
    if (checkName) {
        return "name invalid"
    } else {
        const add = new collection({
            nama: nama,
            harga: harga,
            kemasan: kemasan,
            typeKemasan: typeKemasan,
            jumlahPenyakit: jumlahPenyakit,
            efektifitas: efektifitas,
            kadaluarsa: kadaluarsa
        })
        await add.save()
        return "success"
    }
}

const allData = async () => {
    const collection = mongoose.model('data', schemaData);
    const checkName = await collection.find()
    return checkName
}

const getData = async (nama) => {
    const collection = mongoose.model('data', schemaData);
    const checkName = await collection.findOne({ _id: nama })
    if (!checkName) {
        return 404
    } else {
        return checkName
    }
}

const editData = async (id, nama, harga, kemasan, typeKemasan, jumlahPenyakit, efektifitas, kadaluarsa) => {
    const collection = mongoose.model('data', schemaData);
    const checkName = await collection.findOne({ _id: id })
    if (!checkName) {
        return 404
    } else {
        await collection.updateOne({ _id: id }, {
            $set: {
                nama: nama,
                harga: harga,
                kemasan: kemasan,
                typeKemasan: typeKemasan,
                jumlahPenyakit: jumlahPenyakit,
                efektifitas: efektifitas,
                kadaluarsa: kadaluarsa
            }
        })
        const result = await collection.findOne({ _id: id })
        return result
    }
}

const hapusData = async (nama) => {
    const collection = mongoose.model('data', schemaData);
    collection.deleteOne({ _id: nama }).then(function () {
        console.log(`Data Dihapus`)
        return 200
    }).catch(function (error) {
        console.log(error)
        return 500
    });
}

module.exports = { hapusUser, changePassword, changeRole, registerUser, login, tambahData, allData, getData, editData, hapusData, profile }