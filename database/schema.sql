-- Employee Management System Database Schema
-- Database Name: zakvid_hr

CREATE DATABASE IF NOT EXISTS `zakvid_hr`;
USE `zakvid_hr`;

-- Drop table if exists to allow clean re-importing
DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `fullName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `salary` INT NOT NULL,
  `joiningDate` DATE NOT NULL,
  `workMode` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `avatarColor` VARCHAR(255) DEFAULT NULL,
  `skills` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data (Matching sample-data.js)
INSERT INTO `employees` (`id`, `fullName`, `email`, `phone`, `location`, `department`, `designation`, `salary`, `joiningDate`, `workMode`, `status`, `avatarColor`, `skills`) VALUES
('ZAK-1001', 'Aarav Sharma', 'aarav.sharma@zakvid.in', '+91 98765 43210', 'Bengaluru', 'Engineering', 'Lead Frontend Architect', 1850000, '2021-03-15', 'Remote', 'Active', 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)', '["React", "TypeScript", "Node.js", "System Design"]'),
('ZAK-1002', 'Ananya Patel', 'ananya.patel@zakvid.in', '+91 98123 45678', 'Mumbai', 'Design', 'Principal Product Designer', 1620000, '2020-11-10', 'Hybrid', 'Active', 'linear-gradient(135deg, #c084fc 0%, #ec4899 100%)', '["Figma", "Design Systems", "UX Research", "Motion"]'),
('ZAK-1003', 'Rohan Verma', 'rohan.verma@zakvid.in', '+91 97654 32109', 'Gurgaon', 'Finance', 'Financial Controller', 1500000, '2022-06-01', 'On-site', 'Active', 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', '["Corporate Finance", "Taxation", "Financial Modeling"]'),
('ZAK-1004', 'Priyansh Gupta', 'priyansh.gupta@zakvid.in', '+91 99887 76655', 'Hyderabad', 'Engineering', 'Cloud DevOps Architect', 1980000, '2023-01-09', 'Remote', 'Active', 'linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)', '["AWS", "Kubernetes", "Docker", "Terraform"]'),
('ZAK-1005', 'Kavya Reddy', 'kavya.reddy@zakvid.in', '+91 96543 21098', 'Hyderabad', 'HR', 'Talent Acquisition Lead', 1240000, '2021-07-05', 'Hybrid', 'Active', 'linear-gradient(135deg, #e879f9 0%, #a855f7 100%)', '["Tech Recruiting", "HR Operations", "People Analytics"]'),
('ZAK-1006', 'Vikramaditya Singh', 'vikram.singh@zakvid.in', '+91 95432 10987', 'Delhi NCR', 'Sales', 'Enterprise Growth Director', 1750000, '2019-08-22', 'On-site', 'On Leave', 'linear-gradient(135deg, #a855f7 0%, #818cf8 100%)', '["Enterprise B2B", "Key Accounts", "Revenue Strategy"]'),
('ZAK-1007', 'Ishaan Malhotra', 'ishaan.malhotra@zakvid.in', '+91 94321 09876', 'Pune', 'Marketing', 'Head of Growth Marketing', 1480000, '2022-09-18', 'Hybrid', 'Active', 'linear-gradient(135deg, #d946ef 0%, #c084fc 100%)', '["Growth Strategy", "Performance Ads", "Brand Scaling"]'),
('ZAK-1008', 'Meera Joshi', 'meera.joshi@zakvid.in', '+91 93210 98765', 'Bengaluru', 'Engineering', 'Fullstack Systems Developer', 1400000, '2024-02-12', 'Remote', 'Inactive', 'linear-gradient(135deg, #71717a 0%, #52525b 100%)', '["Python", "PostgreSQL", "GraphQL", "FastAPI"]');
