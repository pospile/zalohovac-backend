var db = require(appRoot + "/modules/database.js");

var create_new_backup_job_for_device = function (cron_string, device_id, path) {
    db.GetDbEngine(function (db) {
        db.InsertInto("tbBackupJob", ["from", "cron_time", "location", "path"], [0, cron_string, device_id, path], function (data) {

        });
    });
};