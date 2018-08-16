var app = angular.module('myApp', []);

postCfg = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(obj) {    
          var str = [];    
          for (var p in obj) {    
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
          }    
          return str.join("&");
        } 
      };

app.controller('mainController', function($scope, $http) {
    $scope.articles = {};
    $scope.form = {};
    $scope.isEdit = false;
    $scope.isCommentEdit = false;
    $scope.isMyArticle = false;

    
});
app.controller('homeController', function($scope, $http) {
    $scope.articles = {};
    $scope.shows = {};
    $scope.form = {};
    $scope.isLogin = true;
    var isMyArticles = myArticles;
    var user_id = uid;
    $scope.isMyArticles = isMyArticles;
    $scope.toSearch = false;

    // print all articles
    if(!isMyArticles) {
      $http.get('/api/articles')
      .then(function(res) {
        $scope.articles = res.data;
        $scope.filterArticles = function(){
          return $scope.articles.filter(function(item) { 
            return (item.title.toLowerCase().indexOf($scope.form.searchText) > -1 || item.author.toLowerCase().indexOf($scope.form.searchText) > -1)
          }); //end of filter
        }; //end of filterUsers

      }, function(err) {
        console.log(err);
      });
    }
    else {
      $http.get('/api/users/' + user_id)
        .then(function(res) {
          $scope.articles = res.data;
          //console.log($scope.articles);
          $scope.filterArticles = function(){
            return $scope.articles.filter(function(item) { 
              return (item.title.indexOf($scope.form.searchText) > -1 || item.author.indexOf($scope.form.searchText) > -1)
            }); //end of filter
          }; //end of filterUsers

        }, function(err) {
          console.log(err);
        });
    }

    $scope.isSearch = function() {
      $scope.toSearch = true;
    }

    $scope.backHome = function() {
      window.location = 'http://localhost:3000/articles';
    }

    $scope.logOut = function() {
      $http.get('/api/logOut')
      .then(function(res) {
        window.location = 'http://localhost:3000/';
      }, function(err) {
        console.log(err);
      });
    }
});
app.controller('inforController', function($scope, $http) {
    $scope.articles = {};
    $scope.form = {};
    $scope.isLogin = true;
    $scope.isMyArticle = false;
    var article_id = id;
    var user_id = uid;
    //console.log(id);

    $http.get('/api/articles/' + article_id) // print a specific article
      .then(function(res) {
        //console.log(res.data[0][0]);
        $scope.article = res.data[0][0];
        $scope.user_id = user_id;
        $scope.article.post_date = new Date($scope.article.post_date).toLocaleString();
        $scope.article.modify_date = new Date($scope.article.modify_date).toLocaleString();
        if(uid==$scope.article.user_id) $scope.isMyArticle = true;
        else $scope.isMyArticle = false;
        
        $scope.comments = res.data[1]; // print comments
        for(var i=0;i<$scope.comments.length;i++) {
          $scope.comments[i].post_date = new Date($scope.comments[i].post_date).toLocaleString();
          $scope.comments[i].modify_date = new Date($scope.comments[i].modify_date).toLocaleString();
        }
        //console.log(res.data[1]);
      }, function(err) {
        console.log(err);
      });
    $scope.isMyComment = function(id) {
      //console.log(id);
      return user_id == id;
    }
    $scope.removeArticle = function() {
      $http.delete('/api/articles/' + article_id + '/remove/' + user_id)
        .then(function(res) {
          $scope.form = {};
          window.location = 'http://localhost:3000/users/' + user_id;
        }, function(err) {
          console.log(err);
        });
    }
    $scope.removeComment = function(id) {
      $http.delete('/api/comments/' + id + '/remove/' + user_id)
        .then(function(res) {
          $scope.form = {};
          window.location = 'http://localhost:3000/articles/' + article_id;
        }, function(err) {
          console.log(err);
        });
    }
    $scope.logOut = function() {
      $http.get('/api/logOut')
      .then(function(res) {
        window.location = 'http://localhost:3000/';
      }, function(err) {
        console.log(err);
      });
    }
});
app.controller('postController', function($scope, $http) {
    $scope.isLogin = true;
    $scope.article = {};
    $scope.form = {};
    $scope.isEdit = edit;
    var article_id = id;
    var user_id = uid;

    if(edit) {
      $http.get('/api/articles/' + article_id)
      .then(function(res) {
        $scope.article = res.data[0][0];
        //console.log(res.data[0].title)
        $scope.form.title = $scope.article.title;
        $scope.form.content = $scope.article.content;
        //console.log($scope.form);
      },function(err){
        console.log(err);
      });
    }
    $scope.postArticle = function() {
      $http.post('/api/articles/post/' + user_id, $scope.form, postCfg)
        .then(function(res) {
          $scope.form = {};
          $scope.articles = res.data[0];
          window.location = 'http://localhost:3000/users/' + user_id;
        }, function(err) {
          console.log(err);
        });
    }
    $scope.editArticle = function(id) {
      $http.put('/api/articles/' + article_id + '/edit/' + user_id, $scope.form, postCfg)
        .then(function(res) {
          $scope.form = {};
          $scope.articles = res.data[0];
          window.location = 'http://localhost:3000/articles/' + article_id;
        }, function(err) {
          console.log(err);
        });
    }
    $scope.logOut = function() {
      $http.get('/api/logOut')
      .then(function(res) {
        window.location = 'http://localhost:3000/';
      }, function(err) {
        console.log(err);
      });
    }
});

