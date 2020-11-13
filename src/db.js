const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('open', () => {
    console.log('Connected to database!');
});
db.on('error', (err) => console.log(err));