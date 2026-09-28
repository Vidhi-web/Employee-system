<?php
// UPDATE: Edit an existing employee record
header('Content-Type: application/json');
require_once 'db_connect.php';

// Read JSON data sent from frontend
$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? '';
$fullName = $data['fullName'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$location = $data['location'] ?? '';
$department = $data['department'] ?? '';
$designation = $data['designation'] ?? '';
$salary = (int)($data['salary'] ?? 0);
$joiningDate = $data['joiningDate'] ?? '';
$workMode = $data['workMode'] ?? '';
$status = $data['status'] ?? '';
$avatarColor = $data['avatarColor'] ?? '';
$skills = json_encode($data['skills'] ?? []);

// Update employee query
$sql = "UPDATE employees SET fullName=?, email=?, phone=?, location=?, department=?, designation=?, salary=?, joiningDate=?, workMode=?, status=?, avatarColor=?, skills=? WHERE id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssissssss", $fullName, $email, $phone, $location, $department, $designation, $salary, $joiningDate, $workMode, $status, $avatarColor, $skills, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Employee updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}
?>
