'use strict';

module.exports = {
    app: {
        title: 'GREEN',
        description: 'Sequelize, Express and Node.js',
        keywords: 'Techmaster, Sequelize, Express and Node.js'
    },
    admin_prefix: 'admin',
    date_format: 'd/m/Y',//'Y-m-d'
    number_format: {
        thousand:'.',
        decimal:',',
        length:2,
        header:'',
        footer:'$'
    },
    mailer_config: {
        service: 'Gmail',
        auth: {
            user: 'support@techmaster.vn',
            pass: 'aikido2015-'
        },
        mailer_from: "Techmaster <support@techmaster.vn>",
        mailer_to: "cuong@techmaster.vn"
    },
    pagination: {
        number_item: 20
    },
    port: process.env.PORT || 3000,
    templateEngine: 'nunjucks',
    sessionSecret: 'GREEN',
    sessionCollection: 'sessions',
    themes: 'default',
    default_editor:{
      ckeditor:{
          js:[
              'public/admin/plugins/ckeditor/ckeditor.js'
          ],
          css:[
              '/admin/plugins/ckeditor/ckeditor.js'
          ]
      },
        markdown:{
            js:[
                
            ],
            css:[

            ]
        }
    },
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css'
            ]

        }
    }
};