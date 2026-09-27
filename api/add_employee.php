<?php
// API Endpoint: Add Employee
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

// Accept both JSON payload and $_POST form-data
$inputRaw = file_get_contents('php://input');
$inputData = json_decode($inputRaw, true);

if (!is_array($inputData)) {
    $inputData = $_POST;
}

// Extract fields
$id = trim($inputData['id'] ?? '');
$fullName = trim($inputData['fullName'] ?? '');
$email = trim($inputData['email'] ?? '');
$phone = trim($inputData['phone'] ?? '');
$location = trim($inputData['location'] ?? 'Bengaluru');
$department = trim($inputData['department'] ?? '');
$designation = trim($inputData['designation'] ?? '');
$salary = $inputData['salary'] ?? 0;
$joiningDate = trim($inputData['joiningDate'] ?? '');
$workMode = trim($inputData['workMode'] ?? 'Remote');
$status = trim($inputData['status'] ?? 'Active');
$avatarColor = trim($inputData['avatarColor'] ?? 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)');
$skills = $inputData['skills'] ?? [];

// Server-side validation
if (empty($id) || empty($fullName) || empty($email) || empty($department) || empty($designation) || empty($joiningDate)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email address format."]);
    exit();
}

if (!is_numeric($salary) || (float)$salary <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Salary must be a positive number."]);
    exit();
}

// Process skills into JSON string for DB storage
if (is_array($skills)) {
    $skillsStr = json_encode(array_values($skills));
} else {
    $skillsArr = array_values(array_filter(array_map('trim', explode(',', (string)$skills))));
    $skillsStr = json_encode($skillsArr);
}

// Check if Employee ID already exists
$checkStmt = $conn->prepare("SELECT id FROM employees WHERE id = ?");
$checkStmt->bind_param("s", $id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
if ($checkResult->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Employee ID '$id' already exists."]);
    $checkStmt->close();
    $conn->close();
    exit();
}
$checkStmt->close();

// Insert using Prepared Statement
$salaryInt = (int)$salary;
$stmt = $conn->prepare("INSERT INTO employees (id, fullName, email, phone, location, department, designation, salary, joiningDate, workMode, status, avatarColor, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("sssssssisssss", $id, $fullName, $email, $phone, $location, $department, $designation, $salaryInt, $joiningDate, $workMode, $status, $avatarColor, $skillsStr);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Employee registered successfully."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to insert employee: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
