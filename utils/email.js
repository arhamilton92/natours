/** @format */

const nodemailer = require('nodemailer');
const pug = require('pug')

const {
	EMAIL_FROM,
	EMAIL_HOST,
	EMAIL_PORT,
	EMAIL_USERNAME,
	EMAIL_PASSWORD,
	NODE_ENV,
} = process.env;

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstname = user.name.split(' ')[0];
		this.url = url;
		this.from = `Andrea Hamilton <${EMAIL_FROM}>`;
	}

	createTransport() {
		if (NODE_ENV === 'production') {
			// sendgrid
			return 1;
		}

		return nodemailer.createTransport({
			host: EMAIL_HOST,
			port: EMAIL_PORT,
			auth: {
				user: EMAIL_USERNAME,
				pass: EMAIL_PASSWORD,
			},
		});
	}

	send(template, subject) {
		// render HTML with pug
		const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`)
		
		// define email options
		const mailOptions = {
			from: `Andrea Hamilton ${EMAIL_FROM}`,
			to: options.email,
			subject: options.subject,
			text: options.text,
			html
		};

	sendWelcome() {
		this.send('welcome', 'Welcome to Natours!')
	}
};

const sendEmail = async (options) => {
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
}; // ---------------------------------

module.exports = sendEmail;
