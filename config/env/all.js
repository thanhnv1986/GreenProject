'use strict';

module.exports = {
	app: {
		title: 'SEN',
		description: 'Sequelize, Express and Node.js',
		keywords: 'Techmaster, Sequelize, Express and Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
    themes:'default',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css'
			]

		}
	}
};