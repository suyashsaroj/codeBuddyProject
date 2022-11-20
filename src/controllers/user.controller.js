const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    /*
        1. page denotes the page number of which result is fetched
        2. limit denotes the count of data to be shown on a single page by default we are considering it to be 10 can be configured
        3. paginingCounter denotes how next pages needs to be incremented
        4. skip denotes the records to skip
        5. totalDocs denotes the number of users present in the database
    */
    const page = req.query.page ? parseInt(req.query.page) : 1;
    if (page < 0 || page === 0 || isNaN(page)) {
      return res.send({ error: "Please Enter valid page number" });
    }
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const pagingCounter = req.query.pagingCounter
      ? parseInt(req.query.pagingCounter)
      : 1;
    const skip = limit * (page - 1);
    const dbResult = await User.groupUserBasisPost({ skip, limit });
    const totalDocuments =
      dbResult &&
      dbResult.length &&
      dbResult[0].totalCount &&
      dbResult[0].totalCount[0] &&
      dbResult[0].totalCount[0].userCount
        ? dbResult[0].totalCount[0].userCount
        : 0;
    const users =
      dbResult && dbResult.length && dbResult[0].groupedData
        ? dbResult[0].groupedData
        : [];
    const totalPages = Math.ceil(totalDocuments / limit);
    const pagination = {
      totalDocs: totalDocuments,
      limit,
      page,
      totalPages,
      pagingCounter,
      hasPrevPage: page === 1 ? false : true,
      hasNextPage: page === totalPages ? false : true,
      prevPage: page === 1 ? null : page - 1,
      nextPage: page + 1,
    };
    res.status(200).json({
      data: { users, pagination },
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};