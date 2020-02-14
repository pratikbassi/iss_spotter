let request = require('request-promise-native');

const fetchMyIp = () => {
  return request('https://api.ipify.org?format=json')
}

const fetchCoordsByIP = (body) => {
  return request(`https://ipvigilante.com/json/${JSON.parse(body)['ip']}`);
};

const fetchISSFlyOverTimes = (body) => {
  let locat = {latitude: JSON.parse(body)['data']['latitude'], longitude:JSON.parse(body)['data']['latitude']};
  let times = (request(`http://api.open-notify.org/iss-pass.json?lat=${locat['latitude']}&lon=${locat['longitude']}`));
  return times;
}

const nextISSTimesForMyLocation = () => {
  return fetchMyIp()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const { response } = JSON.parse(data);
    return response;
  })
}

module.exports = {nextISSTimesForMyLocation}