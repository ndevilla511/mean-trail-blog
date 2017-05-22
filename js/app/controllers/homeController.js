app.controller('homeController', ['$scope','blogpostsDataSvc', function($scope, blogpostsDataSvc){
    var vm = this;

    vm.pageCount = 0;
    vm.lastPage = false;

    blogpostsDataSvc.getAllPosts().then(function(response) {
        vm.blogpostsData = response.data;
    });


    vm.getOlderPosts = function() {
        vm.pageCount += 1;
        var offset = vm.pageCount * 5;
        blogpostsDataSvc.getAllPosts(offset).then(function(response) {
            vm.blogpostsData = response.data;
            $('html, body').scrollTop($("#blogpostList").offset().top);
        });



        offset = (vm.pageCount + 1) * 5;

        blogpostsDataSvc.getAllPosts(offset).then(function(response) {
            if (response.data.length === 0) {
                vm.lastPage = true;
            }
        });
    };

    vm.getNewerPosts = function() {
        if (vm.lastPage === true) {
            vm.lastPage = false;
        }
        vm.pageCount -= 1;
        var offset = vm.pageCount * 5;
        blogpostsDataSvc.getAllPosts(offset).then(function(response) {
            vm.blogpostsData = response.data;
            $('html, body').scrollTop($("#blogpostList").offset().top);
        });
    };

}]);