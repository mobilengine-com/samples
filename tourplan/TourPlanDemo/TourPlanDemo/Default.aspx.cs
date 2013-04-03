using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data.SqlServerCe;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Data;
using System.Security.Cryptography.X509Certificates;
using TourPlanDemo.Coml;
using TourPlanDemo.Wdx;
using TourPlanDemo.Model;


namespace TourPlanDemo
{
    public partial class Default : System.Web.UI.Page
    {
        private SqlCeConnection _myCon;
        private List<int> _assignmentIdList = new List<int>();

        protected void Page_Load(object sender, EventArgs e)
        {
            _createAssignmentButton.Text = "1) Create\n" + "assignment";
            _calendarTextBox.Attributes.Add("readonly", "readonly");
            string conStr = ConfigurationManager.ConnectionStrings["tourplandemoConnectionString"].ConnectionString;
            _myCon = new SqlCeConnection(conStr);
            ShowTable();
            string lastUpdatedCommand = "SELECT last_date FROM last_updated";
            LabelDynamicItemAdd(lastUpdatedCommand, _lastUpdated);
            _distributeButton.Text = "3) Distribute\nnew\nassignments";
            _resultOk.Visible = false;
            _resultFailed.Visible = false;
        }

        protected void CreateAssignmentButtonClick(object sender, EventArgs e)
        {
            InitCreateAssignmentControls();
            AllAssignmentChangeProcedure();
        }

        protected void ClientSearchTextChanged(object sender, EventArgs e)
        {
            AllAssignmentChangeProcedure();
            string commandText = "SELECT company FROM place WHERE company LIKE '%" + _clientSearchTextBox.Text + "%' GROUP BY company ORDER BY company";
            DropDownDynamicItemsAdd(commandText, _clientSelectionDropDown);
            _citySelectionDropDown.Items.Clear();
        }

        protected void ClientSelected(object sender, EventArgs e)
        {
            AllAssignmentChangeProcedure();
            string commandText = "SELECT city FROM place WHERE company = '" + _clientSelectionDropDown.SelectedItem + "' GROUP BY city ORDER BY city";
            DropDownDynamicItemsAdd(commandText, _citySelectionDropDown);
        }

        protected void AssignmentCategorySelected(object sender, EventArgs e)
        {
            AllAssignmentChangeProcedure();
            _employeeSearchTextbox.Text = "";
            _employeeIdLabel.Text = "";
            string commandText = "SELECT employee FROM employee WHERE category = '" + _assignmentCategoryDropDown.SelectedItem + "' AND employee LIKE '%" + _employeeSearchTextbox.Text + "%' GROUP BY employee ORDER BY employee";
            DropDownDynamicItemsAdd(commandText, _employeeSelectionDropDown);
        }

        protected void EmployeeSearchTextChanged(object sender, EventArgs e)
        {
            AllAssignmentChangeProcedure();
            _employeeIdLabel.Text = "";
            string commandText = "SELECT employee FROM employee WHERE category = '" + _assignmentCategoryDropDown.SelectedItem + "' AND employee LIKE '%" + _employeeSearchTextbox.Text + "%' GROUP BY employee ORDER BY employee";
            DropDownDynamicItemsAdd(commandText, _employeeSelectionDropDown);
        }

        protected void EmployeeSelected(object sender, EventArgs e)
        {
            AllAssignmentChangeProcedure();
            string commandText = "SELECT usr FROM employee WHERE employee = '" + _employeeSelectionDropDown.SelectedItem + "' GROUP BY usr ORDER BY usr;";
            LabelDynamicItemAdd(commandText, _employeeIdLabel);
        }

        protected void SaveAssignment(object sender, EventArgs e)
        {
            if (_calendarTextBox.Text == "" || _clientSelectionDropDown.SelectedItem.ToString() == "" || _citySelectionDropDown.SelectedItem.ToString() == "" ||
                _priorityDropDown.SelectedItem.ToString() == "" || _employeeSelectionDropDown.SelectedItem.ToString() == "")
            {
                _valiatorMsg.Visible = true;
            }
            else
            {
                InsertAssignment();
                UpdateDate();
                string lastUpdatedCommand = "SELECT last_date FROM last_updated";
                LabelDynamicItemAdd(lastUpdatedCommand, _lastUpdated);
                _createAssignmentPanel.Visible = false;
                _distributeButton.Enabled = true;
                ShowTable();
            }
        }

        protected void DistributeAssignment(object sender, EventArgs e)
        {
            SendAssignments();
            if (_resultOk.Visible)
            {
                UpdateDate();
                DeleteOrdinary();
                AssignmentToPending();
                string lastUpdatedCommand = "SELECT last_date FROM last_updated";
                LabelDynamicItemAdd(lastUpdatedCommand, _lastUpdated);
                ShowTable();
            }
        }

