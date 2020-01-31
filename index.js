// npm express body - parser  express - handlebars nodemailer
// npm install nodemon

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path')

const app = express();

// set view engine set-up
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')))

// body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact', { layout: false })
});

app.post('/send', (req, res) => {
    // console.log(req.body);
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact details</h3>
        <ul>    
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone Number: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
        `;

    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'switchdevice21@gmail.com', // generated ethereal user
                pass: 'between##1' // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Nodemailer Contact" <switchdevice21@gmail.com>', // sender address
            to: "emmanueliyanu2012@gmail.com", // list of receivers
            subject: "Node Contact Request ✔", // Subject line
            text: "Hello world?", // plain text body
            html: output // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.render('contact', { layout: false })
    }

    main().catch(console.error);

})

app.listen(3000, () => {
    console.log(`server started on port 3000`)
})