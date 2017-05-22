app.controller('addNewPostController', ['$document', 'blogpostsDataSvc','$window', '$state','jwtHelper', function($document, blogpostsDataSvc, $window, $state, jwtHelper) {
    var vm = this;

    $document
        .one('focus.autoExpand', 'textarea.autoExpand', function(){
            var savedValue = this.value;
            this.value = '';
            this.baseScrollHeight = this.scrollHeight;
            this.value = savedValue;
        })
        .on('input.autoExpand', 'textarea.autoExpand', function(){
            var minRows = this.getAttribute('data-min-rows')|0, rows;
            this.rows = minRows;
            rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
            this.rows = minRows + rows;
        });

    vm.hasTrailReview = false;
    vm.newPostData = [];
    vm.submitted = false;

    vm.addNewPostItem = function(type) {
        var postItem = {
            type: type
        };
        vm.newPostData.push(postItem);
    };

    vm.deletePostItem = function(index) {
        console.log(index);
        vm.newPostData.splice(index, 1);
    };

    vm.insertNewPostItem = function(type, index) {

        console.log(type);
        console.log(index);
        var postItem = {
            type: type
        };

        vm.newPostData.splice(index + 1, 0, postItem);
        vm.insertedItem[index] = "";
    };

    vm.createPost = function() {
        var token = $window.sessionStorage.token;
        var decodedToken = jwtHelper.decodeToken(token);

        var newPost = {
            title: vm.title,
            subtitle: vm.subtitle,
            author: decodedToken.username,
            headerBackgroundImg: vm.headerBackgroundImg,
            hasTrailReview: vm.hasTrailReview,
            postcontent: vm.newPostData
        };

        if(vm.hasTrailReview) {
            newPost.hasTrailReview = true;
            newPost.trailReview = {
                name: vm.trailName,
                park: vm.trailPark,
                //address: vm.trailAddress,
                //coordinates: vm.trailCoordinates,
                difficulty: vm.trailDifficulty,
                rating: vm.trailRating
            }
        } else {
            newPost.trailReview = undefined;
            }

        vm.submitted = true;
        console.log(angular.toJson(newPost));
        //blogpostsDataSvc.createPost(angular.toJson(newPost)).then(function(response) {
        //    console.log(response);
        //    if (response.status === 201) {
        //        $state.go('home');
        //    }
        //    //;
        //});
    }

}]);

