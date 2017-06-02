app.service('blogpostsDataSvc', ['$http', function($http) {

    this.getAllPosts = function(offset) {
        var offsetQueryString = "?offset=" + offset;
        if(offset === undefined) {
            offsetQueryString = ""
        }
        return $http({
            method: "GET",
            url: "api/posts" + offsetQueryString
        }).then(function(response) {
            console.log(response.data);
            return response
        }).catch(function(error) {
            console.log(error.statusText)
        })
    };

    this.getOnePost = function(id) {
        return $http({
            method: "GET",
            url: "api/posts/" + id
        }).then(function(response) {
            return response
        }).catch(function(error){
            console.log(error.statusText)
        })
    };



    this.createPost = function(data) {
        return $http.post('api/posts', data).then(function(response) {
            return response
        }).catch(function(error) {
            console.log(error.statusText)
        })
    };

}]);