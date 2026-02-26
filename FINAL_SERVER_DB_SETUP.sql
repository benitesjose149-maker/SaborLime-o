-- ==========================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS PARA SABOR LIMEÑO
-- COMPATIBLE CON EL BACKEND ACTUAL (PRISMA)
-- SERVIDOR: SQL SERVER
-- ==========================================================

-- 1. Eliminar tablas si existen (en orden inverso de dependencia)
IF OBJECT_ID('dbo.ORDER_ITEMS', 'U') IS NOT NULL DROP TABLE dbo.ORDER_ITEMS;
IF OBJECT_ID('dbo.ORDERS', 'U') IS NOT NULL DROP TABLE dbo.ORDERS;
IF OBJECT_ID('dbo.Session', 'U') IS NOT NULL DROP TABLE dbo.Session;
IF OBJECT_ID('dbo.Account', 'U') IS NOT NULL DROP TABLE dbo.Account;
IF OBJECT_ID('dbo.VerificationToken', 'U') IS NOT NULL DROP TABLE dbo.VerificationToken;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;

-- 2. Crear Tabla de Usuarios
CREATE TABLE [dbo].[Users] (
    [id]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [name]          NVARCHAR(255) NULL,
    [apellido]      NVARCHAR(255) NULL,
    [email]         NVARCHAR(255) NULL UNIQUE,
    [password]      NVARCHAR(MAX) NULL,
    [provider]      NVARCHAR(50) DEFAULT 'local',
    [phone]         NVARCHAR(50) NULL,
    [address]       NVARCHAR(500) NULL,
    [image]         NVARCHAR(MAX) NULL,
    [emailVerified] DATETIME NULL,
    [createdAt]     DATETIME DEFAULT GETDATE() NOT NULL
);

-- 3. Crear Tabla de Cuentas (NextAuth)
CREATE TABLE [dbo].[Account] (
    [id]                INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [userId]            INT NOT NULL,
    [type]              NVARCHAR(255) NOT NULL,
    [provider]          NVARCHAR(255) NOT NULL,
    [providerAccountId] NVARCHAR(255) NOT NULL,
    [refresh_token]     NVARCHAR(MAX) NULL,
    [access_token]      NVARCHAR(MAX) NULL,
    [expires_at]        INT NULL,
    [token_type]        NVARCHAR(255) NULL,
    [scope]             NVARCHAR(MAX) NULL,
    [id_token]          NVARCHAR(MAX) NULL,
    [session_state]     NVARCHAR(MAX) NULL,
    CONSTRAINT [FK_Account_Users] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users] ([id]) ON DELETE CASCADE,
    CONSTRAINT [Account_provider_providerAccountId_key] UNIQUE ([provider], [providerAccountId])
);

-- 4. Crear Tabla de Sesiones (NextAuth)
CREATE TABLE [dbo].[Session] (
    [id]           INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [sessionToken] NVARCHAR(255) NOT NULL UNIQUE,
    [userId]       INT NOT NULL,
    [expires]      DATETIME NOT NULL,
    CONSTRAINT [FK_Session_Users] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users] ([id]) ON DELETE CASCADE
);

-- 5. Crear Tabla de Tokens de Verificación (NextAuth)
CREATE TABLE [dbo].[VerificationToken] (
    [identifier] NVARCHAR(255) NOT NULL,
    [token]      NVARCHAR(255) NOT NULL UNIQUE,
    [expires]    DATETIME NOT NULL,
    CONSTRAINT [VerificationToken_pkey] PRIMARY KEY ([identifier], [token])
);

-- 6. Crear Tabla de Pedidos (ORDERS)
CREATE TABLE [dbo].[ORDERS] (
    [ID]             INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [USER_ID]        INT NOT NULL,
    [TOTAL]          DECIMAL(10, 2) NOT NULL,
    [STATUS]         VARCHAR(20) DEFAULT 'PENDIENTE',
    [PAYMENT_METHOD] VARCHAR(50) DEFAULT 'YAPE' NOT NULL,
    [PAYMENT_PHONE]  VARCHAR(20) NULL,
    [APPROVAL_CODE]  VARCHAR(20) NULL,
    [ADDRESS]        VARCHAR(255) NULL,
    [PHONE]          VARCHAR(20) NULL,
    [CREATED_AT]     DATETIME DEFAULT GETDATE(),
    CONSTRAINT [FK_ORDERS_USERS] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[Users] ([id]) ON DELETE CASCADE
);

-- 7. Crear Tabla de Detalles del Pedido (ORDER_ITEMS)
CREATE TABLE [dbo].[ORDER_ITEMS] (
    [ID]         INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [ORDER_ID]   INT NOT NULL,
    [DISH_ID]    VARCHAR(50) NOT NULL,
    [DISH_NAME]  VARCHAR(100) NOT NULL,
    [PRICE]      DECIMAL(10, 2) NOT NULL,
    [QUANTITY]   INT NOT NULL,
    CONSTRAINT [FK_ITEMS_ORDERS] FOREIGN KEY ([ORDER_ID]) REFERENCES [dbo].[ORDERS] ([ID]) ON DELETE CASCADE
);

PRINT 'Base de datos de Sabor Limeño creada exitosamente.';
