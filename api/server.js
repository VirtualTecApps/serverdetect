// server.js
const express = require('express');
const zlib = require('zlib');
const multer = require('multer');

const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
const corsOptions = {
    origin: ['http://localhost:3000','https://detect.visionguard.app'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'], // Puedes agregar más dominios en un array si es necesario
    optionsSuccessStatus: 200
};
app.options('*', cors(corsOptions)); // Preflight requests
app.use(cors(corsOptions));
/*const mail = {
    user:process.env.GMAIL_USER,
    pass: process.env.NODEMAILER_PASS
}*/

const mail = {
    user:"correovirtualtec@gmail.com",
    pass: "lurcdonjdasyvtvn"
}

// Configura el transporte de correo
app.use(bodyParser.json({ limit: '100mb' })); // Ajusta el límite según sea necesario
const storage = multer.memoryStorage(); // Almacena archivos en memoria
const upload = multer({ storage: storage });
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: mail.user,
      pass:mail.pass,
    },
  });
  
// Ruta para enviar correos
app.post('/send-email',upload.single('image'), (req, res) => {
    const { from, to, subject, text } = req.body;
   // const imageFile = req.file; // Información del archivo cargado
   const image = req.file;
 /*   console.log('From:', from);
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    console.log(("IMAGE: ", image));
*/
    
    
   // console.log('Image File:', imageFile);
    
    const mailOptions = {
        from: mail.user,
        to,
        subject,
        text,
        attachments: [
            {
                filename: image.originalname,
                content: image.buffer,
                encoding: 'base64'
            }
        ]
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            //console.log(error);
            
            return res.status(500).send(error.toString());
        }
        res.status(203).send('Email sent: ' + info.response);
    });
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
