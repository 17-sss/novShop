module.exports = (sequelize, DataTypes) => (
    sequelize.define(
        'product',
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,                               
            },
            image: {
                type: DataTypes.STRING(150),
                allowNull: false,            
                defaultValue: "",
            },             
            sizes: {
                type: DataTypes.STRING(700),
                allowNull: false,
                defaultValue: "",
                get() { 
                    return JSON.parse (this.getDataValue ('sizes')) ; 
                }, 
                set(val) {                     
                    return this.setDataValue ('sizes', JSON.stringify (val)); 
                },
            },
            colors: {
                type: DataTypes.STRING(700),
                allowNull: false,
                defaultValue: "",
                get() {                     
                    return JSON.parse (this.getDataValue ('colors')) ; 
                }, 
                set(val) {                     
                    return this.setDataValue ('colors', JSON.stringify (val)); 
                },
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1000,
            },
            sale: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            mileage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            description: {
                type: DataTypes.STRING(1000),
                allowNull: false,  
                defaultValue: "",    
            },
            detailinfo: {
                type: DataTypes.STRING(8000),
                allowNull: false,
                defaultValue: "내용없음"
            },
            // 카테고리_소분류 (id)     ++ 카테고리_대분류는 categoryId로 정의되어있음 (관계정의 해놓음)
            categorySub: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            }
        }, {
            timestamps: true,   // createdAt, updatedAt 컬럼 추가. 
            paranoid: true,     // deletedAt 컬럼 추가
            // freezeTableName: true,  // 테이블이름과 모델이름을 동일하게 적용
        }        
    )
);
 