'use strict';


angular.module('deckApp')
  .controller('ProviderSelectCtrl', function($scope, $modalInstance, settings, providerOptions) {

    $scope.command = {
      provider: ''
    };

    $scope.providerOptions = providerOptions;

    this.selectProvider = function() {
      $modalInstance.close($scope.command.provider);
    };

    this.cancel = $modalInstance.dismiss;

  });
