CREATE DATABASE IF NOT EXISTS petsave;
USE petsave;

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    tipo_usuario ENUM('pessoal', 'empresa') NOT NULL,
    endereco VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS chamado (
    id_chamado INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    imagem VARCHAR(255),
    data_chamado DATETIME DEFAULT CURRENT_TIMESTAMP,
    observacoes VARCHAR(255),
    tipo ENUM('perdido', 'ferido') NOT NULL,
    especie ENUM('cachorro', 'gato', 'outro'),
    status_chamado ENUM('aberto', 'resolvido') DEFAULT 'aberto',
    id_usuario INT NOT NULL,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS parceiro (
    id_parceiro INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255),
    endereco VARCHAR(255),
    descricao VARCHAR(255),
    tipo ENUM('ong', 'clinica', 'empresa', 'protetor') DEFAULT 'ong',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status ENUM('aberto', 'fechado') DEFAULT 'aberto'
);

INSERT INTO parceiro (nome, telefone, email, endereco, descricao, tipo, latitude, longitude, status) VALUES
('ONG Amigos dos Animais', '(11) 91234-5678', 'contato@amigosanimais.org', 'Rua das Acácias, 789', 'Resgate, tratamento e adoção de animais abandonados', 'ong', -23.55052000, -46.63330800, 'aberto'),
('Clínica Veterinária Pet Care', '(11) 98765-4321', 'atendimento@petcare.com.br', 'Av. dos Animais, 234', 'Atendimento especializado 24h, cirurgias e internação', 'clinica', -23.55600000, -46.63800000, 'aberto');
