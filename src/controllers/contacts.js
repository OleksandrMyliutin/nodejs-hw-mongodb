import {
    getPaginatedContacts,
    getContactById as getContactByIdService,
    createContact as createContactService,
    updateContact as updateContactService,
    deleteContact as deleteContactService,
  } from '../services/contacts.js';
  import createHttpError from 'http-errors';
  
  export const getAllContacts = async (req, res, next) => {
    try {
      const {
        page = 1,
        perPage = 10,
        sortBy = 'name',
        sortOrder = 'asc',
        type,
        isFavourite,
      } = req.query;
  
      const result = await getPaginatedContacts({
        page: Number(page),
        perPage: Number(perPage),
        sortBy,
        sortOrder,
        type,
        isFavourite,
        ownerId: req.user.id,
      });
  
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const getContactById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
  
      const contact = await getContactByIdService(contactId, req.user.id);
  
      if (!contact) {
        throw createHttpError(404, 'Contact not found');
      }
  
      res.status(200).json({
        status: 200,
        message: 'Successfully fetched contact!',
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const createContact = async (req, res, next) => {
    try {
      const ownerId = req.user.id;
      const newContact = await createContactService(req.body, ownerId);
  
      res.status(201).json({
        status: 201,
        message: 'Successfully created contact!',
        data: newContact,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const updateContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const updateData = req.body;
  
      const updated = await updateContactService(contactId, updateData, req.user.id);
  
      if (!updated) {
        throw createHttpError(404, 'Contact not found');
      }
  
      res.status(200).json({
        status: 200,
        message: 'Successfully updated contact!',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const deleteContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;
  
      const deleted = await deleteContactService(contactId, req.user.id);
  
      if (!deleted) {
        throw createHttpError(404, 'Contact not found');
      }
  
      res.status(200).json({
        status: 200,
        message: 'Successfully deleted contact!',
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  };
  