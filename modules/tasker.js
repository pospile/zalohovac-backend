var db = require(appRoot + "/modules/database.js");
var cron = require("cron");
var CronJob = require('cron').CronJob;

console.log("Starting tasker module for Zalohovac.");
console.log("Searching for all tasks and preparing them for execution");

db.GetDbEngine(function (db) {
    db.SelectFrom("tbBackupJob", "*", null,null,function (data) {
        console.log(data.length);
        for (var i = 0; i < data.length; i++)
        {
            console.log("Obnovuji cron job #" + i);

            check_cron(data[i].cron_time, function (run, error) {
                if (run)
                {
                    try {
                        var CronJob = require('cron').CronJob;
                        var job = new CronJob({
                            cronTime: data[i].cron_time,
                            onTick: function() {
                                //console.log("Job #"+i + " probiha");

                            },
                            start: true
                        });
                        job.start();
                        console.log("job running?" + job.running);
                    } catch(ex) {
                        console.log("invalid cron: " + ex)
                        callback(false, "invalid cron: " + ex);
                    }
                }
                else
                {
                    console.log("Invalid cron time:"+ data[i].cron_time +" at job #" + data[i].id);
                    console.log("Error:" + error);
                }
            });

        }
    });
});


var check_cron = function (cron_string, callback) {
    console.log("Kontroluji cron-job.")
    callback(true, "valid");
};