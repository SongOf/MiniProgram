var English = {
  button: "中文",
  mypublish: "Album",
  mynews: "Friends' Comments",
  feedback: "Feedback",
  scan:"Add Gateway",
  deleteGateway:"Delete Gateway",
  refreshGateway:"Equipment connected to network",
  share:'Sharing Gateway',
  unshare:'Unshare Gateway',
  myfeedback: "If you have any suggessions,please contact me",
  search: "Search...",
  content: "What do you want to say...",
  comment: "Comment",
  submit: "Post",
  place: "Location",
  alldevice: "All equipment",
  categoryName : ['All', 'Bulb', 'Curtain', 'Socket', 'Monitor', 'Lock', 'Infrared', 'Sensor', 'Others'],
  gatewayGroup:['Gateways'],
  sceneGroup:['Groups','Scenes'],
  categoryType : {
    'Bulb': ['dimmableLight','switch'],
    // 'Switch': ['switch'],
    'Curtain': ['curtain'],
    'Socket': ['outlet'],
    'Monitor': ['monitor'],
    'Lock': ['lock'],
    'Infrared': ['infrared'],
    'Sensor': ['temperature', 'PM2.5', 'IASZone', 'lightSensor'],
    'Others': ['dimmableLight', 'curtain', 'switch'],
  },
  cores: [
    [{
      id: 'smartHome',
      name: 'Home',
      disabled: true,
      image: '/imgs/index/smartHome.png',
      // url: '../second/smarthome/smarthome'
      url: '../category/category'
    },
    {
      id: 'bigData',
      name: 'Big Data',
      disabled: true,
      image: '/imgs/index/bigData.png',
      url: '../home/home'
    },
    {
      id: 'smartHotel',
      name: 'Smart Hotel',
      disabled: true,
      image: '/imgs/index/smartHotel.png',
      url: '../second/hotel/hotel'
      // url: '../category/category'
    },
    {
      id: 'cloudAlert',
      name: 'Cloud Alert',
      disabled: true,
      image: '/imgs/index/cloudAlert.png',
      // url: '../second/alert/alert'
      url: '../category/category'
    },
    {
      id: 'cloudFireControl',
      name: 'Fire Control',
      disabled: true,
      image: '/imgs/index/cloudFireControl.png',
      // url: '../second/firecontrol/firecontrol'
      url: '../category/category'
    },
    {
      id: 'farm',
      name: 'Farm',
      disabled: true,
      image: '/imgs/index/farm.png',
      // url: '../second/farm/farm'
      url: '../category/category'
    },
    {
      id: 'safeCity',
      name: 'Safe City',
      disabled: true,
      image: '/imgs/index/safeCity.png',
      // url: '../second/s-city/s-city'
      url: '../category/category'
    },
    {
      id: 'smartCommunity',
      name: 'Community',
      disabled: true,
      image: '/imgs/index/smartCommunity.png',
      // url: '../second/community/community'
      url: '../category/category'
    },
    {
      id: 'smartSchool',
      name: 'School',
      disabled: true,
      image: '/imgs/index/smartSchool.png',
      // url: '../second/school/school'
      url: '../category/category'
    },
    {
      id: 'smartOld',
      name: 'Old',
      disabled: true,
      image: '/imgs/index/smartOld.png',
      // url: '../second/old/old'
      url: '../category/category'
    },
    {
      id: 'smartOffice',
      name: 'Office',
      disabled: true,
      image: '/imgs/index/smartOffice.png',
      // url: '../second/office/office'
      url: '../category/category'
    },
    {
      id: 'smartCity',
      name: 'Smart City',
      disabled: true,
      image: '/imgs/index/smartCity.png',
      // url: '../second/city/city'
      url: '../category/category'
    },
    {
      id: 'artificialIntelligence',
      name: 'AI',
      disabled: true,
      image: '/imgs/index/artificialIntelligence.png',
      // url: '../second/ai/ai'
      url: '../category/category'
    },
    {
      id: 'serviceSupport',
      name: 'Service',
      disabled: true,
      image: '/imgs/index/team.png',
      url: '../second/support/support'
    },
    {
      id: 'companyIntroduction',
      name: 'Gantch',
      disabled: true,
      image: '/imgs/index/company.png',
      url: '../second/company/company'
    },
    ],
  ],
  bulb: "Bulb",
  socket: "Socket",
  curtain: "Curtain",
  sensor: "Sensor",
  swi: "Switch",
  monitor: "Monitor",
  lock: "Gate lock",
  othertypes: "Other types",
  scenetypes: "Scene types",
  temperature: "Temperature",
  humidity: "humidity",
  infrared: "infrared",
  name: "name",
  success: "success",
  failure: "failure",
  welcome: "It's time for smart living",
  register: 'Create an account',
  email: 'Email...',
  phone: 'Phone...',
  userreg: 'Sing up',
  failed: 'Login failure',
  failedmess: "We did't find your informaton,please sign up firstly.",
  del: 'Delete',
  delmes: 'Are you sure you want to do this?',
  loading: 'Loading',
  wrong: "Can't get your location"
}

module.exports = {
  Content: English
}