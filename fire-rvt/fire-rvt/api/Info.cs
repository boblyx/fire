using System;
using System.Diagnostics;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Analysis;
using Autodesk.Revit.UI.Selection;
using System.Collections.Generic;
using Autodesk.Revit.DB.Architecture;
using System.Linq;
using System.Text.Json;
/// <summary>
/// For getting information from the Revit model
/// </summary>
namespace fire_rvt.api
{
    public class FloorInfo
    {
        public string id { get; set; }
        public string name { get; set; }

        public FloorInfo(string id, string name) {
            this.id = id;
            this.name = name;
        }
    }
    public class LevelList
    {
        public List<FloorInfo> Floors { get; set; }

        public LevelList() {
            Floors = new List<FloorInfo>();
        }
    }

    public class Info
    {
        public static string GetFloors(UIApplication app)
        {
            var uiDoc = app.ActiveUIDocument;
            var doc = uiDoc.Document;
            FilteredElementCollector flrCollect = new FilteredElementCollector(doc);
            var flrs = flrCollect.OfClass(typeof(Level));
            LevelList lvlist = new LevelList();
            foreach (Level flr in flrs) {
                lvlist.Floors.Add(new FloorInfo(flr.UniqueId, flr.Name));
            }
            return JsonSerializer.Serialize(lvlist);
        }
    }
}
