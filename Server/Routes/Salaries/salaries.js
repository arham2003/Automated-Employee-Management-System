import con from '../../utils/db.js';  // Import the MySQL connection



// Define the function to get employee names and salaries
export const getEmployeeSalaries = (req, res) => {
    const query = 'SELECT name, salary FROM employee'; // SQL query to get name and salary
    con.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results); // Send the results as JSON
    });
};

export const paySalary = (req, res) => {
    const { empName, salary, bonus, salaryDate, status } = req.body;

    if (!empName || !salary || !salaryDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // SQL query to insert into the payments table
    const query = `
        INSERT INTO payments (empid, salary, bonus, payment_date, status)
        SELECT e.id, ?, ?, ?, ? 
        FROM employee e 
        WHERE e.name = ?
    `;

    con.query(query, [salary, bonus, salaryDate, status, empName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Salary data submitted successfully!' });
    });
};


export const getPayments = (req, res) => {
    const query = 'SELECT payment_id, empid, salary, bonus, payment_date, status FROM payments';
    
    con.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results); // Send the results as JSON
    });
};

export const checkPaymentStatus = (req, res) => {
    const { empName, salaryDate } = req.query;
  
    // SQL query to check if the payment is already made for the employee and month
    const query = `
      SELECT status 
      FROM payments
      JOIN employee ON payments.empid = employee.id  -- Updated column name
      WHERE employee.name = ? AND payments.payment_date = ?;
    `;
  
    con.query(query, [empName, salaryDate], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (results.length > 0 && results[0].status === 'Paid') {
        return res.status(200).json({ paid: true });
      }
  
      return res.status(200).json({ paid: false });
    });
  };

  export const getEmployeePayments = (req, res) => {
    const { month, year } = req.query;  // Extract month and year from query parameters

    // SQL query to get employee payments for the selected month and year
    const query = `
        SELECT 
            payments.payment_id,
            employee.name AS employee_name,
            payments.salary,
            payments.bonus,
            payments.payment_date,
            payments.status
        FROM 
            payments
        JOIN 
            employee 
        ON 
            payments.empid = employee.id
        WHERE 
            DATE_FORMAT(STR_TO_DATE(CONCAT('01/', payments.payment_date), '%d/%m/%Y'), '%M') = ? 
        AND 
            DATE_FORMAT(STR_TO_DATE(CONCAT('01/', payments.payment_date), '%d/%m/%Y'), '%Y') = ?;
    `;

    con.query(query, [month, year], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results); // Send the results as JSON
    });
};

export const updateEmployeeBonus = (req, res) => {
    const { employeeId, month, year } = req.body;

    // Check if required parameters are present
    if (!employeeId || !month || !year) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Format the month and year into MM/YYYY format
    const paymentDate = `${('0' + (new Date(`1 ${month} ${year}`).getMonth() + 1)).slice(-2)}/${year}`;

    // Update the query to match the MM/YYYY format for payment_date
    const updateBonusQuery = `
        UPDATE payments
        SET bonus = bonus + 50
        WHERE empid = ? AND payment_date = ?
    `;

    // Execute the query with employeeId and paymentDate in MM/YYYY format
    con.query(updateBonusQuery, [employeeId, paymentDate], (err, result) => {
        if (err) {
            console.error("Error updating bonus:", err);  // Log the error for debugging
            return res.status(500).json({ message: "Error updating bonus", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Employee or record not found" });
        }

        return res.status(200).json({ message: "Bonus updated successfully", result });
    });
};

export const deletePayment = (req, res) => {
    const { paymentId } = req.params;  // Extract payment_id from the URL params

    // SQL query to delete the record by payment_id
    const query = 'DELETE FROM payments WHERE payment_id = ?';

    // Execute the query
    con.query(query, [paymentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });  // Send error if query fails
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment record not found' }); // If no record was deleted
        }
        res.status(200).json({ message: 'Payment record deleted successfully' });  // Success message
    });
};

export const updatePayment = (req, res) => {
    const { empName, salary, bonus, status } = req.body; // Getting data from the request body
    const payment_id = req.body.payment_id; // Assuming `payment_id` is being sent in the request body along with other details

    // SQL query to update the salary record
    const query = `UPDATE payments 
                   SET salary = ?, bonus = ?, status = ? 
                   WHERE payment_id = ?`;

    // Execute the query
    con.query(query, [salary, bonus, status, payment_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Check if any record was affected (meaning the update was successful)
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Payment record for ${empName} updated successfully` });
        } else {
            return res.status(404).json({ message: 'Payment record not found' });
        }
    });
};