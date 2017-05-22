app.controller('postController', ['$scope','$stateParams','blogpostsDataSvc', function($scope, $stateParams, blogpostsDataSvc){
    var vm = this;
    var blogpostId = $stateParams['blogpostId'];

    blogpostsDataSvc.getOnePost(blogpostId).then(function(response) {
        vm.blogpostData = response.data;
    });


}]);