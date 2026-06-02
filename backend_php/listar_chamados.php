<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require 'db.php';
$sql = "SELECT c.*, u.nome AS nome_usuario, u.telefone AS telefone_usuario, u.email AS email_usuario
        FROM chamado c
        INNER JOIN usuario u ON u.id_usuario = c.id_usuario
        ORDER BY c.data_chamado DESC";
$stmt = $pdo->query($sql);
echo json_encode(['status'=>'sucesso','chamados'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
