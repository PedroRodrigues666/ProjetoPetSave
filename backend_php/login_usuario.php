<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email = trim($data['email'] ?? '');
$senha = $data['senha'] ?? '';
$stmt = $pdo->prepare('SELECT * FROM usuario WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$usuario || !(password_verify($senha, $usuario['senha']) || $senha === $usuario['senha'])) {
  http_response_code(401); echo json_encode(['status'=>'erro','msg'=>'E-mail ou senha inválidos.']); exit;
}
unset($usuario['senha']);
echo json_encode(['status'=>'sucesso','usuario'=>$usuario]);
