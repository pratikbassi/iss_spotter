const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  let address = request('https://api.ipify.org?format=json', (err, status, data) =>{

    if (err) {
      callback(err, null);
      return;
    }
    // if non-200 status, assume server error
    if (status.statusCode !== 200) {
      const msg = `Status Code ${status.statusCode} when fetching IP. Response: ${data}`;
      callback(Error(msg), null);
      return;
    }
  

    callback(err, JSON.parse(data)['ip']);

  });

};

const fetchCoordsByIP = (ip, callback) => {
  let address = request(`https://ipvigilante.com/${ip}`, (err, status, unparsed) =>{

    if (err) {
      callback(err, null);
      return;
    }
    // if non-200 status, assume server error
    if (status.statusCode !== 200) {
      const msg = `Status Code ${status.statusCode} when fetching IP. Response: ${unparsed}`;
      callback(Error(msg), null);
      return;
    }
  
    let callbackObj = {latitude:JSON.parse(unparsed)['data']['latitude'], longitude:JSON.parse(unparsed)['data']['longitude']};
    //console.log(callbackObj)
    callback(err, callbackObj);

  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  let address = request(`http://api.open-notify.org/iss-pass.json?lat=${coords['latitude']}&lon=${coords['longitude']}`, (err, status, unparsed) =>{

    if (err) {
      callback(err, null);
      return;
    }
    // if non-200 status, assume server error
    if (status.statusCode !== 200) {
      const msg = `Status Code ${status.statusCode} when fetching IP. Response: ${unparsed}`;
      callback(Error(msg), null);
      return;
    }
    
    callback(err, JSON.parse(unparsed)['response']);

  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((err, data) => {
    if (err) {
      return callback(err, null);
    }

    fetchCoordsByIP(data, (error, data1) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(data1, (errors, data2) => {
        if (errors) {
          return callback(errors, null);
        }
        callback(null, data2);

      });//fetchISS
    });//fetchCoords
  });//fetchMyIP
}; //outermost


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };

