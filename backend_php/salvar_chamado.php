<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
require 'db.php';
$id_usuario = $_POST['id_usuario'] ?? null;
$tipo = $_POST['tipo'] ?? '';
$especie = $_POST['especie'] ?? 'outro';
$observacoes = trim($_POST['observacoes'] ?? '');
$latitude = $_POST['latitude'] ?? null;
$longitude = $_POST['longitude'] ?? null;
if (!$id_usuario || !in_array($tipo, ['perdido','ferido']) || !in_array($especie, ['cachorro','gato','outro']) || !$observacoes) {
  http_response_code(400); echo json_encode(['status'=>'erro','msg'=>'Dados obrigatórios ausentes.']); exit;
}
$imagemPath = null;
if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
  $dir = __DIR__ . '/uploads';
  if (!is_dir($dir)) mkdir($dir, 0777, true);
  $ext = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION) ?: 'jpg';
  $name = 'uploads/chamado_' . time() . '_' . rand(1000,9999) . '.' . $ext;
  move_uploaded_file($_FILES['imagem']['tmp_name'], __DIR__ . '/' . $name);
  $imagemPath = $name;
}
$stmt = $pdo->prepare('INSERT INTO chamado (latitude, longitude, imagem, observacoes, tipo, especie, id_usuario) VALUES (?,?,?,?,?,?,?)');
$stmt->execute([$latitude, $longitude, $imagemPath, $observacoes, $tipo, $especie, $id_usuario]);
echo json_encode(['status'=>'sucesso','msg'=>'Chamado salvo.']);
