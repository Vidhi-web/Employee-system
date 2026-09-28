<?php
// Database Connection Setup
$host = "127.0.0.1";
$username = "root";
$password = "";
$database = "zakvid_hr";
$port = 3307;

// Create connection
$conn = new mysqli($host, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}
?>
