const User = require('../schema/user.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        var pageNo = parseInt(req.query.pageNo)?parseInt(req.query.pageNo):1
        var size = parseInt(req.query.size)?parseInt(req.query.size):10
        var pagingCounter= 1
        var skip = size * (pageNo - 1)
        var limit = size
        var userResult = await User.groupUserBasisPost({skip,limit});
    var pagination={
        totalDocs: 100,
        limit,
        page: pageNo,
        totalPages: 1,
        pagingCounter,
        hasPrevPage: pageNo===1?false:true,
        hasNextPage: true,
        prevPage: pageNo===1?null:pageNo-1,
        nextPage: pageNo+1
    }
        res.status(200).json({
            data: {users:userResult,
                pagination 
            }
        })
    } catch (error) {
        res.send({error: error.message});
    }
}