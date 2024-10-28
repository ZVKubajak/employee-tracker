import inquirer from "inquirer";
import { pool } from "./connection";

export const viewEmployees = async () => {
  const query = "SELECT * FROM employee;";

  try {
    const result = await pool.query(query);
    console.table(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
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
      message: "Role Title:",
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
      console.log("Role not found. Please make sure the role name is correct.");
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
    console.error("Error adding employee.", error);
  }
};
