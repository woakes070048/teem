
'use strict';

angular.module('Pear2Pear')
  .directive('upgradingModal', [
  '$window',
  function($window) {
    return {
      scope: true,
      link: function(scope){
        var appCache = $window.applicationCache;

        // Browsers not supporting Application Cache
        if (!appCache) {
          return;
        }

        appCache.addEventListener('downloading', function() {
          scope.upgrading = true;
        });

        appCache.addEventListener('cached', function() {
          scope.upgrading = false;
        });

        appCache.addEventListener('updateready', function() {
          scope.upgrading = false;
          appCache.swapCache();
        });
      },
      templateUrl: 'upgrading-modal.html'
    };
  }]);
