var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  console.log(req.query);
  res.send(req.query.echostr);
  res.end();
});

module.exports = router;

