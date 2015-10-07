'use strict';

angular.module('Pear2Pear')
  .factory('SwellRTCommon', [function(){

    var makeModelPublic = function(model){
      model.addParticipant('@' + SwellRTConfig.swellrtServerDomain, null,
        function(err) {
          console.log('ERROR: ' + err);
        }
      );
    };

    return {
      makeModelPublic: makeModelPublic
    };
  }]);

