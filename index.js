const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const userModel = require('./models/User')
const PORT = 8000;
require('dotenv').config();

// Sequelize 연결 설정
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host : process.env.DB_HOST,
        port : process.env.DB_PORT || 3306,
        dialect : 'mysql',
    }
)

// 모델 초기화
const User = userModel(sequelize);

app.use(express.json());
app.get('/', (res,req) => {
    res.send('Hi')
});

app.post('/api/users', async (req, res)=>{
    try{
        const {username, email} = req.body;
        const user = await User.create({username, email});
        res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({message : 'server error'})
    }
})

sequelize.sync({force:false}).then(()=>{
    console.log('table create done!');

    app.listen(PORT, ()=>{
        console.log(`http://localhost:${PORT}`);
    })
})

