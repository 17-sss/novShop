exports.isLoggedIn = (req, res, next) => {
    // passport 객체가 req객체에 isAuthenticated 메서드 추가해줌. (로그인되어있는지 체크가능.)
    if (req.isAuthenticated()) {    
        next();
        return true;
    } else {
        res.status(403).send('로그인 필요');
        return false;
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
        return true;        
    } else {
        // res.redirect("/");
        return false;
    }
};