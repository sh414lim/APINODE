// api 사용 요청을 처리할수 있는 라우터

const express = require('express');
const jwt = require('jsonwebtoken');

const {verifyToken} = require('./middlewares');
const {Domain,User} = require('../models');

const router = express.Router();

//토큰 발급 라우터
router.post('/token', async (req,res)=>{
    const {clientSecret} = req.body;
    try{ //도메인 등록 검사
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
            //토큰 발급 (sign) 첫번째에 부가적 정보를 넣어준다
        const token = jwt.sign({
            id:domain.User.id,
            nick:domain.User.nick,
        },process.env.JWT_SECRET,{ //시크릿 털리면 망해요.... 
        //토큰 옵션
            // expireseIn:'1m',//1분
            issuer:'nodebird', //누가 보내줫는가
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

//테스트 라우터
router.get('/test',verifyToken,(req,res)=>{
    res.json(req.decoded);
});

router.get('/posts/my', verifyToken,(req,res)=>{
    post.findAll({where : {userId : req.decoded.id}})
    .then((posts)=>{
        res.json({
            code:200,
            payload:posts,
        });
    })
    .catch()
})

module.exports = router;