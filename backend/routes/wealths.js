const router = require('express').Router();
let Wealth = require('../models/wealth.model');

router.route('/').get((req,res) => {
    Wealth.find()
        .then(wealths => res.json(wealths))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/sum').get((req,res) => {
    Wealth.find()
        .then(wealths => {
            assetTotal = wealths.map(wealth => wealth.wAsset).reduce((acc, wealth) => wealth + acc);
            liabilityTotal = wealths.map(wealth => wealth.wLiability).reduce((acc, wealth) => wealth + acc);
            netWorth = assetTotal - liabilityTotal;
            respObj = {"assetTotal": assetTotal, "liabilityTotal": liabilityTotal, "netWorth": netWorth};
            res.json(respObj);
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/add').post((req, res) => {
    const wType = req.body.wType;
    const wName = req.body.wName;
    const wAsset = Number(req.body.wAsset);
    const wLiability = Number(req.body.wLiability);

    const newWealth = new Wealth({
        wType,
        wName,
        wAsset,
        wLiability,
    });

    newWealth.save()
        .then(() => res.json('Wealth added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Wealth.findById(req.params.id)
        .then(wealth => res.json(wealth))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Wealth.findByIdAndDelete(req.params.id)
        .then(() => res.json('Wealth deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Wealth.findById(req.params.id)
        .then(wealth => {
            wealth.wType = req.body.wType;
            wealth.wName = req.body.wName;
            wealth.wAsset = Number(req.body.wAsset);
            wealth.wLiability = Number(req.body.wLiability);

            wealth.save()
                .then(() => res.json('Wealth updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;