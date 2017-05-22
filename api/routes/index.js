var express = require('express');
var router = express.Router();

var ctrlBlogposts = require('../controllers/blogposts.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');
//var ctrlTrails = require('../controllers/trails.controllers.js');

// Hotel routes
router
  .route('/posts')
  .get(ctrlBlogposts.blogpostsGetAll)
  .post(ctrlBlogposts.blogpostsAddOne);

router
  .route('/posts/:blogpostId')
  .get(ctrlBlogposts.blogpostsGetOne)
  .put(ctrlBlogposts.blogpostsUpdateOne)
  .delete(ctrlBlogposts.blogpostsDeleteOne);


//Authentication
router
    .route('/users/register')
    .post(ctrlUsers.register);

router
    .route('/users/login')
    .post(ctrlUsers.login);


//// Review routes
//router
//  .route('/posts/:blogpostId/trail')
//  .get(ctrlTrails.reviewsGetAll)
//  .post(ctrlTrails.reviewsAddOne);
//
//router
//  .route('/hotels/:hotelId/reviews/:reviewId')
//  .get(ctrlTrails.reviewsGetOne)
//  .put(ctrlTrails.reviewsUpdateOne)
//  .delete(ctrlTrails.reviewsDeleteOne);

module.exports = router;