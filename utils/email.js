/** @format */

const nodemailer = require('nodemailer');
const pug = require('pug')
const htmlToText = require('html-to-text')

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
	transport() {
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
	async send(template, subject) {
		const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject
		})
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html)
		};
		//
		await this.transport().sendMail(mailOptions)
		//
	}
	sendWelcome() {
		this.send('welcome', 'Welcome to Natours!')
	}
};