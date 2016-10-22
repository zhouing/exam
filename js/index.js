//首页核心js文件
$(function(){
    //左侧导航的动画效果
    $(".baseUI>li>a").off("click");//解绑
    $(".baseUI>li>a").on("click",function(){
        $(".baseUI>li>ul").slideUp();
        $(this).next("ul").slideDown(400);
    });
    //默认收起全部，展示第一个
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").eq(0).trigger("click");

    $(".baseUI>li>ul>li").off("click");
    $(".baseUI>li>ul>li").on("click",function () {
        if(!$(this).hasClass("current")){
            $(".baseUI>li>ul>li").removeClass("current");
            $(this).addClass("current");
        }
    });
    //模拟点击第一个a标签
   $(".baseUI>li>ul>li>a").eq(0).trigger("click");
});
//核心模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    .controller("mainCtrl",["$scope",function($scope){

    }]).config(["$routeProvider",function($routeProvider){
        /*
        * a:题目类型id
        * b：难度id
        *c:方向id
        * d:知识点id
        * **/
        $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCtrl"
        }).when("/addSubject",{
            templateUrl:"tpl/subject/addSubject.html",
            controller:"subjectCtrl"
        }).when("/delSubject/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelCtrl"
        }).when("/checkSubject/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"checkCtrl"
        }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListCtrl"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddCtrl"
        }).when("/PaperSubjectList",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectCtrl"
        });
    }]);//防止压缩时出错