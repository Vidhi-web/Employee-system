<?php
// CREATE: Add a new employee to the database
header('Content-Type: application/json');
require_once 'db_connect.php';

// Read JSON data sent from frontend
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data provided"]);
    exit();
}

$id = $data['id'] ?? '';
$fullName = $data['fullName'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$location = $data['location'] ?? 'Bengaluru';
$department = $data['department'] ?? '';
$designation = $data['designation'] ?? '';
$salary = (int)($data['salary'] ?? 0);
$joiningDate = $data['joiningDate'] ?? '';
$workMode = $data['workMode'] ?? 'Remote';
$status = $data['status'] ?? 'Active';
$avatarColor = $data['avatarColor'] ?? 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)';
$skills = json_encode($data['skills'] ?? []);

// Insert employee using prepared statement
$sql = "INSERT INTO employees (id, fullName, email, phone, location, department, designation, salary, joiningDate, workMode, status, avatarColor, skills) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssisssss", $id, $fullName, $email, $phone, $location, $department, $designation, $salary, $joiningDate, $workMode, $status, $avatarColor, $skills);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Employee registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}
?>
