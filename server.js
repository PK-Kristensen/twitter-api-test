require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { getTweets, createTweet, getUserByHandle } = require('./services/database');
const { authenticate } = require('./middleware');


const app = express();
const secret = process.env.SECRET;
const port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));



app.get('/tweets', async(req, res)=>{
    const tweets = await getTweets();
    res.send(tweets)
});

app.post('/tweets', async(req, res) =>{
    const token = req.headers['x-auth-token'];
    const {message } = req.body;

    try {
        const payload = jwt.verify(
            token, 
            Buffer.from(secret, 'base64')
            );
        const newTweet = await createTweet(message, payload.id)
        res.send(newTweet)
    } catch (error) {
        res.status(401).send({
            error: 'use a valid token...'
        })
    }
})

app.get('/session', authenticate, (req, res) => {
    const { handle } = req.user;
    
    res.status(200).send({
      message: `You are authenticated as ${handle}`
    });
  });

app.post('/session', async(req, res) => {
    const { handle, password } = req.body;

    try{
        const user = await getUserByHandle(handle);

        if (!user) {
            return res.status(401).send({error: 'Unknown user'})
        }

        if (user.password !== password){
            return res.status(401).send({ error: 'Wrong password'})
        }

        const token = jwt.sign({
            id: user.id,
            handle: user.handle,
            name: user.name, 
        }, Buffer.from(secret, 'base64'));

        res.send(
            {
                token: token
            }
        )
    } catch(error){res.status(500).send(({ error: error.message }))};
})

app.listen(port, ()=>{
    console.log(`listening on ${port}...`)
})