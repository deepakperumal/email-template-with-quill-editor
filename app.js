var app = angular.module('app', ['ngQuill']);

app.directive('emailDirective', function($timeout) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: './partials/templates/email.component.html',
    link: function(scope, elem, attrs) {
      scope.title = '';
      scope.changeDetected = false;

      scope.contentChanged = function(editor, html, text) {
        scope.changeDetected = true;
        scope.receiver.body = html;
      };

      scope.receiver = {
        to: [],
        cc: [],
        bcc: [],
        subject: '',
        body: '',
        attachments:''
      };

      scope.receiverData = {
        to: '',
        cc: '',
        bcc: '',
        toLimit: 5,
        ccLimit: 5,
        bccLimit: 5
      };

      scope.limit = { ...scope.receiverData };

      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      scope.insertRes = par => {
        let temp = scope.receiver[par];
        if (scope.receiverData[par].trim()) temp.push(scope.receiverData[par]);
        scope.receiver[par] = [...new Set(temp)];
        scope.receiverData[par] = '';
      };

      scope.send = () => {
        console.log(scope.receiver);
      };

      scope.reset = req => {
        scope.receiverData[req] = scope.limit[req];
      };

      scope.display = function(req) {
        if (req == 1) scope.cc = 1;
        else scope.bcc = 1;
      };

      scope.removeItem = (item, index) => {
        scope.receiver[index] = scope.receiver[index].filter(
          (val, index, arr) => {
            return val != item;
          }
        );
      };

      scope.checkValid = data => {
        return re.test(data);
      };
    }
  };
});
