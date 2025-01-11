import { Router } from "express";
import Joi from "joi";
import * as ContactsModels from "../../models/contacts.js";

const contactSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/) // Pattern: tylko litery i spacje
    .required()
    .messages({
      "any.required": "missing required name field",
      "string.empty": "missing required name field",
      "string.pattern.base": "name must contain only letters and spaces",
    }),
  email: Joi.string()
    .email() // Walidacja adresu e-mail
    .required()
    .messages({
      "any.required": "missing required email field",
      "string.empty": "missing required email field",
      "string.email": "email must be a valid email address",
    }),
  phone: Joi.string()
    .pattern(/^\d+$/) // Pattern: cyfry, spacje, opcjonalnie +
    .required()
    .messages({
      "any.required": "missing required phone field",
      "string.empty": "missing required phone field",
      "string.pattern.base": "phone must contain only numbers",
    }),
});

const router = Router();

router.get("/", async (req, res, next) => {
  const contactsList = await ContactsModels.listContacts();
  return res.status(200).json(contactsList);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const searchedContactById = await ContactsModels.getContactById(contactId);
  if (searchedContactById) return res.status(200).json(searchedContactById);

  return res.status(404).json({ message: "Not found" });
});

router.post("/", async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    const message = error.details[0].message;
    return res.status(400).json({ message });
  }

  const { name, email, phone } = req.body;

  const newContact = await ContactsModels.addContact({ name, email, phone });
  return res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contactDelete = await ContactsModels.removeContact(contactId);

  if (contactDelete)
    return res.status(200).json({ message: "contact deleted" });

  return res.status(404).json({ message: "Not found" });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { error } = contactSchema.validate(req.body);
  if (!req.body) {
    return res.status(400).json({ message: "missing fields" });
  }
  if (error) {
    const message = error.details[0].message;
    return res.status(404).json({ message });
  }

  const updatedContact = await ContactsModels.updateContact(
    contactId,
    req.body
  );
  if (!updatedContact) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(updatedContact);
});

export const contactsRouter = router;
