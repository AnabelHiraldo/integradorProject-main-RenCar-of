const {Router} = require ("express")

const router = Router();


const {
    create,
    confirmEmail,
    createNewPassword,
    getAll
  } = require("../controllers/user.controller");
  
  router.post("/user", create);

  router.get("/user/confirmCode/:code", confirmEmail);

  router.patch("/user/createNewPassword", createNewPassword);

  router.get("/user", getAll);

  

  
//   router.put("/user/:id", update);
  
//   router.get("/user", getAll);
  
//   router.get("/user/:id", getOne);
  
//   router.delete("/user/:id", deleteOne);
  
  module.exports = router;