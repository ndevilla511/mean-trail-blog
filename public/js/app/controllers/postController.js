app.controller('postController', ['$scope','$stateParams','blogpostsDataSvc', function($scope, $stateParams, blogpostsDataSvc){
    var vm = this;
    var blogpostId = $stateParams['blogpostId'];

    blogpostsDataSvc.getOnePost(blogpostId).then(function(response) {
        vm.blogpostData = response.data;
    });

    vm.stars = function(count) {
        return Array.apply(0, Array(+count)).map(function(value,index){
            return index;
        });
    }



}]);