        protected void AssignmentDelete(object sender, GridViewDeleteEventArgs e)
        {
            try
            {
                int assignmentId = _assignmentIdList[e.RowIndex];
                DeleteAssignment(assignmentId);
                UpdateDate();
            }
            finally
            {
                ShowTable();
                string lastUpdatedCommand = "SELECT last_date FROM last_updated";
                LabelDynamicItemAdd(lastUpdatedCommand, _lastUpdated);
            }
        }

        protected void RefreshTable(object sender, EventArgs e)
        {
            ShowTable();
            string lastUpdatedCommand = "SELECT last_date FROM last_updated";
            LabelDynamicItemAdd(lastUpdatedCommand, _lastUpdated);
        }

        private void InitCreateAssignmentControls()
        {
            _calendarTextBox.Text = "";
            _clientSearchTextBox.Text = "";
            _citySelectionDropDown.Items.Clear();
           // string companyCommandText = "SELECT '' UNION (SELECT company FROM place GROUP BY company ORDER BY company);";
            string companyCommandText = "SELECT company FROM place GROUP BY company ORDER BY company";
            DropDownDynamicItemsAdd(companyCommandText, _clientSelectionDropDown);
//            string assignmentCategoryCommandText = "SELECT '' UNION (SELECT category FROM employee GROUP BY category ORDER BY category);";
            string assignmentCategoryCommandText = "SELECT category FROM employee GROUP BY category ORDER BY category";
            DropDownDynamicItemsAdd(assignmentCategoryCommandText, _assignmentCategoryDropDown);
            _saveAssignmentButton.Text = "2) Save\nassignment";
            _assignmentTextBox.Text = "";
            _priorityDropDown.SelectedIndex = 0;
            _commentTextBox.Text = "";
            _employeeSearchTextbox.Text = "";
            _employeeSelectionDropDown.Items.Clear();
            _employeeIdLabel.Text = "";
            _valiatorMsg.Visible = false;
        }

        private void AllAssignmentChangeProcedure()
        {
            _createAssignmentPanel.Visible = true;
            _distributeButton.Enabled = false;
        }

        private void DropDownDynamicItemsAdd(string commandText, AjaxControlToolkit.ComboBox target)
        {
            target.Items.Clear();
            if(commandText == "")
                return;
            
            try
            {
                _myCon.Open();
                SqlCeCommand command = _myCon.CreateCommand();
                command.CommandText = commandText;
                SqlCeDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    target.Items.Add(reader.GetValue(0).ToString());
                }
            }
          
            finally
            {
                _myCon.Close();
            }
        }

        private void LabelDynamicItemAdd(string commandText, Label target)
        {
            try
            {
                _myCon.Open();
                SqlCeCommand command = _myCon.CreateCommand();
                command.CommandText = commandText;
                object cmdResult = command.ExecuteScalar();
                if (cmdResult == null)
                    target.Text = "";
                else
                    target.Text = command.ExecuteScalar().ToString();
            }
            finally
            {
                _myCon.Close();
            }
        }

