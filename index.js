const Fs        = require('fs')
const Path      = require('path')
const Log       = require('./lib/logging');

var GITHUB_TOKEN    = process.env['GITHUB_TOKEN'];
var SLACK_BOT_TOKEN = process.env['REMINDER_TOKEN'];

// Validations

if(!GITHUB_TOKEN || GITHUB_TOKEN.length == 0){
  Log.error("GITHUB_TOKEN environment variable is not set")
  process.exit()
}

if(!SLACK_BOT_TOKEN || SLACK_BOT_TOKEN.length == 0){
  Log.error("SLACK_BOT_TOKEN environment variable is not set")
  process.exit()
}

var CONFIG_PATH     = process.env['CONFIG_PATH'] || './';
var regex           = new RegExp(process.env['REPOS_REGEX'] || '.*');
var interval        = parseFloat(process.env['INTERVAL']) || 2;
var organizations   = process.env['ORGANIZATIONS'];
var personal        = process.env['PERSONAL'];

personal = personal && personal.toLowerCase() === 'true' ? true : false;
organizations = organizations && organizations.length > 0 ? organizations.split(',') : [];

var slackGithubUsersMappings = JSON.parse(Fs.readFileSync(Path.join(CONFIG_PATH, 'mappings.json')));
var slackIdUsernameMappings = JSON.parse(Fs.readFileSync(Path.join(CONFIG_PATH, 'users.json')));

const Github   = new (require('./lib/github'))({
    token: GITHUB_TOKEN,
    regex: regex,
    organizations: organizations,
    personal: personal
}, Log)

const Slack    = new(require('./lib/slack'))({
    token: SLACK_BOT_TOKEN,
    mappings: slackGithubUsersMappings
}, Log)



// function pollAndNotify(){
//     Github.getAllPending(function(err, pendings){
//         if(err)
//             Log.error("Error ", err);
//         else{
//             Object.keys(pendings).map(function(a){
//                 Slack.notify(a, pendings[a], function(err, done){});
//             });

//             setTimeout(pollAndNotify, interval * 60 * 60 * 1000);
//         }
//     });
// }

// pollAndNotify()


module.exports = {
    repeat: function(username) {
        console.log(username);

        // Github.getAllPending(function(err, pendings) {
        //     if(err)
        //         Log.error("Error ", err);
        //     else{
        //         Object.keys(pendings).map(function(a){
        //             Slack.notify(a, pendings[a], function(err, done){});
        //         });
        //     }
        // });
    }
}
