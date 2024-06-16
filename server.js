const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

// In-memory storage for rooms and bookings
let rooms = [];
let bookings = [];

// Create a room
app.post('/create-room', (req, res) => {
  const { roomName, numberOfSeats, amenities, pricePerHour } = req.body;
  const newRoom = { roomName, numberOfSeats, amenities, pricePerHour };
  rooms.push(newRoom);
  res.status(201).send(newRoom);
});

// Book a room
app.post('/book-room', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const newBooking = { customerName, date, startTime, endTime, roomId };
  bookings.push(newBooking);
  res.status(201).send(newBooking);
});

// List all rooms with booked data
app.get('/list-rooms', (req, res) => {
  res.status(200).send(rooms.map(room => {
    const roomBookings = bookings.filter(booking => booking.roomId === room.roomName);
    return { ...room, bookings: roomBookings };
  }));
});

// List all customers with their bookings
app.get('/list-customers', (req, res) => {
  const customerBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.customerName]) {
      acc[booking.customerName] = [];
    }
    acc[booking.customerName].push(booking);
    return acc;
  }, {});
  res.status(200).send(customerBookings);
});

// List how many times a customer has booked a room
app.get('/customer-bookings/:customerName', (req, res) => {
    const { customerName } = req.params;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    const bookingCount = customerBookings.length;
    const bookingDetails = customerBookings.map(booking => ({
      roomName: booking.roomId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.bookingId,
      bookingDate: booking.bookingDate,
      bookingStatus: booking.bookingStatus
    }));
    
    res.status(200).send({
      customerName,
      bookingCount,
      bookingDetails
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
