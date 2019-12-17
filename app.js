var app = angular.module('app', ['ngQuill', 'ngFileUpload']);

app.directive('emailDirective', function(Upload, $timeout) {
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
        attachments: []
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

      scope.bytesToSize = bytes => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      };

      scope.changeText = (event, index, key) => {
        scope.receiver[key][index] = event.target.innerHTML
          .trim()
          .replace(/\s/g, '');
      };

 

      scope.updateReceiver = (event, key) => {
        if (
          (event.keyCode === 8 || event.keyCode === 46) &&
          scope.receiverData[key] == ''
        )
          scope.receiver[key].pop();
        else if (event.keyCode === 13 || event.keyCode === 9) {
          scope.insertRes(key);
        }
        return;
      };

      scope.resetGlobal = resetKeys => {
        for (var i = 0; i < resetKeys.length; i++)
          scope.receiverData[resetKeys[i]] = scope.limit[resetKeys[i]];
      };

      /* File Upload */

      scope.uploadFiles = function(files, errFiles) {
        for (let i = 0; i < files.length; i++)
          scope.receiver.attachments.push(files[i]);

        scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
          file.upload = Upload.upload({
            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            data: { file: file }
          });

          file.upload.then(
            function(response) {
              $timeout(function() {
                file.result = response.data;
              });
            },
            function(response) {
              if (response.status > 0)
                scope.errorMsg = response.status + ': ' + response.data;
            },
            function(evt) {
              file.progress = Math.min(
                100,
                parseInt((100.0 * evt.loaded) / evt.total)
              );
            }
          );
        });
      };
    }
  };
});
