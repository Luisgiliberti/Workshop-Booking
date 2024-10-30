const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/Views');

// Connect to MongoDB
mongoose.connect("mongodb+srv://luisgiliberti:R00232200@cluster0.fvs1dnl.mongodb.net/CompanyDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Data Models
const bookingSchema = new mongoose.Schema({
    bookingNo: String,
    fname: String,
    lname: String,
    dob: Date,
    address: String,
    email: String,
    tel_number: Number,
    time: String,
    date: Date,
    cardDetails: String,
    fullname: String,
    details: String,
    workshopSelection: String,
});
const booking = mongoose.model('Bookings', bookingSchema);

const Help_RequestSchema = new mongoose.Schema({
    helpNo: String,
    fullName: String,
    email: String,
    phoneNumber: String,
    details: String,
});
const helprequest = mongoose.model('Help_Requests', Help_RequestSchema);

function generateBookingNumber() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    let bookingNumber = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        bookingNumber += characters.charAt(randomIndex);
    }
    return bookingNumber;
}

app.get('/', (req, res) => {
    res.render('home'); });

app.get('/about', (req, res) => {
    res.render('about'); });

app.get('/create-booking', (req, res) => {
    res.render('create-booking'); });

app.get('/delete-booking', (req, res) => {
    res.render('delete-booking'); });

app.get('/deleted-booking', (req, res) => {
    res.render('deleted-booking'); });

app.get('/display-booking', (req, res) => {
    res.render('display-booking'); });

app.get('/help', (req, res) => {
    res.render('help');});

app.get('/main-booking', (req, res) => {
    res.render('main-booking'); });

app.get('/modify-booking', (req, res) => {
    res.render('modify-booking'); });

app.get('/report-bookings', (req, res) => {
    res.render('report-bookings'); });

app.get('/report-workshops', (req, res) => {
    res.render('report-workshops'); });

app.get('/submit-booking', (req, res) => {
    res.render('submit-booking'); });

app.get('/submit-help-request', (req, res) => {
    res.render('submit-help-request'); });

app.get('/update-booking', (req, res) => {
    res.render('update-booking'); });

app.use(express.urlencoded({ extended: true }));

app.post('/submit-booking', async (req, res) => {
    try {
        const bookingNumber = generateBookingNumber();

        const newBooking = new booking({
            bookingNo: bookingNumber,
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            address: req.body.address,
            email: req.body.email,
            tel_number: req.body.tel_number,
            time: req.body.time,
            date: req.body.date,
            cardDetails: req.body.cardDetails,
            workshopSelection: req.body.workshopSelection,
        });

        await newBooking.save();
        res.render('submit-booking', { booking: newBooking });
    } catch (err) {
        console.error('Error saving booking:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/update-booking', async (req, res) => {
    const bookingNumber = req.body.bookingNumber;
    const existingBooking = await booking.findOne({ bookingNo: bookingNumber });

    if (existingBooking) {
        await booking.deleteOne({ bookingNo: bookingNumber });
        res.render('create-booking', { existingBooking });
    } else {
        res.render('modify-booking', { message: 'Booking number not found. Please try again.' });
    }
});

app.post('/deleted-booking', async (req, res) => {
    const bookingNumber = req.body.bookingNumber;
    const confirmation = req.body.confirmation;

    if (confirmation === 'yes') {
        await booking.deleteOne({ bookingNo: bookingNumber });
        res.render('deleted-booking');
    } else if (confirmation === 'no') {
        res.render('not-deleted-booking');
    } else {
        res.status(400).send('Invalid confirmation choice');
    }
});


app.post('/display-booking', async (req, res) => {
    try {
        const bookingNumber = req.body.bookingNumber;
        const foundBooking = await booking.findOne({ bookingNo: bookingNumber });

        if (foundBooking) {
            res.render('display-booking', { booking: foundBooking });
        } else {
            res.render('report-bookings');
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submit-help-request', async (req, res) => {
    try {
        const helpNumber = generateBookingNumber();

        const newHelp = new helprequest({
            helpNo: helpNumber,
            fullName: req.body.fullName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            details: req.body.details,
        });

        await newHelp.save();
        res.render('submit-help-request', { helpRequest: newHelp });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); });