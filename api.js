const express = require('express');
const router = express.Router();

var hmacSHA256 = require('crypto-js/hmac-sha256');
var Base64 = require('crypto-js/enc-base64');

function getSignature(data) {
    var API_KEY = 'QUjeYXypMZoyEZHezSon65NiGJW2ZVoPVq7AJ5Pm6QU';
    var api_key = API_KEY;
    var json_data = Buffer.from(JSON.stringify(data)).toString('base64');
    var hash_hmac = Base64.stringify(hmacSHA256(json_data, api_key)); //already base64 encoded
    var sign_data = `${api_key}.${hash_hmac}`;
    var result = Buffer.from(sign_data).toString('base64').replace('=', '');

    return result;
}

router.get('/', (req, res, next) => {
    var mainObj = {
        id: 1,
        value: "static"
    };
    
    var mainData = {
        action:"AGENDA",
        description:"Sample description about the action",
        platform:"ANGULAR",
        data: JSON.stringify(mainObj)
    };
    
    var xhrData = {
        data: mainData,
        signature: getSignature(JSON.stringify(mainObj))
    };

    console.log(getSignature(JSON.stringify(mainObj)));

    res.status(200).json({
        "status": 200,
        "message": "siap digunakan",
        "timestamp": req.requestTime
    });
});

router.get('/v1/', (req, res, next) => {
    res.status(200).json({
        "status": 200,
        "message": "ok",
        "timestamp": req.requestTime
    });
});

router.get('/v1/:boothID', (req, res, next) => {
    res.status(200).json({
        "status": 200,
        "message": "ok",
        "timestamp": req.requestTime,
        "booth_data": {
            "id": parseInt(req.params.boothID),
            "poster": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Paramore_at_Royal_Albert_Hall_-_19th_June_2017_-_11.jpg/1920px-Paramore_at_Royal_Albert_Hall_-_19th_June_2017_-_11.jpg",
            "video": "https://www.youtube.com/watch?v=AEB6ibtdPZc",
            "pdf": "https://www.w3docs.com/uploads/media/default/0001/01/540cb75550adf33f281f29132dddd14fded85bfc.pdf",
            "url": "https://www.youtube.com/channel/UCc7_woMAIVIW2mAr1rPCsFQ"
        }
    });
});

module.exports = router;