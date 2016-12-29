/* global angular */

angular.module('finances.services', [])

  .factory('dataService', function ($http, $q) {
    return {
      fetchData: function (type) {
        return $http.get('./demo.json')
          .then(response => response.data[type] || {})
          .catch(error => console.error(error))
      }
    }
  })
