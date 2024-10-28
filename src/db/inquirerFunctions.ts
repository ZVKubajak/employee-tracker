import inquirer from "inquirer";
import { pool } from "./connection";

// * View Table Functions * //

export const viewDepartments = async () => {
  const query = "SELECT * FROM department;";

  try {
    const result = await pool.query(query);
    console.table(result.rows);
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
};

export const viewRoles = async () => {
  const query = "SELECT * FROM role;";

  try {
    const result = await pool.query(query);
    console.table(result.rows);
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
};

export const viewEmployees = async () => {
  const query = "SELECT * FROM employee;";

  try {
    const result = await pool.query(query);
    console.table(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

// * Add Field Functions * //

export const addDepartment = async () => {
  const prompt = [
    {
      type: "input",
      name: "department_name",
      message: "Name of Department:",
      validate: (input: string) => {
        if (input.trim() === "") {
          return "Department name cannot be empty.";
        }
        return true;
      },
    },
  ];

  const answers = await inquirer.prompt(prompt);

  const query = `INSERT INTO department (name) VALUES ($1) RETURNING *;`;

  try {
    await pool.query(query, [answers.department_name]);

    console.log("Department added successfully!");
  } catch (error) {
    console.error("Error adding department:", error);
  }
};

export const addRole = async () => {
  const prompt = [
    {
      type: "input",
      name: "role_title",
      message: "Role Title:",
    },
    {
      type: "input",
      name: "salary",
      message: "Salary (number only):",
      validate: (input: string) => {
        const isValidNumber = /^[1-9]\d*$/.test(input);
        return isValidNumber || "Please enter a valid positive number.";
      },
    },
    {
      type: "input",
      name: "department_name",
      message: "Related Department Name:",
    },
  ];

  const answers = await inquirer.prompt(prompt);

  // ! departmentId ! //
  let departmentId;

  try {
    const departmentQuery = "SELECT id FROM department WHERE name = $1;";
    const departmentResult = await pool.query(departmentQuery, [
      answers.department_name,
    ]);

    if (departmentResult.rows.length > 0) {
      departmentId = departmentResult.rows[0].id;
    } else {
      console.log(
        "Department not found. Please make sure the department name is correct."
      );
      return;
    }
  } catch (error) {
    console.error(`Error fetching department ID:`, error);
    return;
  }

  const query = `
    INSERT INTO role (title, salary, department_id)
    VALUES ($1, $2, $3);
  `;

  try {
    await pool.query(query, [
      answers.role_title,
      Number(answers.salary),
      departmentId,
    ]);

    console.log("Role added successfully!");
  } catch (error) {
    console.error("Error adding role:", error);
  }
};

export const addEmployee = async () => {
  const prompt = [
    {
      type: "input",
      name: "first_name",
      message: "First Name:",
    },
    {
      type: "input",
      name: "last_name",
      message: "Last Name:",
    },
    {
      type: "input",
      name: "role_title",
      message: "Current Role Title:",
    },
    {
      type: "input",
      name: "manager_name",
      message: "Manager's Name (leave blank if N/A):",
    },
  ];

  const answers = await inquirer.prompt(prompt);

  // ! roleID ! //
  let roleId;

  try {
    const roleQuery = "SELECT id FROM role WHERE title = $1;";
    const roleResult = await pool.query(roleQuery, [answers.role_title]);

    if (roleResult.rows.length > 0) {
      roleId = roleResult.rows[0].id;
    } else {
      console.log(
        "Role not found. Please make sure the role title is correct."
      );
      return;
    }
  } catch (error) {
    console.error(`Error fetching role ID:`, error);
    return;
  }

  // ! managerId ! //
  let managerId = null;

  if (answers.manager_name) {
    try {
      const managerQuery =
        "SELECT id FROM employee WHERE first_name || '' '' || last_name = $1;";
      const managerResult = await pool.query(managerQuery, [
        answers.manager_name,
      ]);

      if (managerResult.rows.length > 0) {
        managerId = managerResult.rows[0].id;
      } else {
        console.log("Manager not found. Setting manager ID to null.");
      }
    } catch (error) {
      console.error("Error fetching manager ID:", error);
      return;
    }
  }

  const query = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ($1, $2, $3, $4);
  `;

  try {
    await pool.query(query, [
      answers.first_name,
      answers.last_name,
      roleId,
      managerId,
    ]);

    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

// * Update Employee Role * //

export const updateEmployeeRole = async () => {

}

// * End Interacction * //

export const endInteraction = async () => await pool.end();
