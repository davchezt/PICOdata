const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
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