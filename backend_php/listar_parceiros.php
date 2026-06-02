<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require 'db.php';
$stmt = $pdo->query('SELECT * FROM parceiro ORDER BY nome ASC');
echo json_encode(['status'=>'sucesso','parceiros'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
