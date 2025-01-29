module.exports = (req, res, next) => {
    res.removeHeader('Connection');
    res.removeHeader('Keep-Alive');
  
    req.rawBody = '';
    req.on('data', chunk => {
      console.log(chunk.toString());
      req.rawBody += chunk.toString();
    });
    req.on('end', () => {
      next();
    });
  };
  