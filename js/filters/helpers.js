/* global angular */

function totalAmount (collection) {
  if (!collection.length) return 0
  return collection.reduce((a, b) => a + b.amount, 0)
}

function daysInMonth (month, year) {
  return new Date(year, month, 0).getDate()
}

function getWeekNumber (d) {
  d = new Date(+d)
  d.setMilliseconds(0)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  var yearStart = new Date(d.getFullYear(), 0, 1)
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return weekNo
}

function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

angular.module('finances.filters', [])
  .filter('totalAmount', [() => totalAmount])
  .filter('daysInMonth', [() => daysInMonth])
  .filter('getWeekNumber', [() => getWeekNumber])
  .filter('uuid', [() => uuid])
