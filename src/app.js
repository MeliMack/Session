const express = require('express');
const app = express();
const path = require('path');
const indexRouter = require('./routes/index');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const setUserByCookieMiddleware = require('./middlewares/setUserByCookieMiddleware');

app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use(session({secret: 'May the force be with you!'}));
app.use(setUserByCookieMiddleware);

app.use('/', indexRouter)

app.listen(3000, () => console.log("Servidor corriendo en el puerto 3000"))