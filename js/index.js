
var app = angular.module('weather', []);

app.controller('weatherController', function ($scope, $http, $interval) {
    $scope.codes = cityData.codes;
    $scope.isShowCityList = false;
    $scope.currentCity = ''
    $scope.showCityList = () => {
        $scope.isShowCityList = !$scope.isShowCityList;
    }


    $scope.currentTime = () => {
        var date = new Date();
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }

    /**
     * 更新天气信息
     */
    $scope.refreshWeather = (code) => {
        localStorage.code = code
        $scope.loadSuccess = false;
        $http({
            method: 'GET',
            url: `http://wthrcdn.etouch.cn/weather_mini?citykey=${code}`
        }).then((response) => {
            $scope.updateTime = $scope.currentTime();
            showWeather(response.data.data, $scope)
        })
        $scope.currentCity = cityMap[code]
        $scope.isShowCityList = false;

    }

    /**
     * 初始化天气信息
     */
    if (localStorage.code == 'undefined' || localStorage.code == undefined)
        $scope.refreshWeather($scope.codes[0].code)
    else
        $scope.refreshWeather(localStorage.code)

    /**
     * 每隔五分钟更新一次天气信息
     */
    var timer = $interval(() => {
        $scope.refreshWeather(localStorage.code)
    }, 300000)



})

// 当前获取到的天气信息
function showWeather(weatherData, scope) {
    scope.currentTemp = weatherData.wendu;
    scope.tips = weatherData.ganmao
    setBasicWeatherInfo(scope, weatherData.forecast[0])
    scope.forecast = [];
    for (var i = 1; i <= 4; i++) {
        var day = {};
        setBasicWeatherInfo(day, weatherData.forecast[i])
        scope.forecast.push(day)
    }

}
// 截取‘星期n’类型的字符串
function getWeekString(date) {
    return date.substring(date.length - 3, date.length);
}

// 设置基本的天气信息：气候类型，最高温、最低温，星期几
function setBasicWeatherInfo(basic, data) {
    basic.type = data.type
    basic.high = data.high.substring(2, data.high.length)
    basic.low = data.low.substring(2, data.low.length)
    basic.date = getWeekString(data.date)
}


