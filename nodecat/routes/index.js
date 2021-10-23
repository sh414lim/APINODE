const express = require('express');
const axios = require('axios');
const { response } = require('express');

const router = express.Router();

const URL= 'http://localhost:8002/v1';
// axios.default.headers.origin='http://localhost:4001';

const request=async(req,api)=>{
  //요청을 보내는 함수
  
}

router.get('/test', async (req, res, next) => { // 토큰 테스트 라우터
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급 시도 세션에 토큰저장
      const tokenResult = await axios.post('http://localhost:8002/v1/token', {
        clientSecret: process.env.CLIENT_SECRET, //같이 넣어서 보내줌 
      });
      if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 성공
        req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
        return await axios.get(`${URL}${api}`,    {
          headers:{authorization:req.session.jwt},
        })
      } else { // 토큰 발급 실패
        return res.json(tokenResult.data); // 발급 실패 사유 응답
      }
    }
    // 발급받은 토큰 테스트
    const result = await axios.get('http://localhost:8002/v1/test', {
      headers: { authorization : req.session.jwt }, //발급 받은 토큰을 authorization 에 넣어서 테스트를 한다
    });
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response.status === 419) { // 토큰 만료 시
      delete req.session.jwt; // 발급
      return request (req,api);
    }
    return error.response;
  }
});

router.get('/my')

module.exports = router;