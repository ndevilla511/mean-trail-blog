var mongoose = require('mongoose');

var trailReviewSchema = new mongoose.Schema({
    name: {
        type: String
        //default: "",
    },
    park: {
        type: String
        //default: "",

    },
    address: {
        type: String
    },
    //coordinates: [
    //    {
    //        type: Number,
    //        required: false
    //    }
    //],

    difficulty: {
        type: String
        //default: "",

    },
    rating: {
        type: Number,
        //default: 1,
        min: 1,
        max: 5

    }
}
    //,
    //{_id: false}
);




var blogpostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
        //required: true
    },
    author: {
        type: String,
        required: true
    },
    headerBackgroundImg: String,
    hasTrailReview: Boolean,
    trailReview: {
        type: trailReviewSchema
    },
    "post-content": [mongoose.Schema.Types.Mixed]
}, { timestamps: { createdAt: 'date' } });


blogpostSchema.pre('validate', function(next) {
    console.log(this.hasTrailReview);

    if(!this.hasTrailReview) {
        //this.trailReview.coordinates = undefined;
        this.trailReview = undefined;

        console.log(this.trailReview)
    }


    next();
});

mongoose.model('blogpost', blogpostSchema);