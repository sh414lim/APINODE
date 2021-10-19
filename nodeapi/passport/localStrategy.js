const passport =require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');
 

module.exports = ()=>{
    passport.use(new localStrategy({
        usernameField:'email', //req.body.email
        passwordField:'password',//req.body.password
    },async(email,password,done)=>{
        try{
            const exUser=await User.findOne({where:{email}}); //이메일을 가진 사람이 있나 찾아본다
            if(exUser){ //done 함수를 호출하면 auth 로그인 로직으로 돌아간다  
                const result = await bcrypt.compare(password,exUser.password); //이메일이 있으면 비밀번호 비교
                if(result){
                    done(null,exUser);
                }else{
                    done(null,false,{message:'비밀번호 일치 하지 않습니다'})
                }
            }else{
                done(null,false, {messag:'가입되지 않은 회원입니다'});
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }
    ))
}