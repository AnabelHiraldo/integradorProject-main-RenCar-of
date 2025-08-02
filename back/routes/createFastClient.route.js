const {Router} = require("express")

const router = Router();

const{
    create,
} = require("../controllers/createFastClient.controller")

router.post("/createFastClient", create);

module.exports = router