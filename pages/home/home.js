import * as echarts from '../../utils/ec-canvas/echarts';
import {
  Home
} from 'home_model.js';
import {
  Config
} from '../../utils/config.js';
var util = require('../../utils/util.js');
 
var home = new Home();

const app = getApp();
var curTemprature = undefined;
var curHumidity = undefined;
var curPm25 = undefined;

var historyTemprature = [];
var historyHumidity = [];
var historyPM = [];
var historyTime = [];

var globalCateDeviceArr = null;
var globalLineDeviceArr = null;

var gaugeComponent = {}; //存放所有图表组件

/** 初始化温度计 */
function initChart_temp(canvas, width, height) {

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
      name: '温度',
      type: 'gauge',
      radius: '100%',
      detail: {
        formatter: '{value}℃',
        fontSize: 20,
        offsetCenter: [0, '60%']
      },
      min: -20,
      max: 40,
      animation: false,
      axisLine: {
        show: true,
        lineStyle: {
          width: 5,
          shadowBlur: 0,
          color: [
            [0.4, '#37a2da'],
            [0.7, '#67e0e3'],
            [0.77, '#008717'],
            [1, '#fd666d']
          ]
        }
      },
      splitLine: { //分割线长
        length: 10
      },
      axisTick: { //刻度线长
        length: 5,

      },
      axisLabel: { //刻度标签
        show: true,
        distance: 1,
        fontSize: 10
      },
      pointer: {
        length: '50%',
        width: 3
      },
      data: [{
        value: curTemprature,
        name: '温度'
      }]

    }]
  };

  chart.setOption(option, true);

  return chart;

}

/**初始化湿度计 */
function initChart_hum(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
      name: '湿度',
      type: 'gauge',
      radius: '100%',
      detail: {
        formatter: '{value}%',
        fontSize: 20,
        offsetCenter: [0, '60%']
      },
      min: 20,
      axisLine: {
        show: true,
        lineStyle: {
          width: 5,
          shadowBlur: 0,
          color: [
            [0.4, '#fd666d'],
            [0.6, '#008717'],
            [1, '#67e0e3']
          ]
        }
      },
      splitLine: { //分割线长
        length: 10
      },
      axisTick: { //刻度线长
        length: 5,

      },
      axisLabel: { //刻度标签
        show: true,
        distance: 1,
        fontSize: 10
      },
      pointer: {
        length: '50%',
        width: 3
      },
      data: [{
        value: curHumidity,
        name: '湿度'
      }]

    }]
  };

  chart.setOption(option, true);

  return chart;
}

/**初始化pm2.5 */

function initChart_pm25(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
      name: 'pm2.5',
      type: 'gauge',
      radius: '100%',
      detail: {
        formatter: '{value}',
        fontSize: 20,
        offsetCenter: [0, '60%']
      },
      max: 300,
      animation: false,
      axisLine: {
        show: true,
        lineStyle: {
          width: 5,
          shadowBlur: 0,
          color: [
            [0.167, '#6bcd07'],
            [0.333, '#fbd029'],
            [0.5, '#fe8800'],
            [0.667, '#fe0000'],
            [1, '#970454']
          ]
        }
      },
      splitLine: { //分割线长
        length: 15
      },
      axisTick: { //刻度线长
        show: false,
        length: 5,

      },
      splitLine: {
        show: false
      },
      axisLabel: { //刻度标签
        show: false,
        distance: 1,
        fontSize: 10
      },
      pointer: {
        length: '50%',
        width: 3
      },
      data: [{
        value: curPm25,
        name: 'pm2.5'
      }]

    }]
  };

  chart.setOption(option, true);

  return chart;
}


/**初始化饼状图 */
function initChart_piecount(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        show: true,
        normal: {
          fontSize: 16,
          formatter: '{b}: {c}\n{d}%'
        },
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '70%'],
      data: [{
          value: globalCateDeviceArr['其他类型'].length,
          name: '其他类型'
        },
        {
          value: globalCateDeviceArr['灯泡'].length,
          name: '灯泡'
        }, {
          value: globalCateDeviceArr['插座'].length,
          name: '插座'
        }, {
          value: globalCateDeviceArr['窗帘'].length,
          name: '窗帘'
        }, {
          value: globalCateDeviceArr['传感器'].length,
          name: '传感器'
        }, {
          value: globalCateDeviceArr['开关'].length,
          name: '开关'
        },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;

}

