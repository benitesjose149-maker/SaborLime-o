-- 1. Crear la Base de Datos
CREATE DATABASE SaborDB_2025;
GO

USE SaborDB_2025;
GO

-- 2. Tabla de Usuarios (Limpia y Moderna)
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100),
    apellido NVARCHAR(100),
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(MAX),
    provider NVARCHAR(50) DEFAULT 'local',
    phone NVARCHAR(20),
    address NVARCHAR(MAX),
    image NVARCHAR(MAX),
    emailVerified DATETIME,
    createdAt DATETIME DEFAULT GETDATE()
);

-- 3. Tabla de Cuentas (Para Login con Google)
CREATE TABLE Account (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    type NVARCHAR(255) NOT NULL,
    provider NVARCHAR(255) NOT NULL,
    providerAccountId NVARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INT,
    token_type NVARCHAR(255),
    scope NVARCHAR(255),
    id_token TEXT,
    session_state NVARCHAR(255),
    CONSTRAINT FK_Account_User FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- 4. Tabla de Sesiones
CREATE TABLE Session (
    id INT IDENTITY(1,1) PRIMARY KEY,
    sessionToken NVARCHAR(255) UNIQUE NOT NULL,
    userId INT NOT NULL,
    expires DATETIME NOT NULL,
    CONSTRAINT FK_Session_User FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- 5. Tabla de Tokens de Verificación (Para Restablecer Clave)
CREATE TABLE VerificationToken (
    identifier NVARCHAR(255) NOT NULL,
    token NVARCHAR(255) UNIQUE NOT NULL,
    expires DATETIME NOT NULL,
    PRIMARY KEY (identifier, token)
);
GO