app.controller('commentController', function($scope, $http) {
    $scope.isLogin = true;
    $scope.form = {};
    $scope.isCommentEdit = commentEdit;
    var article_id = id;
    var user_id = uid;
    var comment_id = cid;
    $scope.comment_id = comment_id;

    if(commentEdit) {
      $http.get('/api/articles/' + article_id)
      .then(function(res) {
        $scope.comments = res.data[1];
        for(var i=0;i<$scope.comments.length;i++) {
          //console.log($scope.comments[i]._id);
          if(cid == $scope.comments[i]._id) {
            $scope.form.content = $scope.comments[i].content;
            break;
          }
        }
        console.log($scope.form.content);
      },function(err){
        console.log(err);
      });
    }
    $scope.postComment = function() {
      $http.post('/api/articles/' + article_id + '/comment/' + user_id, $scope.form, postCfg)
        .then(function(res) {
          $scope.form = {}
          window.location = 'http://localhost:3000/articles/' + article_id;
        }, function(err) {
          console.log(err);
        });
    }
    $scope.editComment = function(id) {
      $http.put('/api/comments/' + id + '/edit/' + user_id, $scope.form, postCfg)
        .then(function(res) {
          $scope.form = {};
          window.location = 'http://localhost:3000/articles/' + article_id;
        }, function(err) {
            console.log(err);
        });
    }
    $scope.logOut = function() {
      $http.get('/api/logOut')
      .then(function(res) {
        window.location = 'http://localhost:3000/';
      }, function(err) {
        console.log(err);
      });
    }
});
app.controller('signController', function($scope, $http) {
    $scope.isSignIn = signIn;
    $scope.isLogin = false;
    $scope.signUp = function() {
      $http.post('/api/users/signUp', $scope.form, postCfg)
        .then(function(res) {
          if(res.data=='account exists') {
            $scope.form = {};
            $scope.fail = true;
            return;
          }
          window.location = 'http://localhost:3000/articles';
        }, function(err) {
          console.log(err);
        });
    }
    $scope.signIn = function() {
      console.log('signing in...');
      $http.post('/api/users/signIn', $scope.form, postCfg)
        .then(function(res) {
          //console.log(res);
          if(res.data=='no user') {
            $scope.form = {};
            $scope.fail = true;
            return;
          }
          window.location = 'http://localhost:3000/articles';
        }, function(err) {
          console.log(err);
        });
    }
});

app.directive("compareTo", function() {
      return {
        require: "ngModel",
        scope: {
          c_password: "=compareTo"
        },
        link: function(scope, element, attributes, modelVal) {

          modelVal.$validators.compareTo = function(val) {
            return val == scope.c_password;
          };

          scope.$watch("c_password", function() {
            modelVal.$validate();
          });
        }
      };
    });

