'use strict';

let angular = require('angular');

module.exports = angular
  .module('spinnaker.core.accountRegionClusterSelector.directive', [
    require('../../core/application/listExtractor/listExtractor.service'),
    require('../../core/account/account.service'),
    require('../../core/utils/lodash')
  ])
  .directive('accountRegionClusterSelector', function() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        application: '=',
        component: '=',
        accounts: '=',
        clusterField: '@',
        singleRegion: '=',
      },
      templateUrl: require('./accountRegionClusterSelector.component.html'),
      controllerAs: 'vm',
      controller: function controller(appListExtractorService, accountService, _) {

        this.clusterField = this.clusterField || 'cluster';

        let vm = this;
        let isTextInputForClusterFiled;

        let regions;

        let setRegionList = () => {
          let accountFilter = (cluster) => cluster.account === vm.component.credentials;
          let regionList = appListExtractorService.getRegions([vm.application], accountFilter);
          vm.regions = regionList.length ? regionList : regions;
        };


        let setClusterList = () => {
          let regionField = this.singleRegion ? vm.component.region : vm.component.regions;
          let clusterFilter = appListExtractorService.clusterFilterForCredentialsAndRegion(vm.component.credentials, regionField);
          vm.clusterList = appListExtractorService.getClusters([vm.application], clusterFilter);
        };

        vm.regionChanged = () => {
          setClusterList();
          if (!isTextInputForClusterFiled && ! _.includes(vm.clusterList, vm.component[this.clusterField])) {
            vm.component[this.clusterField] = undefined;
          }
        };

        let setToggledState = () => {
          vm.regions = regions;
          isTextInputForClusterFiled = true;
        };

        let setUnToggledState = () => {
          vm.component[this.clusterField] = undefined;
          isTextInputForClusterFiled = false;
          setRegionList();
        };

        vm.clusterSelectInputToggled = (isToggled) => {
          isToggled ? setToggledState() : setUnToggledState();
        };

        vm.accountUpdated = () => {
          vm.component[this.clusterField] = undefined;
          setRegionList();
          setClusterList();
        };

        let init = () => {
          accountService.getUniqueRegionsForAllAccounts(vm.component.cloudProviderType).then((allRegions) => {
            regions = allRegions;
            return allRegions;
          })
          .then((allRegions) => {
            setRegionList();
            setClusterList();
            vm.regions = _.includes(vm.clusterList, vm.component[this.clusterField]) ? vm.regions : allRegions;
          });
        };

        init();
      }
    };
  });