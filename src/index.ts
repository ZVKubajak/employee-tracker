import inquirer from "inquirer";
import { connectToDb } from "./db/connection";
import {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  endInteraction,
} from "./db/inquirerFunctions";

const interaction = async () => {
  const prompt = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee Role",
        "Exit",
      ],
    },
  ];

  const result = await inquirer.prompt(prompt);
  switch (result.action) {
    case "View All Departments":
      await viewDepartments();
      break;
    case "View All Roles":
      await viewRoles();
      break;
    case "View All Employees":
      await viewEmployees();
      break;
    case "Add A Department":
      await addDepartment();
      break;
    case "Add A Role":
      await addRole();
      break;
    case "Add An Employee":
      await addEmployee();
      break;
    case "Update An Employee Role":
      await updateEmployeeRole();
      break;
    case "Exit":
      await endInteraction();
      process.exit();
  }

  interaction();
};

const startApp = async () => {
  await connectToDb();
  interaction();
};

startApp();
