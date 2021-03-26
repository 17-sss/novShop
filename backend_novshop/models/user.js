module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        userid: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        userpwd: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,            
        },
        address: {
            type: DataTypes.STRING(1000),
            allowNull: false,          
        },
        phonenumber: {
            type: DataTypes.STRING(500),
            allowNull: false,  
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,  
        },
        mileage: {
            // 마일리지 사용은 추후 구현
            type: DataTypes.INTEGER,
            allowNull: false,  
            defaultValue: 0,
        },
    // 유저 권한 (0: 일반, 1: 운영진, 2: 최고관리자)
        authority: {    
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,    
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
        /* 
            1. timestamps 속성
                createdAt과 updatedAt모델을 추가 하므로 데이터베이스 
                항목이 언제 db로 들어 갔는지 그리고 언제 마지막으로 업데이트되었는지 알 수 있음 
            2. paranoid 속성
                - true로 설정하면, deletedAt column이 table에 추가.
                - 해당 row를 삭제시 실제로 데이터가 삭제되지 않고 deletedAt에 삭제된 날짜가 추가되며, 
                    deletedAt에 날짜가 표기된 row는 find 작업시 제외
        */
        timestamps: true,
        paranoid: true,
    })
);