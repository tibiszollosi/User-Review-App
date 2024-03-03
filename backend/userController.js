const express = require('express');
const router = express.Router();
const connection = require('./database');


//megadja melyik API végponton, útvonalon kapja meg az adatbázisból lekérdezett adatokat
router.get('/getSelectedData', (req, res) => {
    const query = 'SELECT * FROM system1 LEFT JOIN (active_directory, system2, system3, results) ON (system1.cn = results.id_system1 AND active_directory.samAccountName = results.idAD AND system2.uid = results.id_system2 AND system3.uid_system3  = results.id_system3)';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error while querying: ', err);
            res.status(500).send('Error while querying');
        }else{
            const usersArray = results.map(row => ({
                userid_system1: row.cn,
                system1Alias: row.system1Alias,
                system1Email: row.system1Email,
                system1_description: row.description_system1,
                CanSubmitCommand: row.submitCommand,
                system1Groups: row.groups_system1,
                entryDN: row.entryDN,
                //SYSTEM2
                userid_sys2: row.uid,
                ntUserAccount_sys2: row.ntPrimaryUserAccount,
                status_sys2: row.system2_status,
                isSystem1User: row.system1_user,
                email_sys2: row.email_system2,
                //SYSTEM3
                userid_sys3: row.uid_system3,
                ntUserAccount_sys3: row.ntPrimaryUserAccount_system3,
                status_sys3: row.system3_status,
                isSystem1User_sys3: row.system1_user_system3,
                email_sys3: row.email_system3,
                //ACTIVE DIRECTORY
                userid_AD: row.samAccountName,
                //domain_AD: row.domain,
                status_AD: row.ad_status,
                displayName_AD: row.displayName_AD,
                email_AD: row.email_AD,
                description_AD: row.description_AD,                
            }));
            res.json(usersArray);
        }
    });
});

//kijelentkezés és bejelentkezés kezelése, session adatok beállítása bejelentkezés esetén
router.get('/login', (req, res) => {
    req.session.isLoggedIn = true;
    req.session.username = 'username';
    

    res.json({ message: 'Logged in successfully' });
});

router.get('/logout', (req, res) => {
    req.session.isLoggedIn = false;
    req.session.username = null;
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;