import { Router } from 'express';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { updateContactSchema } from '../validation/contactSchemas.js';

import { authenticate } from '../middlewares/authenticate.js';

import upload from '../middlewares/uploadImage.js';
import { updateContactPhoto } from '../controllers/authControllers.js';


const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
    '/',
    upload.single('photo'),         
    ctrlWrapper(createContact)
);

router.patch(
    '/:contactId',
    isValidId,
    validateBody(updateContactSchema),
    ctrlWrapper(updateContact)
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));


router.patch(
  '/:contactId/photo',
  upload.single('photo'),
  updateContactPhoto
);

export default router;
