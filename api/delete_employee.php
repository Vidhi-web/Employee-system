<?php
// API Endpoint: Delete Employee
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

// Accept GET parameter or POST (JSON or form data)
$id = $_GET['id'] ?? null;

if (!$id) {
    $inputRaw = file_get_contents('php://input');
    $inputData = json_decode($inputRaw, true);
    if (is_array($inputData) && !empty($inputData['id'])) {
        $id = $inputData['id'];
    } else if (!empty($_POST['id'])) {
        $id = $_POST['id'];
    }
}

$id = trim((string)$id);

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Employee ID is required."]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM employees WHERE id = ?");
$stmt->bind_param("s", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Employee '$id' deleted successfully."
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "No employee found with ID '$id'."
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to delete employee: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
