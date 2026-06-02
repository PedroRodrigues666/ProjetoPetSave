<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$nome = trim($data['nome'] ?? '');
$email = trim($data['email'] ?? '');
$senha = $data['senha'] ?? '';
$telefone = trim($data['telefone'] ?? '');
$tipo_usuario = $data['tipo_usuario'] ?? 'pessoal';
$endereco = trim($data['endereco'] ?? '');
if (!$nome || !$email || !$senha || !$telefone || !in_array($tipo_usuario, ['pessoal','empresa'])) {
  http_response_code(400); echo json_encode(['status'=>'erro','msg'=>'Preencha nome, email, senha, telefone e tipo_usuario.']); exit;
}
try {
  $hash = password_hash($senha, PASSWORD_DEFAULT);
  $stmt = $pdo->prepare('INSERT INTO usuario (nome,email,senha,telefone,tipo_usuario,endereco) VALUES (?,?,?,?,?,?)');
  $stmt->execute([$nome,$email,$hash,$telefone,$tipo_usuario,$endereco]);
  echo json_encode(['status'=>'sucesso','msg'=>'Usuário cadastrado.']);
} catch (PDOException $e) {
  http_response_code(400); echo json_encode(['status'=>'erro','msg'=>'Erro ao cadastrar: '.$e->getMessage()]);
}
