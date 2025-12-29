const sessionIdTUserMap = new Map();

function setUser(id,user){
    sessionIdTUserMap.set(id,user);
}

function getUser(id){
    return sessionIdTUserMap.get(id);
}

module.exports={
    setUser,
    getUser,
}