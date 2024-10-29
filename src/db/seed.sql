INSERT INTO
  department (name)
VALUES
  ("Human Resources"),
  ("Development"),
  ("Customer Service"),
  ("Marketing");

INSERT INTO
  role (title, salary, department_id)
VALUES
  ("HR Manager", 60000, 1),
  ("Senior Developer", 100000, 2),
  ("Junior Developer", 80000, 2),
  ("Intern", 50000, 2),
  ("Head of Sales", 75000, 3),
  ("Sales Associate", 50000, 3),
  ("Marketing Specialist", 65000, 4);

INSERT INTO
  role (first_name, last_name, role_id, manager_id)
VALUES
  ("Frank", "Johnson", 1, NULL),
  ("Elliot", "Warden", 2, NULL),
  ("Kendrick", "Chase", 5, NULL),
  ("Mark", "Hamburger", 7, NULL),
  ("Josh", "Powell", 3, 2),
  ("Henry", "Sparcola", 3, 2),
  ("Billy", "Johnson", 3, 2)
  ("Joe", "Bob", 4, 2),
  ("Cory", "Barnes", 4, 2),
  ("Brock", "Gregson", 6, 3),
  ("Guy", "Smith", 6, 3);