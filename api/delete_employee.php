<?php
// DELETE: Delete an employee record by ID
header('Content-Type: application/json');
require_once 'db_connect.php';

// Accept ID from GET request parameter or JSON body
$data = json_decode(file_get_contents('php://input'), true);
$id = $_GET['id'] ?? $data['id'] ?? '';

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "Employee ID required"]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM employees WHERE id = ?");
$stmt->bind_param("s", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Employee deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}
?>
