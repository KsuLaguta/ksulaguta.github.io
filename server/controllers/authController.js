const fs = require('fs');
const jwt = require('jsonwebtoken');

const db = JSON.parse(fs.readFileSync(`${__dirname}/../database.json`));

exports.signup = (req, res) => {
    try {
        const user = db.users.find(el => el.email === req.body.email);
        if (user) {
            return res.status(401).json({
                status: 'fail',
                message: 'User with given email already exist.'
            });
        }

        const newUser = ({
            id: Date.now(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        db.users.push(newUser);

        fs.writeFile(`${__dirname}/../database.json`, JSON.stringify(db), err => {
            const token = jwt.sign({id: newUser.id}, 'secret', {
                expiresIn: '30d'
            });

            res.status(201).json({
                status: 'success',
                token,
                user: newUser
            })
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Signup failed',
            error
        });
    }
}

exports.login = (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            })
        }
        
        const user = db.users.find(el => el.email === req.body.email);

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'User with given email does not exist.'
            });
        };

        const userPassword = db.users.find(el => el.password === req.body.password);

        if (!userPassword) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect password.'
            });
        };

        const token = jwt.sign({id: user.id}, 'secret', {
            expiresIn: '30d'
        });

        res.status(200).json({
            status: 'success',
            token
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Login failed',
            error
        });
    }
}