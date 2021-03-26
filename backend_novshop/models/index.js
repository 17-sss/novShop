import Sequelize from 'sequelize';
// const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env]; // 여기서 env는 config의 ["development"] 가져옴
const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.Review = require('./review')(sequelize, Sequelize);
db.QA = require('./qa')(sequelize, Sequelize);
db.Notice = require('./notice')(sequelize, Sequelize);
db.ShoppingCart = require('./shoppingcart')(sequelize, Sequelize);
db.Buy = require('./buy')(sequelize, Sequelize);
// 추후 model 더 생성하면 여기에 적기. (맨 앞글자는 대문자로)


// [1] 1대다 관계 정의 ---------------------------------
// 1) Product
db.Category.hasMany(db.Product);
db.Product.belongsTo(db.Category);

// 2) Review
db.User.hasMany(db.Review);
db.Review.belongsTo(db.User); // 예) belongsTo: Review 모델에 userid 컬럼 추가.
db.Product.hasMany(db.Review);
db.Review.belongsTo(db.Product);

// 3) Q & A
db.User.hasMany(db.QA);
db.QA.belongsTo(db.User); 
db.Product.hasMany(db.QA);
db.QA.belongsTo(db.Product);

// 4) Notice
db.User.hasMany(db.Notice);
db.Notice.belongsTo(db.User); 

// 5) ShoppingCart
db.User.hasMany(db.ShoppingCart);
db.ShoppingCart.belongsTo(db.User); 
db.Product.hasMany(db.ShoppingCart);
db.ShoppingCart.belongsTo(db.Product);

// 6) Buy
db.User.hasMany(db.Buy);
db.Buy.belongsTo(db.User); 

/*
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
*/

// [2] 다대다 관계 정의 ---------------------------------
/*
  시퀄라이즈가 관계를 분석하여 postHashtag라는 이름의 테이블을 자동생성.
  컬럼의 이름은 PostId 그리고 hashtagId 임.

  - post 데이터에는 getHashtags, addHashTags 등의 메서드를 추가
  - hashtag 데이터에는 getPosts, addPosts 등의 메서드를 추가
*/
/*
db.Post.belongsToMany(db.Hashtag, {
  through: 'PostHashtag'
});
db.Hashtag.belongsToMany(db.Post, {
  through: 'PostHashtag'
});
*/

// [3] 같은 테이블끼리 다대다 관계 정의 --------------------------------- 
/*
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',  // 시퀄라이즈에서 addFollower, getFollowers 메서드 추가
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings', // 시퀄라이즈에서 addFollowing, getFollowings 메서드 추가
  through: 'Follow',
});
*/
/* 
  1) through 옵션: 생성할 모델이름을 지정
    같은 테이블간의 다대다 관계에서도 모델이름 컬럼이름을 따로 정해주어야함.
    모델이름이 UserUser일 수 없으니 through 옵션을 사용하여 생성 될 모델이름 Follow로 지정
  
  2) foreignKey 옵션
    Follow모델에서 사용자 아이디를 저장하는 컬럼이 둘 다 userId이면 
    누가 팔로워고 누가 팔로잉 중인지 구분이 불가하기에, 따로 설정해주어야함.
    foreignKey 옵션을 사용해 구분해 Follow 테이블내에서 사용자 아이디를 구별.
  
  3) as 옵션: 시퀄라이즈가 JOIN 작업 시 사용하는 이름.
    as에 등록한 이름을 바탕으로 시퀄라이즈는 
    getFollowings, getFollowers, addFollowing, addFollower, 
    setFollowing, removeFollowing 등 메서드를 자동으로 추가함
*/

module.exports = db;