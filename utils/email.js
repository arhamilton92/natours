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
	SENDGRID_USERNAME,
	SENDGRID_PASSWORD
} = process.env;

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `Andrea Hamilton <${EMAIL_FROM}>`;
	}
	transport() {
		if (NODE_ENV === 'production') {
			return nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					user: SENDGRID_USERNAME,
					pass: SENDGRID_PASSWORD
				}
			})
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
		const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
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
	sendPasswordReset() {
		this.send('passwordReset', 'Your password reset token (valid for 10 minutes)')
	}
};