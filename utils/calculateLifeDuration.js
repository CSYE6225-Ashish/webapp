const calculatelife = function(inception_time) {
    let life = process.hrtime(inception_time); // Returns [seconds, nanoseconds]
    
    // Convert seconds to milliseconds and nanoseconds to milliseconds
    let lifeTime = life[0] * 1000 + life[1] / 1000000;
    
    return lifeTime; // Return time in milliseconds
  }
  
  module.exports = calculatelife;