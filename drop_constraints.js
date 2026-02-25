const { Connection, Request } = require("tedious");
require("dotenv/config");

const connectionString = process.env.DATABASE_URL;

// Simple manual parsing for SQL Server connection string
const serverMatch = connectionString.match(/\/\/([^:;]+)/);
const portMatch = connectionString.match(/:(\d+);/);
const dbMatch = connectionString.match(/database=([^;]+)/);
const userMatch = connectionString.match(/user=([^;]+)/);
const passMatch = connectionString.match(/password=([^;]+)/);

const server = serverMatch?.[1] || "127.0.0.1";
const port = portMatch ? parseInt(portMatch[1]) : 1433;
const database = dbMatch?.[1] || "SaborDB_2025";
const user = userMatch?.[1] || "sa";
const password = passMatch?.[1] || "sql";

const config = {
    server: server,
    authentication: {
        type: "default",
        options: {
            userName: user,
            password: password,
        },
    },
    options: {
        encrypt: true,
        database: database,
        trustServerCertificate: true,
        port: port,
    },
};

const connection = new Connection(config);

connection.on("connect", (err) => {
    if (err) {
        console.error("Connection error:", err);
        process.exit(1);
    } else {
        console.log("Connected to SQL Server");
        dropConstraints();
    }
});

function dropConstraints() {
    // SQL to find and drop default constraints on Users table
    const sql = `
    DECLARE @stmt NVARCHAR(MAX) = '';
    SELECT @stmt += 'ALTER TABLE ' + QUOTENAME(t.name) + ' DROP CONSTRAINT ' + QUOTENAME(d.name) + ';'
    FROM sys.default_constraints d
    INNER JOIN sys.tables t ON d.parent_object_id = t.object_id
    WHERE t.name = 'Users';
    
    PRINT @stmt;
    EXEC sp_executesql @stmt;
  `;

    const request = new Request(sql, (err) => {
        if (err) {
            console.error("Error dropping constraints:", err);
        } else {
            console.log("Constraints dropped successfully");
        }
        connection.close();
    });

    request.on("infoMessage", (info) => {
        console.log("SQL Info:", info.message);
    });

    connection.execSql(request);
}

connection.connect();
