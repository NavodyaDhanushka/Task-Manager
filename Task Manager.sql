CREATE DATABASE todo_db;

USE todo_db;

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false
);


select * from todos;

INSERT INTO todos (name, description, completed) 
VALUES 
('Buy groceries', 'Buy milk, eggs, and bread from the supermarket', false),
('Complete homework', 'Finish the math and science homework assignments', true),
('Call Mom', 'Check in with Mom to see how she is doing', false),
('Schedule dentist appointment', 'Book a routine checkup at the dentist', false),
('Read a book', 'Finish reading "The Alchemist" by Paulo Coelho', true),
('Clean the house', 'Vacuum the living room and dust the furniture', false),
('Water plants', 'Water all the indoor and outdoor plants', true),
('Plan a trip', 'Research destinations and make travel arrangements', false),
('Attend meeting', 'Join the team meeting at 10 AM via Zoom', true),
('Exercise', 'Complete a 30-minute workout session', false);

