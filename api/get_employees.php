<?php
// API Endpoint: Get All Employees
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$query = "SELECT * FROM employees ORDER BY id ASC";
$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Query Error: " . $conn->error
    ]);
    exit();
}

$employees = [];

while ($row = $result->fetch_assoc()) {
    // Cast salary to integer
    $row['salary'] = (int)$row['salary'];

    // Convert skills to a PHP array so it becomes a JS array in JSON output
    $skillsRaw = $row['skills'] ?? '';
    if (!empty($skillsRaw)) {
        // Try decoding as JSON first
        $decoded = json_decode($skillsRaw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $row['skills'] = $decoded;
        } else {
            // Otherwise, split comma-separated string
            $row['skills'] = array_values(array_filter(array_map('trim', explode(',', $skillsRaw))));
        }
    } else {
        $row['skills'] = [];
    }

    $employees[] = $row;
}

echo json_encode($employees);
$conn->close();
?>
