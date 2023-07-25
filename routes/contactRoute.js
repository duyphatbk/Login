const express = require("express");
const router = express.Router();
const contactControllers = require("../controllers/contactController");
const validateToken = require("../middleware/validateToken");

router.use(validateToken);

router.get('/', contactControllers.getAllContacts)
    .post('/', contactControllers.createContact);

router.get('/:id', contactControllers.getContactById)
    .put('/:id', contactControllers.updateContact)
    .delete('/:id', contactControllers.deleteContact);

module.exports = router;