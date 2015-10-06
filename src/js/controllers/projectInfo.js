'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ProjectInfoCtrl
 * @description
 * # ProjectInfoCtrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities/:comId/projects/:id', {
        templateUrl: 'projects/info.html',
        controller: 'ProjectInfoCtrl'
      });
  }])
  .controller('ProjectInfoCtrl', [
              'pear', '$scope', '$location', '$route', '$timeout', 'common',
              function (pear, $scope, $location, $route, $timeout, common) {

    $scope.urlId= pear.urlId;

    $scope.communityId = $route.current.params.comId;

    $scope.comments = {
      new: []
    };

    pear.onLoad(function(){
      pear.communities.find($route.current.params.comId)
        .community.then(function(community){
        $scope.community = community;
      });

      pear.projects.find($route.current.params.id)
        .then(function(proxy) {
          $scope.project = proxy;
          $scope.needs = $scope.project.needs;
        });
    });

    $scope.isSupporter = function(project) {
      if (!project) {
        return false;
      }

      if (!project.supporters) {
        return false;
      }
      // Migrate project.support
      return pear.users.loggedIn() && project.supporters.indexOf(pear.users.current()) > -1;
    };

    $scope.toggleSupport = function(project) {
      // Need a valid login to support
      if (! pear.users.loggedIn()) {
        $location.path('session/new');

        return;
      }
      pear.toggleSupport(project.id);
    };

    $scope.toggleCommentsVisibility = function toggleCommentsVisibility(need) {
      $scope.comments.visible = need;
    };

    $scope.areCommentsVisible = function areCommentsVisible(need) {
      return $scope.comments.visible === need;
    };

    $scope.sendComment = function sendComment(needIndex) {
      var need = $scope.project.needs[needIndex];
      var comment = $scope.comments.new[needIndex];
      pear.addNeedComment(need, comment);
      pear.addChatNotification(
        $route.current.params.id, 'need.comment.notification', 
        {
          user: pear.users.current().split('@')[0],
          need: need.text,
          comment: comment
        }
      );
      $scope.comments.new[needIndex] = '';
    };

    $scope.hour = function(comment) {
      return common.time.hour(new Date(comment.time));
    };

    function tab() {
      if ($route.current.params.tab) {
        return $route.current.params.tab;
      } else {
        return 'information';
      }
    }

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === tab() ? 'active' : '';
    };

  }]);