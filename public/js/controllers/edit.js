/* global angular */

(function () {
  'use strict'

  angular
    .module('finances.edit', [])
    .config(config)
    .controller('EditCtrl', EditCtrl)

  config.$inject = ['$routeProvider']
  function config ($routeProvider) {
    $routeProvider.when('/edit/:id', {
      templateUrl: 'templates/edit.html',
      controller: 'EditCtrl',
      resolve: {
        'currentAuth': ['authService', function (authService) {
          return authService.requireSignIn()
        }]
      }
    })
  }

  EditCtrl.$inject = ['$q', '$location', '$routeParams', 'firebaseDataService']
  function EditCtrl ($q, $location, $routeParams, firebaseDataService) {
    const { transactions, categories } = firebaseDataService
    const vm = this
    vm.editTransaction = editTransaction
    vm.deleteTransaction = deleteTransaction

    $q.all([
      categories.$loaded(),
      transactions.$loaded()
    ])
      .then(data => loadData(data))
      .catch(err => console.error(err))

    function loadData (data) {
      const transaction = transactions.$getRecord($routeParams.id)

      if (!transaction) {
        $location.path('/dashboard')
        return
      }

      vm.transaction = transaction
      delete vm.transaction.categoryColour
      delete vm.transaction.categoryName
    }

    function editTransaction () {
      transactions.$save(vm.transaction).then(() => $location.path('/dashboard'))
    }

    function deleteTransaction () {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        transactions.$remove(vm.transaction).then(() => $location.path('/dashboard'))
      }
    }
  }
})()
