// api 사용 요청을 처리할수 있는 라우터

const express = require('express');
const jwt = require('jsonwebtoken');

const {verifyToken} = require('./middlewares');
const {Domain,User} = require('../models');

const router = express.Router();

router.post('/token', async (req,res)=>{
    const {clientSecret} = req.body;
    try{
        const domain=await Domain.findOne({
            were:{clientSecret},
            include:{
                model:User,
                attribute:['nick','id'],
            },
        });
        if(!domain){
            return res.status(401).json({
                code:401,
                message:'등록되지 않은 도메인 입니다, 먼저 도메인을 등록하세요'
            });
        }

        const token = jwt.sign({
            id:domain.User.id,
            nick:domain.User.nick,
        },process.env.JWT_SECRET,{
            expireseIn:'1m',//1분
            issuer:'nodebird',
        }
        );
        return res.json({
            code:200,
            message:'토큰ㅇ 발급되었습니다',
            token,
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            code:500,
            message:'서버 에러'
        });
    }
});

router.get('/test',verifyToken,(req,res)=>{
    res.json(req.decoded);
});

module.exports = router;