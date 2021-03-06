'use strict';

let angular = require('angular');

module.exports = angular
  .module('spinnaker.google.serverGroup.configure.wizard.loadBalancers.selector.directive', [
    require('../../../../../core/cache/infrastructureCaches.js'),
    require('../../serverGroupConfiguration.service.js'),
  ])
  .directive('gceServerGroupLoadBalancerSelector', function () {
    return {
      restrict: 'E',
      templateUrl: require('./loadBalancerSelector.directive.html'),
      scope: {},
      bindToController: {
        command: '=',
      },
      controllerAs: 'vm',
      controller: 'gceServerGroupLoadBalancerSelectorCtrl',
    };
  }).controller('gceServerGroupLoadBalancerSelectorCtrl', function (gceServerGroupConfigurationService, infrastructureCaches) {
    this.getLoadBalancerRefreshTime = () => {
      return infrastructureCaches.loadBalancers.getStats().ageMax;
    };

    this.refreshLoadBalancers = () => {
      this.refreshing = true;
      gceServerGroupConfigurationService.refreshLoadBalancers(this.command).then(() => {
        this.refreshing = false;
      });
    };
  });
