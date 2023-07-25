const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');


const getAllContacts = asyncHandler(async(req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

const getContactById = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to visit other user contacts");
    }
    if(!contact) {
        res.status(404);
        throw new Error(`Not Found any contacts with id : ${req.params.id}`);
    }
    res.status(200).json(contact);
});

const createContact = asyncHandler(async(req, res) => {
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fileds are mandatory!");
    }
    const contact = await Contact.create({
        user_id: req.user.id,
        name,
        email,
        phone,
    });

    res.status(200).json(contact);
})

const updateContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error(`Not Found any contacts with id : ${req.params.id}`);
    }
    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }
    const updatedContact = Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )
    res.status(200).json(updatedContact);
});


const deleteContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error(`Not Found any contacts with id : ${req.params.id}`);
    }
    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete other user contacts");
    }
    await Contact.deleteOne(contact);
    res.status(200).json(Contact);
})

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
}