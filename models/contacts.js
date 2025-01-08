import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
const dirName = import.meta.dirname;
const contactsPath = path.join(dirName, "/contacts.json");

export const listContacts = async (filePath = contactsPath) => {
  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    console.log(`Contacts reading from ${filePath}`.bgGreen);
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`File not found: ${filePath}`.bgRed);
    } else {
      console.error(`Error reading file: ${filePath}`.bgRed);
    }
  }
};

export const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const findedContact = contacts.find((contact) => contact.id === contactId);

    if (!findedContact) {
      return console.error(`Contact with ID: ${contactId} not found`.bgYellow);
    }
    return findedContact;
  } catch (error) {
    console.error(`Error getContactById: ${error}`.bgRed);
  }
};

export const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const findedContact = contacts.find((contact) => contact.id === contactId);

    if (findedContact) {
      const updatedContacts = contacts.filter(
        (contact) => contact.id !== contactId
      );
      await writeContactsToFile(updatedContacts);
    }
    return findedContact;
  } catch (error) {
    console.error(`Error remove contact: ${error}`.bgRed);
  }
};

export const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const contact = { id: nanoid(), name, email, phone };
    const contacts = await listContacts();
    contacts.push(contact);
    await writeContactsToFile(contacts);
    return contact;
  } catch (error) {
    console.error(`Error addContact: ${error}`.bgRed);
  }
};

export const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();

    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactIndex === -1) {
      console.error(`Contact with ID: ${contactId} not found`.bgYellow);
      return null;
    }

    const updatedContact = { ...contacts[contactIndex], ...body };
    contacts[contactIndex] = updatedContact;

    await writeContactsToFile(contacts);
    console.log(`Contact with ID: ${contactId} updated successfully`.bgGreen);

    return updatedContact;
  } catch (error) {
    console.error(`Error updateContact: ${error}`.bgRed);
  }
};

export async function writeContactsToFile(contacts, filePath = contactsPath) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(contacts, null, 2));
    console.log(`Contacts saved to ${filePath}`);
  } catch (error) {
    throw new Error(`Error writing file: ${filePath}`);
  }
}
