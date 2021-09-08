/** @format */

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } =
		process.env;
	const transporter = nodemailer.createTransport({
		host: EMAIL_HOST,
		port: EMAIL_PORT,
		auth: {
			user: EMAIL_USERNAME,
			pass: EMAIL_PASSWORD,
		},
	});
	const mailOptions = {
		from: 'Andrea Hamilton <arham@email.com>',
		to: options.email,
		subject: options.subject,
		text: options.text,
	};
	//
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
