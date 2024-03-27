#region Namespaces
using System;
using System.Diagnostics;
using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System.Threading;
using Autodesk.Revit.UI.Selection;
#endregion

namespace fire_rvt
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]
    class WebCommand : IExternalCommand
    {
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements
            )
        {
            try
            {
                WebWindow webWindow = new WebWindow(commandData.Application);
                App.rvtHandler.webWindow = webWindow;
                webWindow.Show();
                return Result.Succeeded;
            }
            catch (Exception ex) {
                Debug.WriteLine(ex.Message);
                return Result.Failed;
            }
        }
    }
}
