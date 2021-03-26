// buy (구매가 확정된 목록)
module.exports = (sequelize, DataTypes) => (
    sequelize.define(
        'buy',
        {                        
            orderNumStr: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },    
            orderInfo: {
                type: DataTypes.STRING(1500),
                allowNull: false,
            }, 
            receiveInfo: {
                type: DataTypes.STRING(1500),
                allowNull: false,
            },
            items: {
                type: DataTypes.STRING(1500),
                allowNull: false,
            },    
            allProductPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },  
            shippingFee: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },  
            totalPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },         
        }, {
            timestamps: true,   // createdAt, updatedAt 컬럼 추가. 
            paranoid: true,     // deletedAt 컬럼 추가            
        }        
    )
);