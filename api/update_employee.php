<?php
// API Endpoint: Update Employee
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

// Accept both JSON payload and $_POST form-data
$inputRaw = file_get_contents('php://input');
$inputData = json_decode($inputRaw, true);

if (!is_array($inputData)) {
    $inputData = $_POST;
}

$id = trim($inputData['id'] ?? '');

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Employee ID is required."]);
    exit();
}

// Check if employee exists
$checkStmt = $conn->prepare("SELECT * FROM employees WHERE id = ?");
$checkStmt->bind_param("s", $id);
$checkStmt->execute();
$existingRes = $checkStmt->get_result();

if ($existingRes->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Employee not found."]);
    $checkStmt->close();
    $conn->close();
    exit();
}

$existing = $existingRes->fetch_assoc();
$checkStmt->close();

// Fallback to existing values if not provided in payload
$fullName = isset($inputData['fullName']) ? trim($inputData['fullName']) : $existing['fullName'];
$email = isset($inputData['email']) ? trim($inputData['email']) : $existing['email'];
$phone = isset($inputData['phone']) ? trim($inputData['phone']) : $existing['phone'];
$location = isset($inputData['location']) ? trim($inputData['location']) : $existing['location'];
$department = isset($inputData['department']) ? trim($inputData['department']) : $existing['department'];
$designation = isset($inputData['designation']) ? trim($inputData['designation']) : $existing['designation'];
$salary = isset($inputData['salary']) ? (int)$inputData['salary'] : (int)$existing['salary'];
$joiningDate = isset($inputData['joiningDate']) ? trim($inputData['joiningDate']) : $existing['joiningDate'];
$workMode = isset($inputData['workMode']) ? trim($inputData['workMode']) : $existing['workMode'];
$status = isset($inputData['status']) ? trim($inputData['status']) : $existing['status'];
$avatarColor = isset($inputData['avatarColor']) ? trim($inputData['avatarColor']) : $existing['avatarColor'];

if (isset($inputData['skills'])) {
    if (is_array($inputData['skills'])) {
        $skillsStr = json_encode(array_values($inputData['skills']));
    } else {
        $skillsArr = array_values(array_filter(array_map('trim', explode(',', (string)$inputData['skills']))));
        $skillsStr = json_encode($skillsArr);
    }
} else {
    $skillsStr = $existing['skills'];
}

// Validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email address format."]);
    exit();
}

if ($salary <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Salary must be a positive number."]);
    exit();
}

// Update Statement
$stmt = $conn->prepare("UPDATE employees SET fullName = ?, email = ?, phone = ?, location = ?, department = ?, designation = ?, salary = ?, joiningDate = ?, workMode = ?, status = ?, avatarColor = ?, skills = ? WHERE id = ?");

$stmt->bind_param("ssssssissssss", $fullName, $email, $phone, $location, $department, $designation, $salary, $joiningDate, $workMode, $status, $avatarColor, $skillsStr, $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Employee updated successfully."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to update employee: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
