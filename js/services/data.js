/* global angular */

angular.module('finances.services', [])

  .factory('dataService', function ($http, $q, $localStorage) {
    function fetchData () {
      return $http.get('./demo.json')
          .then(response => response.data)
          .catch(error => console.error(error))
    }

    return {
      fetchData
    }
  })
