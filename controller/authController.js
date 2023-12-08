const { StatusCodes } = require("http-status-codes")
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const createPassToken = require("../util/createPassToken")
const jwt = require('jsonwebtoken')
const createPassToken = require('../util/createPassToken')
const PassToken = require('../model/passTokenModel')
const mailConfig = require('../util/sendEmail')
const pass_template = require('../util/pass_temp')

// register new user
const signUp = async (req,res) => {
    try {
        const data = req.body // receive the data from front end

        // validate email
        const extEmail = await User.findOne({ email: data.email })
        const extMobile = await User.findOne({ mobile: data.mobile })

        if(extEmail) {
           return res.Status(StatusCodes.CONFLICT).json({ msg: `${data.email} already exists`})
        } else if (extMobile) {
           return res.Status(StatusCodes.CONFLICT).json({ msg: `${data.mobile} already exists`})
        } 

        // password encryption hash(string,length)
        const encPass = await bcrypt.hash(data.password,10)

        // validate with model
        const newUser = await User.create({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            password: encPass,
            role: data.role  
        })

        res.status(StatusCodes.OK).json({ msg: `New user registered successfully`, newUser })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err })
    }
}


// login
const login = async (req,res) => {
    try {
        const data = req.body
        let extEmail, extMobile;

        // validate email or mobile 
            if(data.email) {
                extEmail = await User.findOne({ email: data.email })

                // if email id not exists
                if(!extEmail) {
                    return res.status(StatusCodes.NOT_FOUND).json({ msg: `${data.email} not found`})
                } 

                // authenticate through email
                let isMatch = await bcrypt.compare(data.password, extEmail.password)
                if(!isMatch)
                    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: `Password are not matched`})

                    res.json({ msg: "login success with email"})

        } else {

        // validate mobile
            extMobile = await User.findOne({ mobile: data.mobile })

            if(!extMobile) {
                return res.status(StatusCodes.NOT_FOUND).json({ msg: `${data.mobile} number not found`})
            }

              // authenticate through mobile
              let isMatch = await bcrypt.compare(data.password, extMobile.password)
              if(!isMatch)
                  return res.status(StatusCodes.UNAUTHORIZED).json({ msg: `Password are not matched`})
              res.json({ msg: "login success with mobile"})
        }
        
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err })
    }
}


// logout
const logout = async (req,res) => {
    try {
        res.json({ msg: `logout` })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err })
    }
}


// login auth token
const authToken = async (req,res) => {
    try {
        res.json({ msg: `auth token` })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err })
    }
}

// to get current activity  user information
const getUserInfo = async (req,res) => {
    try {
        let id = req.userId

        let user = await User.findById({ _id: id }).select('-password')
        if(!user)
            return res.status(StatusCodes.NOT_FOUND).json({ msg: `Requested user id not found`})

        res.status(StatusCodes.ACCEPTED).json({ user })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
    }
}

// generate forgot password link
const generatePassLink = async (req,res) => {
    try {
         let { email } = req.body

         let extUser = await User.findOne({ email })
            if(!extUser)
                return res.status(StatusCodes.NOT_FOUND).json({ msg: `Requested user data not found`})

            let PassToken = createPassToken({ id: extUser._id })

            let extEmail = await PassToken.findOne({ user_email: email })
                if(extEmail)
                    return res.status(StatusCodes.CONFLICT).json({ msg: `Password token link already generated..Check your email inbox/spam folder`})

            let savedToken = await PassToken.create({ user_email: email, token: PassToken })

            let template = pass_template(email,PassToken,"http://rest.api-project.vercel.com")

            let emilRes = await mailConfig(email, "New password generated link", template)

            res.status(StatusCodes.ACCEPTED).json({ msg: `Token Sent successfully..check your email inbox/spam folder`, savedToken, emailRes })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
    }
}

// validate password link and update password logic
const updatePassword = async (req,res) => {
    try {
        let {email, token, password } = req.body 

        // read the token from passToken
        let extData = await PassToken.findOne({ user_email: email })
            if(!extData)
                return res.status(StatusCodes.NOT_FOUND).json({ msg: `Requested email not found `})

        // token compare logic
        await jwt.verify(token, process.env.ACCESS_SECRET, (err,user) => {
            if(err)
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: `Invalid Token..`})

            // update password
            // password encryption hash(string,length)
            const encPass = await bcrypt.hash(password,10)

            await  User.findByIdAndUpdate({ _id: user.id}, { password: encPass })
            await PassToken.findByIdAndDelete({ _id: extData._id })

            res.status(StatusCodes.OK).json({ msg: `Password updated successfully`})
        })
        
    } catch(err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
    }
}

module.exports = { signUp, login, logout, authToken, getUserInfo, generatePassLink, updatePassword }