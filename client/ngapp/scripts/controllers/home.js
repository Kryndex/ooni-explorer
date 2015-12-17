'use strict';

/**
 * @ngdoc function
 * @name ooniAPIApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ooniAPIApp
 */

angular.module('ooniAPIApp')
  .controller('HomeCtrl', function ($q, $scope, $anchorScroll, $location, Report, Country, $rootScope) {

    $rootScope.loaded = false;

    $scope.countries = {
      alpha3: {},
      alpha2: {}
    };

    $scope.columnDefs = [{
        name: 'Country Code',
        field:'alpha2'
    },
    {
        name: 'Country Name',
        field:'name'
    },
    {
        name: 'Count',
        field:'count'
    }]

    var worldMap = {
        scope: 'world',
        responsive: true,
        geographyConfig: {
            borderColor: '#636363',
            borderWidth: 1
        },
        fills: {
            'HIGH': colorbrewer.PuBu[4][3],
            'MEDIUM': colorbrewer.PuBu[4][2],
            'LOW': colorbrewer.PuBu[4][1],
            'defaultFill': colorbrewer.PuBu[4][0]
        },
        data: {}
    };

    $scope.loadReports = function(queryOptions) {
      var deferred = $q.defer();
      Report.countByCountry(function(report_counts) {
          $scope.reportsByCountry = report_counts;
          angular.forEach(report_counts, function(country){
              worldMap.data[country.alpha3] = {
                  reportCount: country.name,
                  alpha2: country.alpha2
              };
              if (country.count < 100) {
                  worldMap.data[country.alpha3]["fillKey"] = "LOW";
              } else if (country.count < 1000) {
                  worldMap.data[country.alpha3]["fillKey"] = "MEDIUM";
              } else {
                  worldMap.data[country.alpha3]["fillKey"] = "HIGH";
              }
          })
          $scope.worldMap = worldMap;
          $rootScope.loaded = true;
          deferred.resolve($scope.reportsByCountry);
      });
      return deferred.promise;
    }

    $scope.map_clicked = function(geo) {
      var country_code = $scope.worldMap.data[geo.id].alpha2;
      $location.path('/country/' + country_code);
    };

    $scope.viewCountry = function(row) {
      console.log("viewing country", row.entitry)
      $location.path('/country/' + row.entity.alpha2);
    }
});

