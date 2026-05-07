const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

/* =================================
   BOOKINGS
================================= */

const getAllBookings = require('./bookings/getAllBookings');
const getBookingById = require('./bookings/getBookingbyId');
const createBooking = require('./bookings/createBooking');
const updateBooking = require('./bookings/updateBooking');
const deleteBooking = require('./bookings/deleteBooking');

app.get('/bookings', getAllBookings);
app.get('/bookings/:id', getBookingById);
app.post('/bookings', createBooking);
app.put('/bookings/:id', updateBooking);
app.delete('/bookings/:id', deleteBooking);


/* =================================
   EMPLOYMENT DETAILS
================================= */

const getAllEmployments = require('./employment_details/getAllEmployments_details');
const getEmploymentById = require('./employment_details/getEmployment_detailsById');
const createEmployment = require('./employment_details/createEmployment_details');
const updateEmployment = require('./employment_details/updateEmployment_details');
const deleteEmployment = require('./employment_details/deleteEmployment_details');

app.get('/employment-details', getAllEmployments);

app.get(
  '/employment-details/:employee_id',
  getEmploymentById
);

app.post('/employment-details', createEmployment);

app.put(
  '/employment-details/:employee_id',
  updateEmployment
);

app.delete(
  '/employment-details/:employee_id',
  deleteEmployment
);


/* =================================
   GUESTS
================================= */

const getAllGuests = require('./guests/getAllGuests');
const getGuestById = require('./guests/getGuestById');
const createGuest = require('./guests/createGuest');
const updateGuest = require('./guests/updateGuest');
const deleteGuest = require('./guests/deleteGuest');

app.get('/guests', getAllGuests);
app.get('/guests/:id', getGuestById);
app.post('/guests', createGuest);
app.put('/guests/:id', updateGuest);
app.delete('/guests/:id', deleteGuest);


/* =================================
   MEMBERS
================================= */

const getAllMembers = require('./members/getAllMembers');
const getMemberById = require('./members/getMemberById');
const createMember = require('./members/createMember');
const updateMember = require('./members/updateMember');
const deleteMember = require('./members/deleteMember');

app.get('/members', getAllMembers);
app.get('/members/:id', getMemberById);
app.post('/members', createMember);
app.put('/members/:id', updateMember);
app.delete('/members/:id', deleteMember);


/* =================================
   PAYMENTS
================================= */

const getAllPayments = require('./payments/getAllPayments');
const getPaymentById = require('./payments/getPaymentById');
const createPayment = require('./payments/createPayment');
const updatePayment = require('./payments/updatePayment');
const deletePayment = require('./payments/deletePayment');

app.get('/payments', getAllPayments);
app.get('/payments/:id', getPaymentById);
app.post('/payments', createPayment);
app.put('/payments/:id', updatePayment);
app.delete('/payments/:id', deletePayment);


/* =================================
   PROFILES
================================= */

const getAllProfiles = require('./profiles/getAllProfiles');
const getProfileById = require('./profiles/getProfileById');
const createProfile = require('./profiles/createProfile');
const updateProfile = require('./profiles/updateProfile');
const deleteProfile = require('./profiles/deleteProfile');

app.get('/profiles', getAllProfiles);
app.get('/profiles/:id', getProfileById);
app.post('/profiles', createProfile);
app.put('/profiles/:id', updateProfile);
app.delete('/profiles/:id', deleteProfile);


/* =================================
   ROOMS
================================= */

const getAllRooms = require('./rooms/getAllRooms');
const getRoomById = require('./rooms/getRoomById');
const createRoom = require('./rooms/createRoom');
const updateRoom = require('./rooms/updateRoom');
const deleteRoom = require('./rooms/deleteRoom');

app.get('/rooms', getAllRooms);
app.get('/rooms/:id', getRoomById);
app.post('/rooms', createRoom);
app.put('/rooms/:id', updateRoom);
app.delete('/rooms/:id', deleteRoom);


/* =================================
   SERVER
================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});