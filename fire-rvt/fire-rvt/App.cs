#region Namespaces
using System;
using System.Collections.Generic;
using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using System.IO;
using System.Reflection;
using System.Drawing;
using System.Drawing.Imaging;
#endregion

namespace fire_rvt
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]

    class App : IExternalApplication
    {
        public Result OnStartup(UIControlledApplication a)
        {
            a.CreateRibbonTab("Fire");
            RibbonPanel ribbon = a.CreateRibbonPanel("Fire", "Check");

            string thisAssembly = Assembly.GetExecutingAssembly().Location;

            PushButtonData showPane = new PushButtonData("Start App", "Start App", thisAssembly, "fire_rvt.WebCommand");
            RibbonItem show = ribbon.AddItem(showPane);
            return Result.Succeeded;
        }

        public Result OnShutdown(UIControlledApplication a)
        {
            return Result.Succeeded;
        }
    }
}
