<?php
// READ: Fetch all employee records from database
header('Content-Type: application/json');
require_once 'db_connect.php';

// Query to get all employees
$result = $conn->query("SELECT * FROM employees ORDER BY id ASC");
$employees = [];

// Fetch each row and format values
while ($row = $result->fetch_assoc()) {
    $row['salary'] = (int)$row['salary'];
    $row['skills'] = !empty($row['skills']) ? json_decode($row['skills'], true) : [];
    $employees[] = $row;
}

// Return data as JSON
echo json_encode($employees);
?>
