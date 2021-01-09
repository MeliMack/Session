const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const {check, validationResult, body} = require('express-validator');

let usuarios = fs.readFileSync(path.join(__dirname, '../data/usuarios.json'), 'utf8');
usuarios = JSON.parse(usuarios);

module.exports = {
    index: function(req, res) {
        res.render('index');
    },
    register: function(req, res) {
        res.render('register');
    },
    save: function(req, res, next) {
        let errors = validationResult(req);
        if(errors.isEmpty()) {
            let nuevoUsuario = {
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                avatar: req.files[0].filename
            };
            usuarios.push(nuevoUsuario);
            fs.writeFileSync(path.join(__dirname, '../data/usuarios.json'), JSON.stringify(usuarios));
            return res.redirect('login');
        } else {
            res.render('register', {
                errors: errors.mapped(),
                old: req.body
            });
        }
    },
    login: function(req, res) {
        res.render('login')
    },
    verify: function(req, res) {
        let errors = validationResult(req);
        if(errors.isEmpty()) {
            for(let i = 0; i < usuarios.length; i++) {
                if(usuarios[i].email == req.body.email && bcrypt.compareSync(req.body.password, usuarios[i].password)) {
                    req.session.user = usuarios[i].email
                    
                    if(req.body.remember == "on") {
                        res.cookie('userCookie', usuarios[i].email, {maxAge: 60000 * 5});
                    }
                    
                    return res.redirect('/welcome');
                }
            }
            return res.render('login', {
                errors: {
                    email: {
                        msg: 'Credenciales inválidas. Inserta un email registrado y su respectica contraseña'
                    }
                }
            })

        } else {
            res.render('login', {
                errors: errors.mapped(),
                old: req.body
            })
        }
    },
    welcome: function(req, res, next) {
        res.render('welcome', {
            user: req.session.user
        });
    },
    logout: function(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }
}