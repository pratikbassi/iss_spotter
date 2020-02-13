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

module.exports = { fetchMyIP };

//fetchMyIP((data) => {console.log(data)});