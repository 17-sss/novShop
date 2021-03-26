// shoppingcart (장바구니)
/* 
    장바구니에 IN 할 시.    
    ** 공통
        product, user JOIN

    ** 제 1안   
    1. (JOIN) products DB  
        1) name, image, sizes(sizeinfo), price, sale

    2. productdetail page에서 가져옴 (redux product.productSelectItems)
        1) volume (딱 장바구니 처음들어갈 때 값.)
            - 만약 이미 있다면(상품아이디 같고 옵션까지 같다면) volume ++
        2) color, size (selcolor, selsize) (선택한 color, size)
            - [옵션: color / size] 이렇게 표시하기 위함

    3. normal (no db, 들어간다함은 buy 테이블에?)        
        1-1) itemtotalprice (상품 price * volume) 
        1-2) itemtotalmile  (장바구니 상품 (1행) 계산된 마일리지)
        
        // 저장해야하나? 
        2) shippingfee: 배송비 (totalprice 30000넘으면 0원)
        3) totalprice (productdetail에서 가져오는거아님!!!)
            - 배송비, 장바구니에있는 선택한 상품 가격 ++   
        
*/

module.exports = (sequelize, DataTypes) => (
    sequelize.define(
        'shoppingcart',
        {
            // name, image, sizes(sizeinfo), price, sale은 product DB에서
            volume: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            }, 
            selcolor: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            selsize: {
                type: DataTypes.STRING(50),
                allowNull: false,
            }, 

            // -- productId, userId JOIN 설정함.
        }, {
            timestamps: true,   // createdAt, updatedAt 컬럼 추가. 
            paranoid: true,     // deletedAt 컬럼 추가
            // freezeTableName: true,  // 테이블이름과 모델이름을 동일하게 적용
        }        
    )
);
 