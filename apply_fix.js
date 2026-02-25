const { Connection, Request } = require('tedious');
require('dotenv').config();

const config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: 'sql'
        }
    },
    options: {
        port: 1433,
        database: 'master', // Start in master to fix other DBs
        encrypt: true,
        trustServerCertificate: true
    }
};

const connection = new Connection(config);

connection.on('connect', (err) => {
    if (err) {
        console.error('❌ Error connecting to master:', err.message);
        return;
    }
    console.log('✅ Connected to master. Applying authorization fix...');

    // Set sa as owner of SaborDB_2025
    const sql = `
        ALTER AUTHORIZATION ON DATABASE::SaborDB_2025 TO sa;
        ALTER DATABASE SaborDB_2025 SET ONLINE;
    `;

    const request = new Request(sql, (err) => {
        if (err) {
            console.error('❌ Fix Error:', err.message);
        } else {
            console.log('🚀 SUCCESS: "sa" is now authorized correctly for SaborDB_2025.');
        }
        connection.close();
    });

    connection.execSql(request);
});

connection.connect();
