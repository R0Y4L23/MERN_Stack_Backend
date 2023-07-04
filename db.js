const {
    User, Post, Comment, Like
} = require("./model.js");
var bcrypt = require('bcryptjs');

const show_all_data = async () => {
    let data = await User.find().select("-password").select("-email")
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
        User.create(data, () => {
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

const post_data = async (data) => {
    try {
        await Post.create(data, () => {
            console.log("Posted")
        })
        return "Posted Successfully"
    } catch (error) {
        console.log(error)
    }
}

const post_comment = async (data) => {
    try {
        await Comment.create(data, () => {
            console.log("Posted")
        })
        return "Posted Successfully"
    } catch (error) {
        console.log(error)
    }
}

const post_like = async (data) => {
    try {
        let id = data["ofPost"]
        let d = await Like.findOne(data)
        if (d == null) {
            await Like.create(data, async () => {
                await Post.updateOne({ '_id': id }, { $inc: { "likes": 1 } })

            })
            return "Liked Successfully"
        }
        else {
            await Like.deleteOne(data)
            await Post.updateOne({ '_id': id }, { $inc: { "likes": -1 } })
            return "Unliked Successfully"
        }
    } catch (error) {
        console.log(error)
    }
}

const get_all_likes_by_user = async (email) => {
    try {
        let data = await Like.find({ "likedBy": email })
        return data
    } catch (error) {
        return []
    }
}

const get_all_post = async () => {
    let data = await Post.find()
    return data
}

const get_all_comment = async (id) => {
    let data = await Comment.find({
        ofPost: id
    })
    return data
}

module.exports = {
    show_all_data,
    show_data_by_id,
    save_data,
    update_by_id,
    delete_by_id,
    check_login,
    post_data,
    post_comment,
    post_like,
    get_all_post,
    get_all_comment,
    get_all_likes_by_user
}
