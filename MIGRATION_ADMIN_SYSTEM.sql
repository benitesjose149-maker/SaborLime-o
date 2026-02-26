-- ==========================================================
-- SCRIPT DE MIGRACIÓN: SISTEMA DE ADMINISTRACIÓN
-- EJECUTAR EN TU SERVIDOR SQL (15.235.16.229)
-- ==========================================================

USE SaborDB_2025;
GO

-- 1. Añadir columna de rol a la tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'role')
BEGIN
    ALTER TABLE [dbo].[Users] ADD [role] NVARCHAR(50) DEFAULT 'USER' NOT NULL;
END
GO

-- 2. Asignar superpoderes de ADMINISTRADOR a tu correo
UPDATE [dbo].[Users] SET [role] = 'ADMIN' WHERE [email] = 'josebenitesmarcelo21@gmail.com';
GO

-- 3. Crear la tabla de Platos (Dishes) para la carta dinámica
IF OBJECT_ID('dbo.Dishes', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Dishes] (
        [id]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [name]          NVARCHAR(255) NOT NULL,
        [description]   NVARCHAR(MAX) NULL,
        [price]         DECIMAL(10, 2) NOT NULL,
        [category]      NVARCHAR(100) NOT NULL,
        [image]         NVARCHAR(MAX) NULL,
        [available]     BIT DEFAULT 1 NOT NULL,
        [createdAt]     DATETIME DEFAULT GETDATE() NOT NULL
    );
END
GO

-- 4. Insertar los platos actuales para que la web no se vea vacía al inicio
INSERT INTO [dbo].[Dishes] ([name], [description], [price], [category], [image])
VALUES 
('Causa Limeña', 'Masa de papa amarilla con ají amarillo y relleno de pollo.', 18.00, 'Entradas', 'https://images.unsplash.com/photo-1525059337994-6f2a1311b4d4?q=80&w=800&auto=format&fit=crop'),
('Papa a la Huancaína', 'Papas sancochadas bañadas en crema de ají amarillo y queso.', 15.00, 'Entradas', 'https://images.unsplash.com/photo-1613203102142-b0625a746561?q=80&w=800&auto=format&fit=crop'),
('Cebiche Clásico', 'Pescado fresco marinado en limón piurano y ají limo.', 32.00, 'Entradas', 'https://images.unsplash.com/photo-1534766329972-04463dc160d5?q=80&w=800&auto=format&fit=crop'),
('Lomo Saltado', 'Res salteada al wok con cebolla, tomate y papas.', 35.00, 'Platos de Fondo', '/images/loo.png'),
('Ají de Gallina', 'Pollo deshilachado en crema de ají amarillo.', 28.00, 'Platos de Fondo', '/images/aji.png'),
('Seco de Res', 'Carne guisada en culantro con frijoles y arroz.', 30.00, 'Platos de Fondo', 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'),
('Arroz con Pollo', 'Arroz verde con culantro, pollo y huancaína.', 26.00, 'Platos de Fondo', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop'),
('Chicha Morada', 'Bebida tradicional de maíz morado y frutas.', 8.00, 'Bebidas', 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?q=80&w=800&auto=format&fit=crop'),
('Inca Kola', 'Gaseosa nacional de 500ml.', 6.00, 'Bebidas', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop'),
('Limonada', 'Refrescante jugo de limón natural.', 7.00, 'Bebidas', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop');
GO

PRINT 'Migración del Sistema de Administración completada exitosamente.';
