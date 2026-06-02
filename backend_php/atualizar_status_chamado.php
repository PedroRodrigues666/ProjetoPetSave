<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$id_chamado = $data['id_chamado'] ?? null;
$id_usuario = $data['id_usuario'] ?? null;
$status = $data['status_chamado'] ?? 'resolvido';
if (!$id_chamado || !$id_usuario || !in_array($status, ['aberto','resolvido'])) {
  http_response_code(400); echo json_encode(['status'=>'erro','msg'=>'Dados inválidos.']); exit;
}
$stmt = $pdo->prepare('UPDATE chamado SET status_chamado = ? WHERE id_chamado = ? AND id_usuario = ?');
$stmt->execute([$status, $id_chamado, $id_usuario]);
if ($stmt->rowCount() === 0) { http_response_code(403); echo json_encode(['status'=>'erro','msg'=>'Chamado não encontrado ou não pertence ao usuário.']); exit; }
echo json_encode(['status'=>'sucesso','msg'=>'Status atualizado.']);
