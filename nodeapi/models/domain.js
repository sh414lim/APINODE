const Sequelize=require('sequelize');

module.exports=class Domain extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            //nodecat 의 url ->웹 플랫픔 등록하기 처럼 호스트 검사
            host:{
                type:Sequelize.STRING(80),
                allowNull:false,
            },
            //ENUM - > 문자열이지만 free, or premium 만 가능하다 (좀더 상세한 타입)
            type:{
                type:Sequelize.ENUM('free','premium'),
                allowNullL:false,
            },
            //카카오에서 주는 key 처럼 key
            clientSecret:{
                type:Sequelize.STRING(36),
                allowNull:false,
            },
        },{
            sequelize,
            timestamps:true,
            paranoid:true,
            modelName:'Domain',
            tableName:'domains',
        });
    }

    static associate(db) {
        db.Domain.belongsTo(db.User);
      }
    };

//api 서버는 써드파티 서비스에서 api 를 가져가는데 제한을 둘려면 가져가는 사람을 알아야된다
//api 가입하고 도메인을 만들게 한다
//