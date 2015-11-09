(function() {

  angular.module('bewd.tictactoe', ['bewd.tictactoe.board', 'bewd.tictactoe.registration', 'ngRoute'])
    .config(
      function($routeProvider) {
        $routeProvider.when('/login', {
          templateUrl: '/partials/login',
          controller: 'LoginController',
          controllerAs: 'vm'
        });
        $routeProvider.when('/users', {
          templateUrl: '/partials/users',
          //controller: 'LoginController',
          //controllerAs: 'vm'
        });
        $routeProvider.when('/games', {
          //
          templateUrl: '/partials/games',
          controller: 'BoardsController',
          controllerAs: 'boards'
        });
        $routeProvider.when('/game/wacky', {
          templateUrl: '/public/tmpls/board.html',
          controller: 'BoardController',
          controllerAs: 'vm',
          resolve: {
            boardObj: function() {
              return {
                board: [['A','B','C'], ['D','E','F'], ['X','Y','Z']]
              };
            }
          }
        });
        $routeProvider.when('/game/:id', {
          templateUrl: '/public/tmpls/board.html',
          controller: 'BoardController',
          controllerAs: 'vm',
          resolve: {
            boardObj: function($route, boardService) {
              return boardService.getBoard($route.current.params.id);
            }
          }
        });
      }
    )
    .run(function($rootScope, $location) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        console.log(next);
      });
    });
  
  angular.module('bewd.tictactoe')
    .controller('LoginController', function($http,  $location, $rootScope) {
      var vm = this;
      vm.tryToLogin = tryToLogin;

      function tryToLogin() {
        $http.post('/login', { username: vm.username, password: vm.password })
          .then(function(response) {
            var data = response.data;
            if (data.success) {
              $rootScope.isLoggedIn = true;
              alert(data.message);
              $location.path('/games');
            } else {
              alert(data.errors);
            }
          })
          .catch(function(response) {
            console.log(response.data.errors);
          });
      }
    });

})();