CREATE DATABASE IF NOT EXISTS carmel
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE carmel;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rol_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_roles FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imagen_url VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_productos_categorias FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS carrito (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_carrito_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS items_carrito (
  id INT AUTO_INCREMENT PRIMARY KEY,
  carrito_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  UNIQUE KEY uq_carrito_producto (carrito_id, producto_id),
  CONSTRAINT fk_items_carrito_carrito FOREIGN KEY (carrito_id) REFERENCES carrito(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_carrito_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ordenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  total DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ordenes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS items_orden (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orden_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_items_orden_orden FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_orden_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

INSERT IGNORE INTO roles (id, nombre) VALUES
(1, 'cliente'),
(2, 'administrador');

INSERT IGNORE INTO categorias (id, nombre, descripcion) VALUES
(1, 'Miel', 'Miel y productos apícolas'),
(2, 'Dulce de leche', 'Dulce de leche artesanal');
