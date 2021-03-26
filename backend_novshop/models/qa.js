module.exports = (sequelize, DataTypes) => (
    sequelize.define(
        'qa',
        {
            subject: {
                type: DataTypes.STRING(200),
                allowNull: false,            
                defaultValue: "제목없음",
            },             
            content: {
                type: DataTypes.STRING(5000),
                allowNull: false,
                defaultValue: "내용없음"
            },
            /*
            picture: {
                type: DataTypes.STRING(100),
                allowNull: false,     
                defaultValue: "",                          
            },
            */
            view: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            
        }, {
            timestamps: true,   // createdAt, updatedAt 컬럼 추가. 
            paranoid: true,     // deletedAt 컬럼 추가
            // freezeTableName: true,  // 테이블이름과 모델이름을 동일하게 적용
        }        
    )
);
 