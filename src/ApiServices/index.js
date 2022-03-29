var axios = require("axios");

const baseUrl = "https://www.kidskare.net/api.php/";

class ServicesApi {
  endPoints = {
    getAllSchools: "school/list",
    login: "authentication/login",
    getClasses: "classes/getclasses",
    getBusses: "busses/getbusses",
    getChildren: "baseChildren/listForSchool",
    checkInOut: "rollcall/call",
  };

  getApiUrl = (endpoint) => {
    let url = baseUrl + endpoint;
    return url;
  };

  getAllSchools = (callback) => {
    let url = this.getApiUrl(this.endPoints.getAllSchools)
    axios.get(`${url}`)
      .then((response) => callback({ isSuccess: true, response: response?.data }))
      .catch((error) => callback({ isSuccess: false, response: error }));
  }
  login = (school, password, callback) => {
    let url = this.getApiUrl(this.endPoints.login)
    let data = {
      school: school,
      password: password
    };

    var config = {
      method: 'POST',
      url: url,
      data: data,
    };
    axios(config)
      .then((response) => callback({ isSuccess: true, response: response?.data }))
      .catch((error) => callback({ isSuccess: false, response: error }));
  }
  getClasses = (token, callback) => {
    let url = this.getApiUrl(this.endPoints.getClasses)
    var config = {
      method: 'get',
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    axios(config)
      .then((response) => callback({ isSuccess: true, response: response?.data }))
      .catch((error) => {
        console.log(error)
        callback({ isSuccess: false, response: error })
      });
  };
  getBusses = (token, callback) => {
    let url = this.getApiUrl(this.endPoints.getBusses)
    var config = {
      method: 'get',
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    axios(config)
      .then((response) => callback({ isSuccess: true, response: response?.data }))
      .catch((error) => {
        console.log(error)
        callback({ isSuccess: false, response: error })
      });
  };
  getChildren = (token, callback) => {
    let url = this.getApiUrl(this.endPoints.getChildren)
    var config = {
      method: 'get',
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    axios(config)
      .then((response) => {

        callback({ isSuccess: true, response: response?.data })
      })
      .catch((error) => {
        console.log(error)
        callback({ isSuccess: false, response: error })
      });
  };

  checkInOut = async (token, params, callback) => {
    let url = this.getApiUrl(this.endPoints.checkInOut)
    var config = {
      method: 'post',
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: params
    };
    axios(config)
      .then((response) => callback({ isSuccess: true, response: response?.data }))
      .catch((error) => {
        console.log(error)
        callback({ isSuccess: false, response: error })
      });
  };
}


const ApiServices = new ServicesApi();
export default ApiServices;