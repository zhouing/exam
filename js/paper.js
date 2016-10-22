/**
 * Created by Samsung on 2016/9/28 0028.
 * 试卷模块
 */
angular.module("app.paper",["ng","app.subject"])
    //试卷查询控制器
    .controller("paperListCtrl",["$scope",function ($scope) {


    }])
    //试卷添加控制器
    .controller("paperAddCtrl",["$scope","commonService","paperModel","$routeParams","paperService",
        function ($scope,commonService,paperModel,$routeParams,paperService) {
        commonService.getAllDepartmentes(function (data) {
            //将全部方向绑定到dps上
            $scope.dps=data;
        });
        var subjectId=$routeParams.id;
        //双向绑定的模板
        $scope.pmodel=paperModel.model;
        $scope.savePaper=function () {
             paperService.savePaper($scope.pmodel,function (data) {
                 alert(data);
             })
         }
            if(subjectId!=0){
                //将要添加的题目的id添加到数组中
                paperModel.addSubjectId(subjectId);
                //将题目信息添加到subjects数组中
                // 会报错，因为￥routeParams是一个单例对象，只有一个，所有每次ng-repeat的都是同一个对象
                // paperModel.addSubject($routeParams);
                paperModel.addSubject(angular.copy($routeParams));//复制参数
            }
    }])
    //试卷删除控制器
    .controller("paperDelCtrl",["$scope",function ($scope) {

}])
    .factory("paperService",function ($httpParamSerializer,$http) {
        return {
            savePaper:function (param,handler) {
                var obj={};
                for(var key in param){
                    var val=param[key];
                    switch(key){
                        case "departmentId":
                            obj['paper.department.id']=val;
                            break;
                        case "title":
                            obj['paper.title']=val;
                            break;
                        case "desc":
                            obj['paper.description'];
                            break;
                        case "answerTime":
                            obj['paper.answerQuestionTime']=val;
                            break;
                        case "total":
                            obj['paper.totalPoints']=val;
                            break;
                        case "scores":
                            obj['scores']=val;
                            break;
                        case "subjectIds":
                            obj['subjectIds']=val;
                            break;
                    }
                }
                obj=$httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers: {
                        "content-type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    handler(data);
                });
            }
            
        }
    })
    .factory("paperModel",function () {
        return{
            //模板  单列
           model:{
               departmentId:1, //方向id
               title:"",       //试卷标题
               desc:"",        //试卷的描述
               answerTime:0,   //答题时间
               total:0,        //总分
               scores:[],      //每个题目的分值
               subjectIds:[],   //每个题目的id
               subjects:[]
           },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject:function (subject) {
                this .model.subjects.push(subject);
            }
        }
    })
