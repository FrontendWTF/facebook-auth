angular.module('facebook.auth', [
  'facebook'
]).provider('FacebookAuth', function () {
  var options = {};
  var provider = {
    config: function (opts) {
      if (opts) {
        options = angular.extend(options, opts);

        return provider;
      } else {
        return options;
      }
    },
    $get: function (
      $q,
      $rootScope,
      Facebook
    ) {
      var login = $q.defer();

      var service = {
        login: function loginByFacebook (opts) {
          Facebook.promise.then(function (FB) {
            FB.login(function (response) {
              if (response.authResponse) {
                login.resolve(response);
              } else {
                login.reject(response);
              }
            }, angular.extend(options, opts));

            return FB;
          });

          return login.promise;
        },
        logout: function logoutFacebook () {
          var deferred = $q.defer();

          Facebook.promise.then(function (FB) {
            FB.logout(function (response) {
              deferred.resolve(response);
              $rootScope.$broadcast('facebook:logoutSuccess');
            });

            return FB;
          });

          return deferred.promise;
        },
        getLoginStatus: function () {
          var deferred = $q.defer();

          Facebook.promise.then(function (FB) {
            FB.getLoginStatus(function (response) {
              deferred.resolve(response);
            });

            return FB;
          });

          return deferred.promise;
        },
        getAuthResponse: function getFacebookAuthResponse () {
          var deferred = $q.defer();

          Facebook.promise.then(function (FB) {
            var authResponse = FB.getAuthResponse();

            if (authResponse) {
              deferred.resolve(authResponse);
            } else {
              deferred.reject(authResponse);
            }

            return FB;
          });

          return deferred.promise;
        }
      };

      return service;
    }
  };

  return provider;
});
