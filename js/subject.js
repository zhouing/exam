
//题目管理的js模块
angular.module("app.subject",["ng"])
    // .controller("subjectCtrl",function($scope,$location){
    //     $scope.addSubject=function(){
    //         $location.url("/addSubject");
    //     };
    // })
         .controller("checkCtrl",["$routeParams","$location","subjectService",function ($routeParams,$location,subjectService) {
             var id=$routeParams.id;
             var params=$routeParams.state;
             subjectService.checkSubject(id,params,function (data) {
                 alert(data);
             });
             $location.path("/AllSubject/a/0/b/0/c/0/d/0");
         }])
        //删除功能的控制器
    .controller("subjectDelCtrl",["$routeParams","subjectService","$location",
        function ($routeParams,subjectService,$location) {
            var flag = confirm("确认删除吗？");
            if(flag){
                var id = $routeParams.id;
                subjectService.delSubject(id,function (data) {
                    alert(data);
                    //页面发生跳转
                    $location.path("/AllSubject/a/0/b/0/c/0/d/0");
                })
            }else{
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            }
        }])
        .controller("subjectCtrl",["$scope","commonService","$http","$location","subjectService","$routeParams",
            function ($scope,commonService,$http,$location,subjectService,$routeParams) {
             //将路由参数绑定到作用域中
                $scope.params=$routeParams;
                //添加页面绑定的对象
                $scope.subject={
                    typeId:1,    //题型id
                    levelId:1,   //难度id
                    departmentId:1,     //方向id
                    topicId:1,          //知识点id
                    analysis:"",        //答案解析
                    stem:"",            //简单题题干
                    answer:"",          //简答题答案
                    choiceContent:[],   //单选，复选题选项
                    choiceCorrect:[false, false, false, false]
                };
                //保存并继续
                $scope.submit=function () {
                    subjectService.saveSubject($scope.subject, function (data) {
                        alert(data);
                    });
                    //重置作用域中绑定的表单的默认值
                    var subject={
                        typeId:1,
                        levelId:1,
                        departmentId:1,
                        topicId:1,
                        analysis:"",
                        stem:"",
                        answer:"",
                        choiceContent:[],
                        choiceCorrect:[false, false, false, false]
                    };
                    angular.copy(subject,$scope.subject);
                };
                //保存并退出
                $scope.submitAddClose=function () {
                    subjectService.saveSubject($scope.subject, function (data) {
                        alert(data);
                    });
                    //跳转到列表页面
                    $location.path("/AllSubject/a/0/b/0/c/0/d/0")
                };
                /*
                //自己写的
            $scope.click=function ($event) {
                    var arr=[];
                    angular.element(".chose a").each(function (index,data) {
                        arr.push(data.innerHTML);
                    });
                    console.log(arr);
                   arr.forEach(function (item,index) {
                       console.log(angular.element(".chose a")[1]);
                       angular.element(".chose a")[index].value=item;
                   })
                    console.log(angular.element(".chose a").val());
                    $event.preventDefault();
                }*/
            //单个题目添加页面跳转
                $scope.addSubject=function(){
                    $location.url("/addSubject");
                };
                //获取所有题目类型数据,
                commonService.getAllTypes(function (data) {
                    $scope.types=data;
                });
                //获取所有题型难度
                commonService.getAllLevels(function (data) {
                    $scope.levels=data;
                });
                //获取所有题目方向
                commonService.getAllDepartmentes(function (data) {
                    $scope.departments=data;
                });
                //获取所有题目知识点
                commonService.getAllTopics(function (data) {
                    $scope.topics=data;
                });
                //获取所有题目信息
                subjectService.getAllSubjects($routeParams,function (data) {
                    $scope.subjects=data;
                    data.forEach(function (subject) {
                        subject.choices.forEach(function(choice,index){
                            //在选项前面加上A,B,C,D
                            choice.no=commonService.coverIndexToNo(index);
                        });
                        //如果当前为单选或复选题，就修改subject中answer的值，为简答不修改
                        if(subject.subjectType!=null&&subject.subjectType.id!==3){
                            //定义一个空数组用来存放复选题答案
                            var answer=[];
                            subject.choices.forEach(function (choice) {
                                //如果答案正确，将答案插入到数组中
                                if(choice.correct){
                                    answer.push(choice.no);
                                }
                            });
                            //修改answer值，并将数组转化为字符串
                            subject.answer=answer.toString();
                        }
                    });
                });
        }])
        //创建一个服务获取所有题目信息
        .service("subjectService",["$http","$httpParamSerializer",function($http,$httpParamSerializer){

            this.checkSubject=function (id,state,handler) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                    params:{
                        'subject.id':id,
                        'subject.checkState':state
                    }
                }).success(function (data) {
                    handler(data);
                })
            };
            this.delSubject=function (id,handler) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                    params:{
                        'subject.id':id
                    }
                }).success(function (data) {
                            handler(data);
                    });
            }
            this.saveSubject=function (params,handler) {
                //处理数据
                var obj={};
                for(var key in params){
                    var val=params[key];
                    switch(key){
                        case "typeId":
                            obj['subject.subjectType.id']=val;
                            break;
                        case "levelId":
                            obj['subject.subjectLevel.id']=val;
                            break;
                        case "departmentId":
                            obj['subject.department.id']=val;
                            break;
                        case "topicId":
                            obj['subject.topic.id']=val;
                            break;
                        case "analysis":
                            obj['subject.analysis']=val;
                            break;
                        case "stem":
                            obj['subject.stem']=val;
                            break;
                        case "answer":
                            obj['subject.answer']=val;
                            break;
                        case "choiceContent":
                            obj['choiceContent']=val;
                            break;
                        case "choiceCorrect":
                            obj['choiceCorrect']=val;
                            break;
                    }
                }
                //对obj对象进行表单格式的序列化操作（默认）
                obj=$httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                    headers: {
                        "content-type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                });
            }
            //获取所有题目信息
            this.getAllSubjects=function ( params,handler) {
                /**
                 * {
                 * a:0
                 * b:0
                 * c:1
                 * d:3
                 * }
                 * 需要把a，b，c，d转化为后台需要的数据格式
                 * */
                var data={};
                //循环遍历，将data转化为后台能够识别的筛选对象
                for(var key in params){
                    var val=params[key];
                    //只有当val不为0的时候才设置筛选属性
                    if(val!=0){
                        switch(key){
                            case "a":
                                data['subject.subjectType.id']=val;
                                break;
                            case "b":
                                data['subject.subjectLevel.id']=val;
                                break;
                            case "c":
                                data['subject.department.id']=val;
                                break;
                            case "d":
                                data['subject.topic.id']=val;
                                break;
                        }
                    }
                }
                //可以为远程的地址或者本地的
               // $http.get("data/getAllSubject.json").success(function (data) {
               $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                   params:data
               }).success(function (data) {
                //$http.get("http://192.168.2.100:8080/test/exam/manager/getAllSubjects.action").success(function (data) {
                    handler(data);
                })
            };
        }])
    //创建一个公共服务获取信息
        .factory("commonService",["$http",function($http){
            return {
                //通过index（0,1,2,3）获取所对应的序号（A,B,C,D）
                coverIndexToNo:function(index){
                    return index==0?"A":(index==1?"B":(index==2?'C':(index==3?'D':'E')));
                },
                //获取题型，难易程度，方向，知识点的方法
                getAllTypes:function (handler) {
                    //$http.get("data/getAllType.json").success(function (data) {
                        $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                    // $http.get("http://192.168.2.100:8080/test/exam/manager/getAllSubjectType.action").success(function (data) {
                         handler(data);
                    });
                },
                getAllLevels:function (handler) {
                   // $http.get("data/getAllLevels.json").success(function (data) {
                       $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                  //  $http.get("http://192.168.2.100:8080/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                        handler(data);
                    });
                },
                getAllDepartmentes:function (handler) {
                   // $http.get("data/departmentes.json").success(function (data) {
                        $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                   // $http.get("http://192.168.2.100:8080/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                        handler(data);
                    });
                },
                getAllTopics:function (handler) {
                   // $http.get("data/topices.json").success(function (data) {
                        $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                   // $http.get("http://192.168.2.100:8080/test/exam/manager/getAllTopics.action").success(function (data) {
                    handler(data);
                    });
                }
            }
        }])
        //根据方向id获取该方向下的所有知识点
        .filter("selectTopics",function () {
          return function(input,id){
              if(input){
                  var result=input.filter(function (item) {
                      return item.department.id==id;
                  })
                  return result;
              }
          }
        })
        //指令：实现事件绑定
    .directive("selectOption",function () {
        return {
            restrict:"A",
            link:function (scope,element) {
                element.on("change",function () {
                    var type = $(this).attr("type");
                    var val = $(this).val();
                    var isCheck = $(this).prop("checked");
                    //设置值添加
                    if (type == "radio") {
                        //重置
                        scope.subject.choiceCorrect = [false, false, false, false];
                        for (var i = 0; i < 4; i++) {
                            if (i == val) {
                                scope.subject.choiceCorrect[i] = true;
                            }
                        }
                    } else if (type == "checkbox") {
                        for (var i = 0; i < 4; i++) {
                            if (i == val) {
                                scope.subject.choiceCorrect[i] = true;
                            }
                        }
                    }
                    //强制消化:在设置值得情况下，想把scope的值映射到$scope上。实现双向绑定
                    scope.$digest();
                })
            }
        }
    });