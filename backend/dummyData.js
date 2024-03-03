const connection = require('./database');

const insertDummyData = () => {
  for (let i = 1; i <= 10; i++) {
    const username = `user${i}`;
    const email = `user${i}@company.com`;
    const alias = `User${i} Name${i}`;
    const canSubmitCommand = Math.random() < 0.5 ? 0 : 1;

    const query = `INSERT INTO NAGIOS (cn, nagiosEmail, nagiosAlias, submitCommand) VALUES (?, ?, ?, ?)`;
    connection.query(query, [username, email, alias, canSubmitCommand], (err, results) => {
      if (err) {
        console.error('Error with loading dummy datas: ', err);
      } else {
        console.log(`Successfully inserted: username: ${username}, email: ${email}, alias: ${alias}, canSubmitCommand: ${canSubmitCommand}`);
      }
    });
  }
};

insertDummyData();

/*const connection = require('./database');

const insertDummyData = () => {
    for (let i = 1; i <= 30; i++){
        const userid = `user${i}`;
        const system1Email = `user${i}@company.com`;
        const system2Alias = `User${i} Name${i}`;
        const submitCommand = Math.random() < 0.5 ? 0 : 1;

        const query = `INSERT INTO nagios (cn, nagiosEmail, nagiosAlias, submitCommand) VALUES (?, ?, ?, ?)`;
        connection.query(query, [userid, system1Email, system2Alias, submitCommand], (err, results) => {
            if (err) {
                console.error('Error with loading dummy datas: ', err);
            }else {
                console.log(`Successful loading with dummy datas.`);
            }
        });
    }
};

insertDummyData();*/