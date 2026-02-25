const { Connection, Request } = require('tedious');
require('dotenv').config();

const url = process.env.DATABASE_URL;
// Parse: sqlserver://localhost:1433;database=SaborDB_2025;user=sa;password=sql;encrypt=true;trustServerCertificate=true;
const server = 'localhost';
const port = 1433;
const database = 'SaborDB_2025';
const user = 'sa';
const password = 'sql';

const config = {
    server: server,
    authentication: {
        type: 'default',
        options: {
            userName: user,
            password: password
        }
    },
    options: {
        port: port,
        database: database,
        encrypt: true,
        trustServerCertificate: true
    }
};

const connection = new Connection(config);

connection.on('connect', (err) => {
    if (err) {
        console.error('❌ Connection Error:', err.message);
        if (err.message.includes('4060')) {
            console.log('💡 TIP: The database exists but "sa" cannot open it. Trying to connect to "master" instead...');
            testMaster();
        }
        return;
    }
    console.log('✅ Connected successfully to', database);
    connection.close();
});

function testMaster() {
    const masterConfig = { ...config, options: { ...config.options, database: 'master' } };
    const masterConn = new Connection(masterConfig);
    masterConn.on('connect', (err) => {
        if (err) {
            console.error('❌ Master Connection Error:', err.message);
            return;
        }
        console.log('✅ Connected to "master". Querying databases...');
        const request = new Request("SELECT name FROM sys.databases", (err) => {
            if (err) console.error(err);
            masterConn.close();
        });
        request.on('row', (columns) => {
            console.log('Found DB:', columns[0].value);
        });
        masterConn.execSql(request);
    });
    masterConn.connect();
}

connection.connect();
