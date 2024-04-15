using System.Collections.Generic;
using System.Diagnostics;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Analysis;
using Autodesk.Revit.UI.Selection;
using Autodesk.Revit.DB.Architecture;

/// <summary>
/// For executing Revit Routines when called from Web UI
/// Author: Bob Lee
/// </summary>
namespace fire_rvt
{
    public class RevitEventHandler : IExternalEventHandler
    {
        public enum RevitActionsEnum
        {
            Invalid = -1,
            GetFloors,
            GetRooms,
            PlaceExtinguishers
        }

        private RevitActionsEnum _currentRevitActions;
        private readonly ExternalEvent _externalEvent;
        public WebWindow webWindow;

        public RevitEventHandler()
        {
            _externalEvent = ExternalEvent.Create(this);
        }

        public void Execute(UIApplication app)
        {
            Debug.WriteLine("Handling Revit Event!");
            switch (_currentRevitActions)
            {
                case RevitActionsEnum.GetFloors:
                    string payload = api.Info.GetFloors(app);
                    Debug.WriteLine(payload);
                    webWindow.SendPayload("updateFloors", payload);
                    break;
                case RevitActionsEnum.GetRooms:
                    break;
                case RevitActionsEnum.PlaceExtinguishers:
                    PlaceExtinguishers(app);
                    break;
                default:
                    Debug.WriteLine("Unhandled Action.");
                    break;
            }
        }

        public ExternalEventRequest Raise(RevitActionsEnum revitActionsName) {
            _currentRevitActions = revitActionsName;
            return _externalEvent.Raise();
        }

        public string GetName()
        {
            return nameof(RevitEventHandler);
        }

        public void PlaceExtinguishers(UIApplication app) {

            List<FamilySymbol> extFams = api.Info.getExtinguisherSymbols(app);
            FamilySymbol extFam = extFams[0];
            var doc = app.ActiveUIDocument.Document;
            Level level = doc.GetElement(webWindow.level_id) as Level;

            foreach (double[] loc in webWindow.exts_to_place)
            {

            }
        }
    }
}
