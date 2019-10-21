require('dotenv').config();


const express = require('express');
const session = require('express-session');
const massive = require('massive');
const app = express();
const port = 4000;
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('../controllers/authController')
const treasCtrl = require('../controllers/treasuerController')
const auth = require('./middleware/authMiddleware')

app.use(express.json())


massive(CONNECTION_STRING).then(db=>{
    app.set('db',db);
    console.log('db up')
})

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))


app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasCtrl.addUserTreasure);
app.get('api/treasure/all', auth.usersOnly, auth.adminsOnly, treasCtrl.getAllTreasure)



app.listen(port, () => console.log('we up'))