        private void ShowTable()
        {
            try
            {
                _myCon.Open();
                DataTable table = new DataTable();
                DataColumn employee = new DataColumn("Employee", typeof(string));
                DataColumn date = new DataColumn("Date", typeof(string));
                DataColumn company = new DataColumn("Company", typeof(string));
                DataColumn city = new DataColumn("City", typeof(string));
                DataColumn assignment = new DataColumn("Assignment", typeof(string));
                DataColumn priority = new DataColumn("Priority", typeof(string));
                DataColumn comment = new DataColumn("Comment", typeof(string));
                DataColumn status = new DataColumn("Status", typeof(string));
                DataColumn reason = new DataColumn("Reason", typeof(string));
                DataColumn result = new DataColumn("Result", typeof(string));
                table.Columns.AddRange(new DataColumn[] {employee, date, company, city, assignment, priority, comment, status, reason, result });
                SqlCeCommand command = _myCon.CreateCommand();
                command.CommandText = "SELECT assignment_id, employee, tour_date, company, city, assignment, priority, tour_comment, status, reason, result FROM assignment WHERE status != 'Deleted';";
                SqlCeDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    _assignmentIdList.Add(int.Parse(reader.GetValue(0).ToString()));
                    table.Rows.Add(new object[] 
                    { 
                        reader.GetValue(1).ToString(), 
                        reader.GetValue(2).ToString(),
                        reader.GetValue(3).ToString(),
                        reader.GetValue(4).ToString(),
                        reader.GetValue(5).ToString(),
                        reader.GetValue(6).ToString(),
                        reader.GetValue(7).ToString(),
                        reader.GetValue(8).ToString(),
                        reader.GetValue(9).ToString(),
                        reader.GetValue(10).ToString()
                    });
                }
                _currentAssignmentsTable.DataSource = table;
                _currentAssignmentsTable.DataBind();
                _currentAssignmentsTable.HeaderRow.Attributes["class"] = "column";
                _currentAssignmentsTable.RowStyle.CssClass = "tableRow";
            }
            finally
            {
                _myCon.Close();
            }
        }

        private void UpdateDate()
        {
            try
            {
                _myCon.Open();
                SqlCeCommand command = _myCon.CreateCommand();
                command.CommandText = "UPDATE last_updated SET last_date = GETDATE()";
                command.ExecuteNonQuery();
            }
            finally
            {
                _myCon.Close();
            }
        }

        private void InsertAssignment()
        {
            try
            {
                _myCon.Open();
                SqlCeCommand command = _myCon.CreateCommand();
                string cmd = "INSERT INTO assignment (employee, usr, tour_date, company, city, assignment, priority, tour_comment, status) VALUES('";
                cmd += _employeeSelectionDropDown.SelectedItem.ToString() + "', '";
                cmd += _employeeIdLabel.Text + "', '";
                cmd += _calendarTextBox.Text + "', '";
                cmd += _clientSelectionDropDown.SelectedItem.ToString() + "', '";
                cmd += _citySelectionDropDown.SelectedItem.ToString() + "', '";
                cmd += _assignmentTextBox.Text + "', '";
                cmd += _priorityDropDown.SelectedItem.ToString() + "', '";
                cmd += _commentTextBox.Text + "', '";
                cmd += "Waiting for distribution');";
                command.CommandText = cmd;
                command.ExecuteNonQuery();
            }
            finally
            {
                _myCon.Close();
            }
        }

        private void DeleteAssignment(int id)
        {
            try
            {
                _myCon.Open();
                SqlCeCommand command = _myCon.CreateCommand();
                command.CommandText = "UPDATE assignment SET status = 'Deleted' WHERE assignment_id = " + id + ";";
                command.ExecuteNonQuery();
            }
            finally
            {
                _myCon.Close();
            }
        }

        private void SendAssignments()
        {
            string outCert = "";
            string outCertPass = "";
            var urlRemote = "";
            try
            {
                outCert = ConfigurationManager.AppSettings.GetValues("OutCert")[0];
                outCertPass = ConfigurationManager.AppSettings.GetValues("OutCertPassword")[0];
                urlRemote = ConfigurationManager.AppSettings.GetValues("OutTarget")[0];
                var comlo = new Comlo(
                    new Wdxclientf(
                        urlRemote,
                        new X509Certificate2(outCert, outCertPass, X509KeyStorageFlags.MachineKeySet)));
                AssignmentType assignment = new AssignmentType();
                _myCon.Open();
                SqlCeCommand command = _myCon.CreateCommand();
                command.CommandText = "SELECT assignment_id, usr, tour_date, company, city, assignment, priority, tour_comment FROM assignment WHERE status = 'Waiting for distribution';";
                SqlCeDataReader readerNew = command.ExecuteReader();
                while (readerNew.Read())
                {
                    NewAssignment newAssignment = new NewAssignment();
                    newAssignment.AssignmentId = readerNew.GetValue(0).ToString();
                    newAssignment.Usr = readerNew.GetValue(1).ToString();
                    newAssignment.Date = readerNew.GetValue(2).ToString();
                    newAssignment.Company = readerNew.GetValue(3).ToString();
                    newAssignment.City = readerNew.GetValue(4).ToString();
                    newAssignment.Assignment = readerNew.GetValue(5).ToString();
                    newAssignment.Priority = readerNew.GetValue(6).ToString();
                    newAssignment.Comment = readerNew.GetValue(7).ToString();
                    assignment.NewAssignmentList.Add(newAssignment);
                }
                _myCon.Close();
                _myCon.Open();
                command.CommandText = "SELECT assignment_id FROM assignment WHERE status = 'Deleted'";
                readerNew = command.ExecuteReader();
                while (readerNew.Read())
                {
                    DeletedAssignment deletedAssignment = new DeletedAssignment();
                    deletedAssignment.AssignmentId = readerNew.GetValue(0).ToString();
                    assignment.DeletedAssignmentList.Add(deletedAssignment);
                }
                comlo.SendAssignmentChanges(assignment);
                _resultOk.Visible = true;
            }
            catch (Exception ex)
            {
                _resultFailed.Visible = true;
                _resultFailed.Text = "Assignments are not distrebuted yet.\n" + ex.Message + "\n" + ex.StackTrace;
            }
            finally
            {
                _myCon.Close();
            }
        }

        private void DeleteOrdinary()
        {
            try
            {
                _myCon.Open();
                SqlCeCommand command = _myCon.CreateCommand();
                command.CommandText = "DELETE FROM assignment WHERE status = 'Deleted';";
                command.ExecuteNonQuery();
            }
            finally
            {
                _myCon.Close();
            }
        }

        private void AssignmentToPending()
        {
            try
            {
                _myCon.Open();
                SqlCeCommand command = _myCon.CreateCommand();
                command.CommandText = "UPDATE assignment SET status = 'Pending' WHERE status = 'Waiting for distribution';";
                command.ExecuteNonQuery();
            }
            finally
            {
                _myCon.Close();
            }
        }


    }
}