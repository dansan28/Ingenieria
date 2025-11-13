const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const user = require('../models/userModel')


const login = asyncHandler( async(req, res) => {

    //Desectructurar el body que pasamos en el request

    const {email, password} = req.body

    //verificar si el uusario que se intenta logear existe
    const user = await User.findOne({email})

    if (user &&(await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: generarToken(user.id)
        })
    }else {

        res.status(401) 
        throw new Error('credenciales incorrectas')
    
    }

    
})

const register = asyncHandler(async(req, res) => {
    const{nombre,email,password} = req.body

    if(!nombre || !email || !password){
        res.status(400)
        throw new Error("Faltan datos")
    }

    //Verificar si existe ese usuario en la base de datos
    const userExiste = await user.findOne({email})

    if (userExiste) {
        res.status(400)
        throw new Error("Ese usuario ya existe")
    }else{
        //hash
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //Crear el usuario
        const user = await User.create({
            nombre,
            email,
            password: hashedPassword
        })

        if (user){
            res.status(201).json({
                _id: user.id,
                nombre: user.nombre,
                email: user.email
            })
        } else {
            res.status(400)
            throw new Error('No se pudieron guardar los datos')
        }
    }

})

const data = (req, res) => {
    res.status(200).json({message: 'data'})
}

const generarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

modelNames.exports = {
    login, register, data
}