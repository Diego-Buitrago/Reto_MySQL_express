const express = require('express');
const morgan = require('morgan');
const app = express();
const vehiculos = require('./routes/vehiculos.js');
require('dotenv').config();

app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api', vehiculos);

app.get('/', (req, res) => {
    res.send("<h1>Reto_MySQL_express</h1>")
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), () => {
    console.log(`Aplicacion corriendoen el puerto ${app.get('port')}...`);
});