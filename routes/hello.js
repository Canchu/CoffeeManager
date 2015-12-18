var express = require('express');

var router = express.Router();
 
/* GET hello page. */
router.get('/', function(req, res, next) {
	var p1 = req.query['p1'];
	var p2 = req.query.p2;
	var msg = p1 == undefined ? "" : p1 + "," + p2;

    res.render('hello', {
        title: '今月のコーヒー購入リスト',
        data: {
            'hoge1':1800,
            'hoge2':200,
            'hoge3':500
        },
        msg : msg,
        input: ''
    });
});

/* POST hello page. */
router.post('/', function(req, res, next) {
    var str = req.query.input1;
        res.json(
            {msg: str}
        );
});




module.exports = router;
//app.get('/hello', hello.hello);