// import { DataTypes } from "sequelize";

module.exports = (sequelize, DataTypes) => (
    sequelize.define(
        'category',
        {
            key: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            displayValue: {
                type: DataTypes.STRING(20),
                allowNull: false,   
                defaultValue: "",                         
            },             
            items: {
                type: DataTypes.STRING(3000),
                allowNull: false,
                defaultValue: "",
                
                // items 컬럼에 객체를 포함하고 있는 배열을 넣기 위해 Getter, Setter 사용
                // 메모     @@ 200929 참고
                get() { 
                    return JSON.parse (this.getDataValue ('items')) ; 
                }, 
                set(val) {                     
                    return this.setDataValue ('items', JSON.stringify (val)); 
                },
            }
        }, {
            timestamps: true,   // createdAt, updatedAt 컬럼 추가. 
            paranoid: true,     // deletedAt 컬럼 추가
            // freezeTableName: true,  // 테이블이름과 모델이름을 동일하게 적용
        }        
    )
);
 

/*
module.exports = (sequelize, DataTypes) => (
    sequelize.define('categorylist', {
        userid: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        userpwd: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        usernick: {
            type: DataTypes.STRING(50),
            allowNull: false,            
        },
    // SNS 로그인 관련 START
        // 1. 제공자 (기본값: local)
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',      
        },
        // 2. snsid
        snsid: {
            type: DataTypes.STRING(50),
            allowNull: true,            
        },
    // SNS 로그인 관련 END
    },{        
        timestamps: true,
        paranoid: true,
    })
);
*/