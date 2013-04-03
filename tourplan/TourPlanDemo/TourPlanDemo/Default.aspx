<%@ Page Title="" Language="C#" Culture="en-GB" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" EnableEventValidation="True" Inherits="TourPlanDemo.Default" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<asp:Content ID="Content" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <div class="welcome">
        Welcome!
    </div>
    <asp:UpdatePanel ID="CreateAssignmentUpdatePanel" runat="server">
        <ContentTemplate>
            <div class="createAssignmentButton">
                <asp:Button ID="_createAssignmentButton" runat="server" 
                    Text="1) Create assignment" Width="90px" Height="50px" 
                    onclick="CreateAssignmentButtonClick" />
                </div>
            <div class="createAssignmentText">
                Create and distrubute assignments in 2 steps.<br />
                First create and save assignments.  If you gathered some saved assignments,<br />
                distribute them.
            </div>
            <asp:Panel CssClass="createAssignmentPanel" ID="_createAssignmentPanel" 
                runat="server" BorderStyle="Solid" BorderWidth="2" Visible="False">
                <div class="panelTitle">
                    Date Selection
                </div>
                <div class="row">
                    <div class="assignmentLeft">
                        <asp:Label runat="server" Text="Date:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight">
                        <asp:TextBox ID="_calendarTextBox" runat="server" Width="200" ></asp:TextBox>
                        <asp:CalendarExtender ID="_calendarExtender" runat="server" TargetControlID="_calendarTextBox">
                        </asp:CalendarExtender>
                    </div>
                </div>
                <div class="panelTitle">
                    Client selection
                </div>
                <div class="row">
                    <div class="assignmentLeft">
                        <asp:Label runat="server" Text="Client search:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight">
                        <asp:TextBox ID="_clientSearchTextBox" runat="server" Width="200" 
                            AutoPostBack="True" ontextchanged="ClientSearchTextChanged"></asp:TextBox>
                    </div>
                    <div class="assignmentLeft">
                        <asp:Label  runat="server" Text="Client selection:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight assignmentRightCombobox">
                        <asp:ComboBox ID="_clientSelectionDropDown" runat="server" Width="200px" 
                            DropDownStyle="DropDownList" onselectedindexchanged="ClientSelected" AutoPostBack="True">
                        </asp:ComboBox>
                    </div>
                    <div class="assignmentLeft assignmentRightCombobox">
                        <asp:Label runat="server" Text="City:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight assignmentRightCombobox">
                        <asp:ComboBox ID="_citySelectionDropDown" runat="server" Width="200px" 
                            DropDownStyle="DropDownList">
                        </asp:ComboBox>
                    </div>
                </div>
                <div class="panelTitle">
                    Assignment selection
                </div>
                <div class="row">
                    <div class="assignmentLeft">
                        <asp:Label runat="server" Text="Assignment category:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight assignmentRightCombobox">
                        <asp:ComboBox ID="_assignmentCategoryDropDown" runat="server" Width="200px" 
                            DropDownStyle="DropDownList" onselectedindexchanged="AssignmentCategorySelected" AutoPostBack="True">
                        </asp:ComboBox>
                    </div>
                    <div class="assignmentLeft">
                        <asp:Label runat="server" Text="Assignment:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight">
                        <asp:TextBox ID="_assignmentTextBox" runat="server" Width="400" Height="100px" 
                            Rows="5" TextMode="MultiLine"></asp:TextBox>
                    </div>
                    <div class="assignmentLeft">
                        <asp:Label runat="server" Text="Priority:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight assignmentRightCombobox">
                        <asp:ComboBox ID="_priorityDropDown" runat="server" Width="200px" DropDownStyle="DropDownList">
                            <asp:ListItem></asp:ListItem>
                            <asp:ListItem>Immediate</asp:ListItem>
                            <asp:ListItem>Urgent</asp:ListItem>
                            <asp:ListItem>Normal</asp:ListItem>
                            <asp:ListItem>Low</asp:ListItem>
                            <asp:ListItem>Last to accomplish</asp:ListItem>
                        </asp:ComboBox>
                    </div>
                    <div class="assignmentLeft">
                        <asp:Label runat="server" Text="Comment:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight">
                        <asp:TextBox ID="_commentTextBox" runat="server" Width="400" Height="100px" 
                            Rows="5" TextMode="MultiLine"></asp:TextBox>
                    </div>
                </div>
                <div class="panelTitle">
                    Employee selection
                </div>
                <div class="row">
                    <div class="assignmentLeft">
                        <asp:Label runat="server" Text="Employee search:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight">
                        <asp:TextBox ID="_employeeSearchTextbox" runat="server" Width="200" 
                            AutoPostBack="True" ontextchanged="EmployeeSearchTextChanged"></asp:TextBox>
                    </div>
                    <div class="assignmentLeft">
                        <asp:Label  runat="server" Text="Employee selection:" Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight assignmentRightCombobox">
                        <asp:ComboBox ID="_employeeSelectionDropDown" runat="server" Width="200px" 
                            DropDownStyle="DropDownList" onselectedindexchanged="EmployeeSelected" AutoPostBack="True">
                        </asp:ComboBox>
                    </div>
                    <div class="assignmentLeft">
                        <asp:Label runat="server" Text="Employee's ID: " Font-Bold="True"></asp:Label>
                    </div>
                    <div class="assignmentRight">
                        <asp:Label ID="_employeeIdLabel" runat="server" Text=""></asp:Label>
                    </div>
                </div>
                <asp:Button ID="_saveAssignmentButton" CssClass="saveAssignmentButton" runat="server" Text="2) Save assignment" 
                    OnClick="SaveAssignment" Height="50px" Width="90px" />
                <asp:Label CssClass="validator" ID="_valiatorMsg" Visible="false" runat="server" Text="Date, client, city, priority and employee fields is required!"></asp:Label>
            </asp:Panel>
            <asp:Label CssClass="separatorNeutral" runat="server" Text=""></asp:Label>
            <asp:Label CssClass="currentAssignment" runat="server" Text="Current assignments"></asp:Label>
            <asp:GridView ID="_currentAssignmentsTable" CssClass="table" runat="server" 
                AutoGenerateDeleteButton="True" CellPadding="5" ShowHeaderWhenEmpty="True" 
                onrowdeleting="AssignmentDelete">
            </asp:GridView>
            <asp:Label runat="server" Text="Last updated:" Font-Italic="True" 
                CssClass="font_size"></asp:Label>
            <asp:Label ID="_lastUpdated" runat="server" Text="2012-11-12 14:47:21" CssClass="font_size" Font-Italic="True"></asp:Label>
            <br />
            <asp:Button ID="_refreshButton" runat="server" Text="Refresh" 
                onclick="RefreshTable" />
            <br />
            <asp:Label CssClass="separatorNeutral" runat="server" Text=""></asp:Label>
        </ContentTemplate>
    </asp:UpdatePanel>
    <asp:UpdatePanel ID="_distributeUpdatePanel" runat="server">
        <ContentTemplate>
            <div class="row">
                <div class="assignmentLeft">
                    <asp:Button CssClass="createAssignmentButton" ID="_distributeButton" 
                        runat="server" Text="3) Distribute new assignments" Height="70" Width="90" 
                        onclick="DistributeAssignment" />
                </div>
                <div class="assignmentRight distribute">
                    <asp:Label ID="_resultOk" CssClass="distributeOk" runat="server" Text="Assignments are distrebuted - sent to Mobilengine system." Visible="false"></asp:Label>
                    <asp:Label ID="_resultFailed" CssClass="validator" runat="server" Text="Assignments are not distrebuted yet." Visible="False"></asp:Label>
                </div>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
    <asp:UpdateProgress ID="UpdateProgress" runat="server" DisplayAfter="1" AssociatedUpdatePanelID="_distributeUpdatePanel">
        <ProgressTemplate>
        <div class="demoSiteImage">
            <asp:Image runat="server" ImageUrl="~/Pictures/waiting.gif" />
         </div>
        </ProgressTemplate>
    </asp:UpdateProgress>
    <asp:Panel ID="Panel1" runat="server">
    </asp:Panel>
</asp:Content>