/** 初始化折线图 */
function initChart_line(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      // text: '测试下面legend的红色区域不应被裁剪',
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['温度', '湿度', 'pm2.5'],
      top: 10,
      left: 'center',
      backgroundColor: '#fff',
      /**'rgba(165,202,124,0.5)' */
      z: 100
    },
    grid: {
      containLabel: true,
      width: "90%",
      height: "75%",
      left: "center",
      top: 40
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: globalLineDeviceArr['historyTime'],
      // 
      //  
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '温度',
      type: 'line',
      smooth: true,
      data: globalLineDeviceArr['temperature'],
      // 
      // 
    }, {
      name: '湿度',
      type: 'line',
      smooth: true,
      data: globalLineDeviceArr['humidity'],
      // 
      // 
    }, {
      name: 'pm2.5',
      type: 'line',
      smooth: true,
      data: globalLineDeviceArr['pm25'],
      // 
      // 
    }]
  };

  chart.setOption(option);
  return chart;
}


Page({
  data: {
    ec_temp: {
      onInit: initChart_temp,
    },
    ec_hum: {
      onInit: initChart_hum
    },
    // ec_pm25: {
    //   onInit: initChart_pm25
    // },
    ec_piecount: {
      // onInit: initChart_piecount
    },
    ec_history: {
      // onInit: initChart_line
    },
    socketTasks: [],
    homeCategoryType: Config.homeCategoryType,

    categoryDeviceArr: {
      '灯泡': [],
      '插座': [],
      '窗帘': [],
      '传感器': [],
      '开关': [],
      '其他类型': [],
      temp_humi: [],
      pm: []
    },

    lineDeviceArr: {
      'temperature': [],
      'humidity': [],
      'pm25': [],
      'historyTime': [],
    },

  },

  onLoad: function(options) {
    var customerId = app.globalData.customerId;
    this.setData({
      theCustomerId: customerId,
      netStatus: app.globalData.netStatus
    });

    this._selectComponent();
    this._loadAllDevices(customerId);
  },

  onUnload: function() {
    var cleanId = this.data.cleanId;
    clearInterval(cleanId);
  },

  _selectComponent: function() {
    gaugeComponent.tempComponent = this.selectComponent('#temperature');
    gaugeComponent.humiComponent = this.selectComponent('#humidity');
    // gaugeComponent.pm25Component = this.selectComponent('#pm25');
    gaugeComponent.pieComponent = this.selectComponent('#pie_count');
    gaugeComponent.lineComponent = this.selectComponent('#history');
  },


  //load所有设备并分类
  _loadAllDevices: function(customerId) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    home.getAllDevices(customerId, (res) => {
      let allDevices = res.data;
      this._categoryForDevices(allDevices);
      gaugeComponent.pieComponent.init(initChart_piecount);

      this._getTempPmDevice(this.data.categoryDeviceArr);
    });
  },

  _categoryForDevices: function(customerAllDevices) {
    var _this = this;
    var homeType = this.data.homeCategoryType;

    customerAllDevices.forEach(function(element) {
      if (home.inArray(element.deviceType, homeType['灯泡'])) {
        _this.data.categoryDeviceArr['灯泡'].push(element);
      } else if (home.inArray(element.deviceType, homeType['插座'])) {
        _this.data.categoryDeviceArr['插座'].push(element);
      } else if (home.inArray(element.deviceType, homeType['窗帘'])) {
        _this.data.categoryDeviceArr['窗帘'].push(element);
      } else if (home.inArray(element.deviceType, homeType['传感器'])) {
        _this.data.categoryDeviceArr['传感器'].push(element);
        if (element.deviceType === 'temperature') {
          _this.data.categoryDeviceArr.temp_humi.push(element);
        }
        if (element.deviceType === 'PM2.5') {
          _this.data.categoryDeviceArr.pm.push(element);
        }
      } else if (home.inArray(element.deviceType, homeType['开关'])) {
        _this.data.categoryDeviceArr['开关'].push(element);
      } else {
        _this.data.categoryDeviceArr['其他类型'].push(element);
      }
    })

    globalCateDeviceArr = this.data.categoryDeviceArr;
  },

  _getTempPmDevice: function(categoryDeviceArr) {
    var _this = this;
    if (categoryDeviceArr.temp_humi.length === 0) {
      wx.showToast({
        title: '您还没有任何温湿度传感器',
        icon: 'none'
      })
      globalLineDeviceArr = this.data.lineDeviceArr;
      gaugeComponent.lineComponent.init(initChart_line)
    } else {
      let firstTempDeviceId = categoryDeviceArr.temp_humi[0].id;
      _this._loadLatestData(firstTempDeviceId);
      var cleanId = setInterval(
        function () {
          _this._loadLatestData(firstTempDeviceId);
        }, 5000)
      this.setData({
        cleanId: cleanId
      })
      
      this._loadHistoryData(firstTempDeviceId, 'temperature');
      this._loadHistoryData(firstTempDeviceId, 'humidity');
    }
    if (categoryDeviceArr.pm.length != 0) {
      let firstPMDeviceId = categoryDeviceArr.pm[0].id;
      this._loadHistoryData(firstPMDeviceId, 'PM2.5');
    }
    // gaugeComponent.lineComponent.init(initChart_line);
    // if (categoryDeviceArr.pm.length === 0){
    //   wx.showToast({
    //     title: '您还没有任何pm2.5度传感器',
    //     icon: 'none'
    //   })
    // }
    // else{
    //   let firstPmDeviceId = categoryDeviceArr.pm[0].id;
    //   this._loadRealtimeData_pm(firstPmDeviceId);
    // }
  },

  _loadHistoryData: function(deviceId, keyType) {
    var history1 = [];
    var history2 = [];
    var history3 = [];
    var _this = this;
    var timestamp = Date.parse(new Date());
    var param = {
      deviceId: deviceId,
      key: keyType,
      startTs: (timestamp / 1000 - 24 * 60 * 60 * 7) * 1000,
      endTs: timestamp,
      limit: 7,
      interval:86400000, 
      // 86400000,
      aggregation: "AVG"
    }
    this.setData({
      netStatus: app.globalData.netStatus
    });
    home.getHistoryData(param, (res) => {
      _this.data.lineDeviceArr['historyTime'] = [];
      var arrayValue = res;
      if (keyType == 'temperature') {
        arrayValue.forEach(function (element) {
          history1.push(util.formatData(new Date(element.ts)))
          // _this.data.lineDeviceArr['historyTime'].push(util.formatData(new Date(element.ts)))
          _this.data.lineDeviceArr['temperature'].push(Number(element.value.toFixed(2)))
        });
      } else if (keyType == 'humidity') {
        arrayValue.forEach(function(element) {
          history2.push(util.formatData(new Date(element.ts)))
          _this.data.lineDeviceArr['humidity'].push(Number(element.value.toFixed(2)))
        });
      } else if (keyType == 'PM2.5') {
        arrayValue.forEach(function(element) {
          history3.push(util.formatData(new Date(element.ts)))
          _this.data.lineDeviceArr['pm25'].push(Number(element.value.toFixed(2)))
        });
      }
      if(history1.length>=history2.length&&history1.length>=history3.length){
        history1.forEach(function (element) {
          _this.data.lineDeviceArr['historyTime'].push(element)
        });
      } else if (history2.length >= history1.length && history2.length >= history3.length){
        history2.forEach(function (element) {
          _this.data.lineDeviceArr['historyTime'].push(element)
        });
      } else if (history3.length >= history1.length && history3.length >= history2.length) {
        history3.forEach(function (element) {
          _this.data.lineDeviceArr['historyTime'].push(element)
        });
      }
      globalLineDeviceArr = this.data.lineDeviceArr;
      gaugeComponent.lineComponent.init(initChart_line)
    })
  },

  _loadLatestData:function(deviceId){
    home.getlatestData(deviceId,(res)=>{
      var sensorData = res;
      console.log(sensorData);
      sensorData.forEach(function (e) {
        if (e.key === 'temperature') {
          curTemprature = Number(e.value);
          gaugeComponent.tempComponent.init(initChart_temp);
        }
        if (e.key === 'humidity') {
          curHumidity = Number(e.value);
          gaugeComponent.humiComponent.init(initChart_hum);
        }
      })
    })
  }
});