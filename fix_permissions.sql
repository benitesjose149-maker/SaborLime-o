USE SaborDB_2025;
GO
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'sa')
BEGIN
    -- sa is usually a server principal, we map it to a user in the DB if needed
    -- but usually sa has access to everything. Let's make sure it's the owner.
    ALTER AUTHORIZATION ON DATABASE::SaborDB_2025 TO sa;
END
GO
-- Ensure the user can actually connect
ALTER DATABASE SaborDB_2025 SET ONLINE;
GO
