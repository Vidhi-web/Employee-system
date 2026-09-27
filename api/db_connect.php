<?php
// Database Connection Configuration for ZAKVID HR System
$host = "127.0.0.1";
$username = "root";
$password = "";
$database = "zakvid_hr";
$port = 3307;

// Create MySQLi Connection
$conn = new mysqli($host, $username, $password, $database, $port);

// Check Connection
if ($conn->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        "success" => false,
        "message" => "Database Connection Failed: " . $conn->connect_error
    ]);
    exit();
}

// Set Character Set to UTF-8
$conn->set_charset("utf8mb4");
?>
