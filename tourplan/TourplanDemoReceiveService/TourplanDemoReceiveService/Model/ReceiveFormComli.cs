using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TourplanDemoReceiveService.Coml;
using TourplanDemoReceiveService.Model;
using System.Configuration;
using MySql.Data.MySqlClient;

namespace TourplanDemoReceiveService.Model
{
    public class ReceiveFormComli: IComli
    {
        public void ReceiveForm(AssignmentChangeForm assignmentChangeForm)
        {
            string conStr = ConfigurationManager.ConnectionStrings["tourplandemoConnectionString"].ConnectionString;
            MySqlConnection myCon = new MySqlConnection(conStr);
            try
            {
                myCon.Open();
                MySqlCommand command = myCon.CreateCommand();
                command.CommandText = "UPDATE assignment SET ";
                command.CommandText += "status = '" + assignmentChangeForm.Status;
                command.CommandText += "', reason = '" + assignmentChangeForm.Reason;
                command.CommandText += "', result = '" + assignmentChangeForm.Result;
                command.CommandText += "', barcode = '" + assignmentChangeForm.Barcode;
                command.CommandText += "' WHERE assignment_id = " + int.Parse(assignmentChangeForm.AssigmentId) + ";";
                command.ExecuteNonQuery();
            }
            catch (MySqlException)
            {
            }
            finally
            {
                myCon.Close();
            }
        }
    }
}