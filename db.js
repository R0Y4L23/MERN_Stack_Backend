const {
    User
} = require("./model.js");
var bcrypt = require('bcryptjs');

const show_all_data = async () => {
    let data = await User.find()
    return data
}

const show_data_by_id = async (id) => {
    let data = await User.findOne({
        email: id
    })
    return data
}

const save_data = async (data) => {

    let user = await User.find({
        "email": data.email
    })
    if (user.length > 0) {
        return "Email already exists"
    }
    let new_user = await User.find({
        "username": data.username
    })
    if (new_user.length > 0) {
        return "Username already in Use"
    }
    try {
        User.create(data, (d) => {
            console.log("Posted")
        })
        return "Posted Successfully"
    } catch (error) {
        console.log(error)
    }
}

const update_by_id = (id, body) => {
    User.findOneAndUpdate({
        email: id
    }, body, () => {
        console.log("Updated Successfully")
    })
}

const delete_by_id = (id) => {
    User.findOneAndDelete({
        email: id
    }, () => {
        console.log("Deleted")
    })
}

const check_login = async (data) => {
    let user = await User.find({
        "email": data.email
    })
    if (user.length > 0) {
        if (bcrypt.compareSync(data.password, user[0].password)) {
            return {
                m: "Login Successful",
                d: user[0]
            }
        } else {
            return {
                m: "Wrong Password",
                d: {}
            }
        }
    }
    return {
        m: 'Invalid Email',
        d: {}
    }
}

module.exports = {
    show_all_data,
    show_data_by_id,
    save_data,
    update_by_id,
    delete_by_id,
    check_login
}
