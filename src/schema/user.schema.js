const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
});

const userModel=mongoose.model('User', userSchema);

module.exports = {
    userModel,

    groupUserBasisPost: async ({ skip, limit }) => {
        const pipeline = [
          {
            $lookup: {
              from: "posts",
              localField: "_id",
              foreignField: "userId",
              as: "postInfo",
            },
          },
          {
            $facet: {
              totalCount: [
                {
                  $count: "userCount",
                },
              ],
              groupedData: [
                {
                  $project: {
                    posts: {
                      $size: "$postInfo",
                    },
                    name: 1,
                  },
                },
                {
                  $skip: skip,
                },
                {
                  $limit: limit,
                },
              ],
            },
          },
        ];
    
        return userModel.aggregate(pipeline);
      },
}