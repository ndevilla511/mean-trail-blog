var mongoose = require('mongoose');
var blogpost = mongoose.model('blogpost');


var runGeoQuery = function(req, res) {

  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  if (isNaN(lng) || isNaN(lat)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, lng and lat must both be numbers"
      });
    return;
  }

  // A geoJSON point
  var point = {
    type : "Point",
    coordinates : [lng, lat]
  };

  var geoOptions = {
    spherical : true,
    maxDistance : 2000,
    num : 5
  };

  blogpost
    .geoNear(point, geoOptions, function(err, results, stats) {
      console.log('Geo Results', results);
      console.log('Geo stats', stats);
      if (err) {
        console.log("Error finding blogposts");
        res
          .status(500)
          .json(err);
      } else {
        res
          .status(200)
          .json(results);
      }
    });
};

module.exports.blogpostsGetAll = function(req, res) {

  console.log('GET the blogposts');
  console.log(req.query);

  var offset = 0;
  var count = 5;
  var maxCount = 50;

  if (req.query && req.query.lat && req.query.lng) {
    runGeoQuery(req, res);
    return;
  }

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, count and offset must both be numbers"
      });
    return;
  }

  if (count > maxCount) {
    res
      .status(400)
      .json({
        "message" : "Count limit of " + maxCount + " exceeded"
      });
    return;
  }

  blogpost
    .find()
      .sort({date: -1})
    .skip(offset)
    .limit(count)
    .exec(function(err, blogposts) {

      if (err) {
        console.log("Error finding blogposts");
        res
          .status(500)
          .json(err);
      } else {
        console.log("Found blogposts", blogposts.length);
        res
          .json(blogposts);
      }
    });

};

module.exports.blogpostsGetOne = function(req, res) {
  var id = req.params.blogpostId;

  console.log('GET blogpostId', id);

  blogpost
    .findById(id)
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding blogpost");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("blogpostId not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "blogpost ID not found " + id
        };
      }
      res
        .status(response.status)
        .json(response.message);
    });

};

var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};

module.exports.blogpostsAddOne = function(req, res) {
  console.log("POST new blogpost");

  blogpost
    .create({
        title: req.body.title,
        subtitle: req.body.subtitle,
        headerBackgroundImg: req.body.headerBackgroundImg,
        author: req.body.author,
        date: req.body.date,
        hasTrailReview: req.body.hasTrailReview,
        trailReview: req.body.trailReview,
        "post-content": req.body.postcontent
      //name : req.body.name,
      //description : req.body.description,
      //stars : parseInt(req.body.stars,10),
      //services : _splitArray(req.body.services),
      //photos : _splitArray(req.body.photos),
      //currency : req.body.currency,
      //location : {
      //  address : req.body.address,
      //  coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      //}
    }, function(err, newblogpost) {
      if (err) {
        console.log("Error creating blogpost");
        res
          .status(400)
          .json(err);
      } else {
        console.log("blogpost created!", newblogpost);
        res
          .status(201)
          .json(newblogpost);
      }
    });

};


module.exports.blogpostsUpdateOne = function(req, res) {
  var blogpostId = req.params.blogpostId;

  console.log('GET blogpostId', blogpostId);

  blogpost
    .findById(blogpostId)
    .select('-post-content')
    .exec(function(err, post) {
      if (err) {
        console.log("Error finding blogpost");
        res
          .status(500)
          .json(err);
          return;
      } else if(!post) {
        console.log("HotelId not found in database", blogpostId);
        res
          .status(404)
          .json({
            "message" : "Hotel ID not found " + blogpostId
          });
          return;
      }
        post.title = req.body.title;
        post.subtitle = req.body.subtitle;
        post.author = req.body.author;
        post.date = req.body.date;
        post.trail = {
            name: req.body.trailname,
            park: req.body.trailpark,
                address: req.body.address,
                coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
            difficulty: req.body.difficulty,
            rating: req.body.rating
        };
        post["post-content"] = req.body.postcontent;



      //hotel.name = req.body.name;
      //hotel.description = req.body.description;
      //hotel.stars = parseInt(req.body.stars,10);
      //hotel.services = _splitArray(req.body.services);
      //hotel.photos = _splitArray(req.body.photos);
      //hotel.currency = req.body.currency;
      //hotel.location = {
      //  address : req.body.address,
      //  coordinates : [parseFloat(req.body.lng), parseFloat(req.body.lat)]

      blogpost
        .save(function(err, blogpostUpdated) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });


    });

};


module.exports.blogpostsDeleteOne = function(req, res) {
  var blogpostId = req.params.blogpostId;

  blogpost
    .findByIdAndRemove(blogpostId)
    .exec(function(err, location) {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log("blogpost deleted, id:", blogpostId);
        res
          .status(204)
          .json();        
      }
    });
};











