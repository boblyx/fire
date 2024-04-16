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
/// <summary>
/// Initializes Revit ribbon plugin
/// Author: Bob Lee
/// </summary>
namespace fire_rvt
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]

    class App : IExternalApplication
    {
        public static RevitEventHandler rvtHandler;
        public Result OnStartup(UIControlledApplication a)
        {
            rvtHandler = new RevitEventHandler();
            a.CreateRibbonTab("Fire");
            RibbonPanel ribbon = a.CreateRibbonPanel("Fire", "Check");

            string thisAssembly = Assembly.GetExecutingAssembly().Location;
            Stream imgStream = Assembly.GetExecutingAssembly().GetManifestResourceStream("fire_rvt.images.Logo.png");
            Image iconImg = Image.FromStream(imgStream);
            PushButtonData showPane = new PushButtonData("Start App", "Start App", thisAssembly, "fire_rvt.WebCommand");
            showPane.LargeImage = Utilities.ToImageSource(iconImg, ImageFormat.Png);

            RibbonItem show = ribbon.AddItem(showPane);
            return Result.Succeeded;
        }

        public Result OnShutdown(UIControlledApplication a)
        {
            return Result.Succeeded;
        }
    }
}
