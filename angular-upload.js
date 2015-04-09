/**
 * @author xialei <xialeistudio@gmail.com>
 */
angular.module('xl-angular-upload', [])
    .directive('angularUpload', [function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<div class="xl-angular-upload">\n    <!--upload button-->\n    <button class="xl-btn btn-primary">上传\n        <input type="file"/>\n    </button>\n    <!--upload queue-->\n    <div class="queue">\n        <div class="item" ng-repeat="item in queue">\n            <div class="info">\n                <div class="no">{{$index+1}}</div>\n                <div class="name">{{item.name}}</div>\n                <div class="size">{{(item.size/1024).toFixed(2)}}KB</div>\n            </div>\n            <div class="process-bar">\n                <div class="process" style="width:{{item.process}}%"></div>\n            </div>\n        </div>\n    </div>\n</div>',
            replace: true,
            link: function (scope, ele, attrs, ctrl) {
                //必要属性检测
                if (!attrs.action) {
                    throw new Error('请设置上传action');
                }
                //初始化
                scope.queue = [];
                var file = angular.element(document.querySelector('.xl-angular-upload>.xl-btn>input[type="file"]'));
                var files = [];
                attrs.accept && file.attr('accept', attrs.accept);
                attrs.multiple && file.attr('multiple', attrs.multiple);
                file.bind("change", function (e) {
                    scope.$apply(function () {
                        scope.queue = [];
                        for (var i in e.target.files) {
                            if (/^\d+$/.test(i)) {
                                e.target.files[i].process = 0;
                                scope.queue.push(e.target.files[i]);
                            }
                        }
                    });
                    //准备上传
                    scope.queue.forEach(function (item) {
                        var data = new FormData;
                        data.append(attrs.name || 'file', item);
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', attrs.action, true);
                        //事件监听
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                //上传完成了
                                var resp = JSON.parse(xhr.responseText);
                                if (resp.error) {
                                    throw new Error(resp.error);
                                } else {
                                    files.push(resp);
                                    ctrl.$setViewValue(files);
                                }
                            }
                        };
                        xhr.onerror = function (error) {
                            throw new Error(error);
                        };
                        xhr.upload && (xhr.upload.onprogress = function (e) {
                            if (e.lengthComputable) {
                                scope.$apply(function () {
                                    item.process = parseInt((e.loaded / e.total) * 100);
                                });
                            }
                        });
                        xhr.send(data);
                    });
                });
            }
        }
    }]);