// pages/category/category.js
import {
  Config
} from '../../utils/config.js';
import {
  Category
} from 'category_model.js';
var chinese = require("../../utils/Chinese.js")
var english = require("../../utils/English.js")
var category = new Category();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5', 'tanslate6', 'tanslate7', 'tanslate8', 'tanslate9'],
    switchOnImg: Config.switchOnUrl,
    curtainOnImg: Config.curtainOnUrl,
    dimmableLightOneImg: Config.dimmableLightOnUrl,
    gatewayImg: Config.gatewayUrl,
    iASZoneImg: Config.iASZoneUrl,
    // categoryName: Config.categoryName,
    // categoryType: Config.categoryType,
    categoryTypeArray: Config.categoryTypeArray,
    bannerImageUrl: Config.bannerImageUrl,
    imgUrl: Config.deviceImgUrl,
    groupSceneImg: Config.otherImg,
    statusTable: {},
    statusTableOne: {},
    // sceneGroup: ['分组', '场景'],
    // gatewayGroup: ['所有网关'],
    showModal: false,
    content: {
      title: "创建设备组",
      placeholder: "请输入设备组名"
    },
    groupName: '',

    showModalScene: false,
    contentScene: {
      title: "创建场景",
      placeholder: "请输入场景名"
    },
    sceneName: '',
    showDelete: true,
    showDetail: false,
    hiddenPicker: true,
    pickerValueArr: [0],
    pickeredGroup: {},
    socketTasks: [],
    requestId: 1000000, //请求id100w 递减
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var index = 0; //从tab栏跳转过来 
    // var name = this.data.gatewayGroup[0]; //从tab栏跳转过来
    var customerId = app.globalData.customerId;
    var content = app.getLanuage(app.globalData.language);
    var name = content.gatewayGroup[0]; 
    console.log(customerId);
    this.setData({
      categoryName: content.categoryName,
      gatewayGroup: content.gatewayGroup,
      sceneGroup: content.sceneGroup,
      categoryType: content.categoryType,
      currentTabsIndex: -2,
      currentBottomIndex: -2,
      customerId: customerId,
      netStatus: app.globalData.netStatus
    });
    this._loadBaannerTitle(name);
    this._loadGateway();
  },

  onHide: function() {
  },
  onShow: function() {
    if(app.globalData.gatewayName!=null){
      this._loadAllScene(app.globalData.gatewayName);
    }
  },

  onUnload: function() {
    var _this = this;
    if (_this.data.socketTasks.length > 0) {
      _this.data.socketTasks.forEach(function (e) {
        e.close();
      });
    };
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  //加载所有网关
  _loadGateway: function() {
    var _this = this;
    var gatewayList = new Array();
    var customerId = app.globalData.customerId;
    this.setData({
      customerId: customerId
    });
    var param = {
      customerid: customerId
    };
    this.setData({
      netStatus: app.globalData.netStatus
    });
    category.getShareGateway(param, (res) => {
      console.log(res);
      var answer = res.data;
      if (res.status === "success"&&answer.length!=0&&answer!=undefined) {
        console.log(res.data);
        var gatewayFirst = res.data;
        gatewayFirst.forEach(function(e, index) {
          var gatewayData = e.split(",")
          if (gatewayData.length != 0) {
            gatewayData.forEach(function(element) {
              if (element != "") {
                category.getDeviceById(element, (res) => {
                  if (res.id != undefined) {
                    gatewayList.push(res);
                  };
                  _this.setData({
                    gatewayDevice: gatewayList
                  });
                  if (gatewayList.length >= 1) {
                    if (app.globalData.gatewayName != null) {
                      _this.setData({
                        gatewayName: app.globalData.gatewayName,
                        parentdeviceId: app.globalData.gatewayId
                      });
                      _this._loadAllGroup();
                      _this._loadAllScene(app.globalData.gatewayName);
                      _this._loadCateDevices(0);
                    } else {
                      app.globalData.gatewayName = gatewayList[0].name;
                      app.globalData.gatewayId = gatewayList[0].id;
                      app.globalData.gatewayCustomerId = gatewayList[0].customerId;
                      _this.setData({
                        gatewayName: gatewayList[0].name,
                        parentdeviceId: gatewayList[0].id
                      });
                      _this._loadAllGroup();
                      _this._loadAllScene(gatewayList[0].name);
                      _this._loadCateDevices(0);
                    }
                  }
                })
              }
            })
          };
          if (gatewayFirst.length - 1 == index) {
            category.getAllDevices(customerId, (res) => {
              res.data.forEach(function(element) {
                if (element.deviceType === "Gateway") {
                  gatewayList.push(element)
                }
              });
              _this.setData({
                gatewayDevice: gatewayList
              })
              if (gatewayList.length >= 1) {
                if (app.globalData.gatewayName != null) {
                  _this.setData({
                    gatewayName: app.globalData.gatewayName,
                    parentdeviceId: app.globalData.gatewayId
                  });
                  _this._loadAllGroup();
                  _this._loadAllScene(app.globalData.gatewayName);
                  _this._loadCateDevices(0);
                } else {
                  app.globalData.gatewayName = gatewayList[0].name;
                  app.globalData.gatewayId = gatewayList[0].id;
                  app.globalData.gatewayCustomerId = gatewayList[0].customerId;
                  _this.setData({
                    gatewayName: gatewayList[0].name,
                    parentdeviceId: gatewayList[0].id
                  });
                  _this._loadAllGroup();
                  _this._loadAllScene(gatewayList[0].name);
                  _this._loadCateDevices(0);
                }
              } else if (gatewayList.length == 0) {
                // wx.showToast({
                //   title: '您还没有绑定任何网关',
                //   icon: 'none',
                //   duration: 2000
                // });
                _this.setData({
                  categoryAllDevices: null,
                  gatewayName: null,
                  parentdeviceId: null,
                })
                app.globalData.gatewayName = null;
                app.globalData.gatewayId = null;
                app.globalData.gatewayCustomerId = null;
                _this._loadCateDevices(0);
              }
            });
          }
        })
      } else {
        category.getAllDevices(customerId, (res) => {
          res.data.forEach(function(element) {
            if (element.deviceType === "Gateway") {
              gatewayList.push(element)
            }
          });
          _this.setData({
            gatewayDevice: gatewayList
          })
          if (gatewayList.length >= 1) {
            if (app.globalData.gatewayName != null) {
              _this.setData({
                gatewayName: app.globalData.gatewayName,
                parentdeviceId: app.globalData.gatewayId
              });
              _this._loadAllGroup();
              _this._loadAllScene(app.globalData.gatewayName);
              _this._loadCateDevices(0);
            } else {
              app.globalData.gatewayName = gatewayList[0].name;
              app.globalData.gatewayId = gatewayList[0].id;
              app.globalData.gatewayCustomerId = gatewayList[0].customerId;
              _this.setData({
                gatewayName: gatewayList[0].name,
                parentdeviceId: gatewayList[0].id
              });
              _this._loadAllGroup();
              _this._loadAllScene(gatewayList[0].name);
              _this._loadCateDevices(0);
            }
          } else if (gatewayList.length == 0) {
            _this.setData({
              categoryAllDevices: null,
              gatewayName: null,
              parentdeviceId: null,
            })
            app.globalData.gatewayName = null;
            app.globalData.gatewayId = null;
            app.globalData.gatewayCustomerId = null;
            _this._loadCateDevices(0);
          }
        });
      };
    });
  },

  _loadRealtimeData: function(gatewayId) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var _this = this;
    var sConCb = function(res) {};
    var fConCb = function() {};
    //以上为callback
    let socketTask = category.getRealtimeData(gatewayId, sConCb, fConCb, (data) => {
      var id = JSON.parse(data).deviceId;
      //收到服务器端发回数据，更新view层数据
      var sensorData = JSON.parse(data).data;
      // console.log(sensorData);
      var newStatusTableOne = _this.data.statusTableOne;
      var newStatusTable = _this.data.statusTable;
      sensorData.forEach(function(e) {
        if (e.key === 'online') {
          if (e.value == '1.0') {
            newStatusTableOne[id] = true;
          } else {
            newStatusTableOne[id] = false;
          }
        } else if (e.key === 'status') {
          if (e.value == true || e.value == 'true') {
            newStatusTable[id] = true;
          } else {
            newStatusTable[id] = false;
          }
        };
        // console.log(newStatusTable);
        _this.setData({
          statusTableOne: newStatusTableOne,
          statusTable: newStatusTable
        });
      })
    });
    this.data.socketTasks.push(socketTask);
  },

  //长按网关选定该网关
  onGatewayLongPress: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var _this = this;
    var parentdeviceId = event.target.dataset.deviceid;
    var gatewayName = event.target.dataset.deviceinfo.name;
    var gatewayCustomerId = event.target.dataset.deviceinfo.customerId;
    var param = {
      customerId: app.globalData.customerId,
      gatewayName: gatewayName
    }
    this.setData({
      parentdeviceId: parentdeviceId,
      gatewayName: gatewayName
    })
    category.getAllSonDevices(parentdeviceId, (res) => {
      app.globalData.gatewayName = gatewayName;
      app.globalData.gatewayId = parentdeviceId;
      app.globalData.gatewayCustomerId = gatewayCustomerId;
      var allDevices = new Array();
      res.forEach(function(element) {
        if (element.deviceType != "Gateway") {
          if (element.deviceType == "IASZone") {
            var model = element.model;
            element.model = model.substr(5, 3);
            allDevices.push(element);
          } else {
            allDevices.push(element);
          }
        };
        console.log(allDevices);
        _this.data.statusTableOne[element.id] = true;
        var newStatusTableOne = _this.data.statusTableOne;
        _this.setData({
          statusTableOne: newStatusTableOne
        });
      });
      _this.setData({
        categoryAllDevices: allDevices
      });
      _this._loadAllGroup();
      _this._loadAllScene(gatewayName);
      if (_this.data.socketTasks.length > 0) {
        _this.data.socketTasks.forEach(function(e) {
          e.close();
        });
        this.setData({
          socketTasks: []
        })
      };
      wx.showToast({
        title: '为您展现该网关下设备',
        icon: 'none',
        duration: 3000
      })
    })
  },

  /*加载本地banner和title */
  _loadBaannerTitle: function(name) {
    this.setData({
      bannerTitle: name
    });
  },

  onTabCategory: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    if (app.globalData.gatewayId != null && this.data.socketTasks.length == 0) {
      this._loadRealtimeData(app.globalData.gatewayId);
    };
    var index = Number(category.getDataSet(event, 'index')); //number化
    var name = category.getDataSet(event, 'name');
    this.setData({
      currentTabsIndex: index,
      currentBottomIndex: -1
    });
    this._loadBaannerTitle(name); //加载本地banner和标题
    this._loadCateDevices(index); //点击时获取数据
  },

  //load所有设备并分类
  _loadCateDevices: function(index) {
    var _this = this;
    index = Number(index);
    var gatewayList = _this.data.gatewayDevice;
    var parentdeviceId = app.globalData.gatewayId;
    if (index == 0) {
      category.getAllSonDevices(parentdeviceId, (res) => {
        var allDevices = new Array();
        res.forEach(function(element) {
          if (element.deviceType != "Gateway") {
            if (element.deviceType == "IASZone") {
              var model = element.model;
              element.model = model.substr(5, 3);
              allDevices.push(element);
            } else {
              allDevices.push(element);
            }
          };
          _this.data.statusTableOne[element.id] = true;
          var newStatusTableOne = _this.data.statusTableOne;
          _this.setData({
            statusTableOne: newStatusTableOne
          });
        });
        _this.setData({
          categoryAllDevices: allDevices
        })
      })
    } else if (index == _this.data.categoryName.length - 1) {
      /* 对未知设备类型进行归类  */
      var _array = _this.data.categoryTypeArray;
      var otherDevices = new Array();
      _this.data.categoryAllDevices.forEach(function(element) {
        if (!category.inArray(element.deviceType, _array)) {
          otherDevices.push(element);
        }
      });
      _this.setData({
        categoryDevices: otherDevices,
      });
    } else {
      /*========对所有设备按类型分类=============*/
      var currentType = _this.data.categoryName[index];
      var _arrayType = _this.data.categoryType[currentType];
      var typeDevices = new Array();
      this.data.categoryAllDevices.forEach(function(element) {
        if (category.inArray(element.deviceType, _arrayType)) {
          typeDevices.push(element);
        }
      });
      _this.setData({
        categoryDevices: typeDevices
      });

      /* ===========end================= */
    }
  },


  onDevicesItemTap: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var deviceInfo = category.getDataSet(event, 'deviceinfo');
    var deviceid = category.getDataSet(event, 'deviceid');
    var customerId = deviceInfo.customerId;
    var deviceType = deviceInfo.deviceType;
    var model = deviceInfo.model;
    var gatewayname = this.data.gatewayname;
    if (deviceInfo.nickname != null) {
      var deviceName = deviceInfo.nickname;
    } else {
      var deviceName = deviceInfo.name;
    }
    if (deviceType === 'sceneSelector') {
      wx.navigateTo({
        url: '../sceneselector/sceneselector?deviceid=' + deviceid + '&deviceName=' + deviceName
      });
    } else {
      wx.navigateTo({
        url: '../device/device?deviceid=' + deviceid + '&deviceType=' + deviceType + '&deviceName=' + deviceName + '&customerId=' + customerId + '&model=' + model
      });
    }
    // }
  },

  /**
   * 长按设备item
   * 添加设备到分组
   * ==========================================================
   */
  onDeviceLongPress: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    //var deviceid = category.getDataSet(event, 'deviceid');
    var deviceid = event.target.dataset.deviceid;
    if (this.data.allGroupArr.length === 0) {
      wx.showToast({
        title: '您还没有创建任何分组',
        icon: 'none'
      });
    } else {
      this.setData({
        hiddenPicker: false,
        pickeredGroup: this.data.allGroupArr[0],
        currentDeviceId: deviceid
      })
    }
  },

  onPickerChange: function(event) {
    var index = event.detail.value[0];
    this.setData({
      pickeredGroup: this.data.allGroupArr[index]
    });
  },

  onPickerConfirm: function() {
    var currentDeviceId = this.data.currentDeviceId;
    this._assignDeviceToGroup(currentDeviceId);

    this.data.pickeredGroup = {};
    this._hideGroupPicker();
  },

  onPickerCancel: function() {
    this.data.pickeredGroup = {};
    this._hideGroupPicker();
  },

  _hideGroupPicker: function() {
    this.setData({
      hiddenPicker: true
    });
  },

  _assignDeviceToGroup: function(deviceId) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var groupId = this.data.pickeredGroup.id;
    category.assignDeviceToGroup(groupId, deviceId, (res) => {
      wx.showToast({
        title: '应用成功',
      });
    }, (err) => {
      wx.showToast({
        title: '应用失败',
        image: '../../imgs/icon/pay@error.png',
        duration: 1000,
        // mask: true
      });
    });
  },

  /**
   * 控制开关类设备
   * ===========================================================
   */
  switchChange: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    console.log(event);
    var _this = this;
    var status = event.detail.value;
    console.log(status);
    var deviceInfo = category.getDataSet(event, 'deviceinfo');
    var deviceId = deviceInfo.id;
    var requestId = this.data.requestId;

    var triad = {
      deviceType: deviceInfo.deviceType,
      manufacture: deviceInfo.manufacture,
      model: deviceInfo.model
    }

    /**控制需要的请求数据 */
    var data = {
      deviceId: deviceInfo.id,
      requestId: requestId,
      triad: triad,
      status: status
    };

    category.turnSwitch(data, (res) => {
      /**开关变换改变图片 */
      if (res.indexOf("device") === -1) { //状态码为200则应用成功
        _this.data.statusTable[deviceId] = status;
        var newStatusTable = this.data.statusTable;
        this.setData({
          statusTable: newStatusTable
        });
        wx.showToast({
          title: '应用成功',
          icon: 'success',
          duration: 1000,
          // mask: true
        });
      } else { //状态码不是200  应用失败
        _this.data.statusTable[deviceId] = !status;
        var newStatusTable = this.data.statusTable;
        this.setData({
          statusTable: newStatusTable
        });
        wx.showToast({
          title: '应用失败',
          image: '../../imgs/icon/pay@error.png',
          duration: 1000,
          // mask: true
        });
      }
    }, (err) => {
      _this.data.statusTable[deviceId] = !status;
      var newStatusTable = this.data.statusTable;
      this.setData({
        statusTable: newStatusTable
      });
      wx.showToast({
        title: '应用失败',
        image: '../../imgs/icon/pay@error.png',
        duration: 1000,
        // mask: true
      });
      console.log(err);
    });

    this.data.requestId--;

  },
  /**
   * scene & group
   * ======================================================
   */

  onBottomTab: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var index = Number(category.getDataSet(event, 'index'));
    var name = category.getDataSet(event, 'name');
    this.setData({
      currentBottomIndex: index,
      currentTabsIndex: -2
    });
    this._loadBaannerTitle(name); //加载本地banner和标题
  },

  onGatewayTab: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    console.log(event.detail);
    var index = Number(category.getDataSet(event, 'index'));
    // var name = category.getDataSet(event, 'name');
    var index = Number(event.target.dataset.index);
    var name = event.target.dataset.name;
    this.setData({
      currentBottomIndex: -2,
      currentTabsIndex: index
    });
    this._loadBaannerTitle(name);
    this._loadGateway();
  },

  /**
   * =================group=====================
   */

  _loadAllGroup: function(parentdeviceId) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var param = {
      customerId: app.globalData.customerId,
      parentdeviceId: parentdeviceId
    }
    category.loadAllGroup(param, (data) => {
      this.setData({
        allGroupArr: data.data
      })
    })
  },

  _createGroup: function(customerId, groupName) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    category.createGroup(customerId, groupName, (res) => {
      wx.showToast({
        title: '设备组创建成功',
      });
      this._loadAllGroup();
    })
  },

  _deleteGroup: function(groupId) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    category.deleteGroup(groupId, (res) => {
      wx.showToast({
        title: '设备组删除成功',
      });
      this._loadAllGroup();

    })
  },

  onGroupsItemTap: function(event) {
    var groupid = category.getDataSet(event, 'groupid');
    var groupName = category.getDataSet(event, 'groupname');
    wx.navigateTo({
      url: '../group/group?groupid=' + groupid + '&groupName=' + groupName
    });
  },

  onGroupsLongPress: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var _this = this;
    var groupid = category.getDataSet(event, 'groupid');
    wx.showModal({
      title: '删除设备分组',
      content: '您确定要删除该设备分组吗？',
      success: function(res) {
        if (res.confirm) {
          _this._deleteGroup(groupid);
        }
      }
    });
  },

  /**
   * 弹窗添加分组方法
   * ========================================================
   */
  onAddGroupTap: function(event) {
    this.setData({
      showModal: true,
      groupName: ''
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    let theCustomerId = this.data.customerId;
    var submitGroupName = this.data.groupName.trim();
    if (submitGroupName === "") {
      wx.showToast({
        title: '设备组名不能为空',
        icon: 'none'
      })
    } else {
      this.hideModal();
      this._createGroup(theCustomerId, submitGroupName);
    }
  },
  inputChange: function(event) {
    var inputValue = event.detail.value;
    this.data.groupName = inputValue;
  },

  /**
   * =================scene=====================
   */

  /**
   * 加载所有场景
   */
  _loadAllScene: function(gatewayName) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    category.loadAllScene(gatewayName, (data) => {
      this.setData({
        allSceneArr: data
      })
    })
  },

  _createScene: function(params) {
    var gatewayName = this.data.gatewayName
    wx.navigateTo({
      url: '../scene/scene?&sceneName=' + params + '&gatewayName=' + gatewayName
    });
  },

  _alterScene: function(params) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var gatewayName = this.data.gatewayName;
    category.createScene(params, (res) => {
      wx.showToast({
        title: '场景修改成功',
      });
      this._loadAllScene(gatewayName);
    })
  },

  /**
   * 删除场景
   */
  _deleteScene: function(sceneid) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var gatewayName = this.data.gatewayName
    category.deleteScene(sceneid, (res) => {
      if (res == "success") {
        wx.showToast({
          title: '场景删除成功',
          duration: 2000
        });
        this._loadAllScene(gatewayName);
      } else {
        wx.showToast({
          title: '场景删除失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 点击场景
   */
  onSceneItemTap: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var sceneid = category.getDataSet(event, 'sceneid');
    var sceneName = category.getDataSet(event, 'scenename');
    this.setData({
      sceneid: sceneid,
      newSceneName: sceneName
    });
    this._loadSceneDevices(sceneid);
  },

  /***
   * 显示场景详情
   */
  _loadSceneDevices: function(sceneid) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var _this = this;
    var newSceneList = [];
    category.getSceneDevices(sceneid, (data) => {
      if(data.length!=0){
        _this.setData({
          sceneLists: data,
        });
        _this.data.sceneLists.forEach(function (element) {
          category.getDeviceById(element.deviceId, (data) => {
            element.deviceType = data.deviceType,
              element.name = data.name,
              element.nickname = data.nickname,
              newSceneList.push(element);
            _this.setData({
              sceneList: newSceneList
            });
          })
        });
      }else{
        _this.setData({
          sceneList: newSceneList
        });
      }
      // console.log(newSceneList);
      this.setData({
        showDetail: true
      })
    });
  },

  /**
   * 长按删除场景
   */
  onSceneLongPress: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var _this = this;
    var sceneid = category.getDataSet(event, 'sceneid');
    wx.showModal({
      title: '删除场景',
      content: '您确定要删除该场景吗？',
      success: function(res) {
        if (res.confirm) {
          _this._deleteScene(sceneid);
        }
      }
    });
  },

  /**
   * 绑定场景开关
   */
  onBindConfirm: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var sceneid = this.data.sceneid;
    var _this = this;
    var nameList = [];
    var idList = [];
    var sceneSelector = new Array();
    this.data.categoryAllDevices.forEach(function(element) {
      if (element.deviceType === "sceneSelector") {
        sceneSelector.push(element)
      }
    });
    this.setData({
      sceneSelectorList: sceneSelector
    })
    this.data.sceneSelectorList.forEach(function(element) {
      if (element.nickname != null && element.nickname != undefined) {
        nameList.push(element.nickname)
        idList.push(element.id)
      } else {
        nameList.push(element.name)
        idList.push(element.id)
      }
    });
    wx.showActionSheet({
      itemList: nameList,
      success(res) {
        var param = {
          scene_id: sceneid,
          sceneSelectorId: idList[res.tapIndex]
        }
        category.bindSceneSelector(param, (res) => {
          if (res == "success") {
            wx.showToast({
              title: '操作成功',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
    })
  },

  /***
   * 应用场景
   */
  onUseScene: function() {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var sceneid = this.data.sceneid;
    category.useScene(sceneid, (res) => {
      if (res == "success") {
        wx.showToast({
          title: '应用成功',
          duration: 2000
        });
        this.onCancel();
      } else {
        wx.showToast({
          title: '应用失败',
          inco: 'none',
          duration: 2000
        })
      }
    })
  },

  onLeave: function() {
    this.hideModal();
  },

  /**
   * 弹窗添加场景方法
   */
  onAddScene: function(event) {
    this.setData({
      showModalScene: true,
      sceneName: ''
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false,
      showModalScene: false,
      showDetail: false,
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 场景对话框确认按钮点击事件
   */
  onSceneConfirm: function() {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var submitGroupName = this.data.sceneName.trim();
    if (submitGroupName === "") {
      wx.showToast({
        title: '场景名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.hideModal();
      this._createScene(submitGroupName);
    }
  },
  inputSceneChange: function(event) {
    var inputValue = event.detail.value;
    this.data.sceneName = inputValue;
  },

  onDeleteDevice: function() {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var categoryAllDevices = this.data.categoryAllDevices
    if (categoryAllDevices === null || categoryAllDevices.length === 0) {
      wx.showToast({
        title: '您还没有设备',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        showDelete: false,
      })
    }
  },
  onCancelDelete: function() {
    this.setData({
      showDelete: true,
    })
  },

  deleteCertain: function(event) {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var _this = this;
    var deviceid = category.getDataSet(event, 'deviceid');
    var index = category.getDataSet(event, 'index');
    var newAllDevices = this.data.categoryAllDevices;
    var parentdeviceId = this.data.parentdeviceId;
    console.log(parentdeviceId);
    var gatewayName = this.data.gatewayName;
    wx.showModal({
      title: '注意',
      content: '删除设备后网关将与设备断开连接，请您慎重选择！',
      success(res) {
        if (res.confirm) {
          category.deleteDevice(deviceid, (res) => {
            if (res == "success") {
              category.getAllSonDevices(parentdeviceId, (res) => {
                var allDevices = new Array();
                res.forEach(function(element) {
                  if (element.deviceType != "Gateway") {
                    if (element.deviceType == "IASZone") {
                      var model = element.model;
                      element.model = model.substr(5, 3);
                      allDevices.push(element);
                    } else {
                      allDevices.push(element);
                    }
                  }
                });
                _this.setData({
                  categoryAllDevices: allDevices
                });
              })
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    })
  },

  /**下拉刷新设备 */
  onPullDownRefresh() {
    this.setData({
      netStatus: app.globalData.netStatus
    });
    var _this = this;
    var currentBottomIndex = this.data.currentBottomIndex;
    wx.showLoading({
      title: '正在刷新设备...',
    })
    if (currentBottomIndex == -2) {
      this._loadGateway();
      setTimeout(function() {
        wx.hideLoading({
          success: function() {
            wx.stopPullDownRefresh()
          }
        });
      }, 500)
    } else {
      var customerId = app.globalData.customerId;
      var parentdeviceId = this.data.parentdeviceId;
      var gatewayName = this.data.gatewayName;
      var currentTabIndex = this.data.currentTabsIndex;
      console.log(parentdeviceId);
      var param = {
        customerId: app.globalData.gatewayCustomerId,
        gateway_user: gatewayName
      };
      category.addDevice(param, (res) => {

      });
      category.getAllSonDevices(parentdeviceId, (res) => {
        console.log(res);
        var allDevices = new Array();
        res.forEach(function(element) {
          if (element.deviceType != "Gateway") {
            if (element.deviceType == "IASZone") {
              var model = element.model;
              element.model = model.substr(5, 3);
              allDevices.push(element);
            } else {
              allDevices.push(element);
            }
          };
          _this.data.statusTableOne[element.id] = true;
          var newStatusTableOne = _this.data.statusTableOne;
          _this.setData({
            statusTableOne: newStatusTableOne
          });
        });
        _this.setData({
          categoryAllDevices: allDevices
        });
        if (currentTabIndex > 0 && currentTabIndex !== 0) {
          this._loadCateDevices(currentTabIndex);
        }
        setTimeout(function() {
          wx.hideLoading({
            success: function() {
              wx.stopPullDownRefresh()
            }
          });
        }, 500)
      })
    }
  },
})