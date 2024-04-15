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
/// TODO: 
/// - [x] Generate Navmeshes
/// - [x] Add extinguishers
/// - [ ] Convert to metric
/// - [ ] Add doors
/// Author: Bob Lee
/// </summary>
namespace fire_rvt.api
{ 
    // FLOOR SCHEMA
    public class FloorInfo
    {
        public string id { get; set; }
        public string name { get; set; }
        public List<RoomInfo> rooms { get; set; }

        public FloorInfo(string id, string name, List<RoomInfo> rooms) {
            this.id = id;
            this.name = name;
            this.rooms = rooms;
        }
    }
    public class LevelList
    {
        public List<FloorInfo> Floors { get; set; }

        public LevelList() {
            Floors = new List<FloorInfo>();
        }
    }
    // END FLOOR SCHEMA

    // ROOM SCHEMA
    public class RoomInfo
    {
        public string id { get; set; }
        public string name { get; set; }
        public string level { get; set; }
        public double area { get; set; }
        public List<List<List<double[]>>> vertices { get; set; }
        public List<double[]> extinguisher_vertices { get; set; }
        public NavMesh navmesh { get; set; }

        public RoomInfo(string id, string name, 
            string level, List<List<List<double[]>>> vertices, 
            NavMesh navmesh, List<double[]> extinguishers, double area)
        {
            this.id = id;
            this.name = name;
            this.level = level;
            this.vertices = vertices;
            this.navmesh = navmesh;
            this.extinguisher_vertices = extinguishers;
            
            this.area = Utilities.sqm(area);
        }
    }

    public class RoomList
    {
        public List<RoomInfo> Rooms { get; set; }

        public RoomList() {
            Rooms = new List<RoomInfo>();
        }
    }

    public class NavMesh
    {
        public List<List<int>> faces { get; set; }
        public List<double[]> vertices { get; set; }

        /// <summary>
        /// Initializes a NavMesh.
        /// </summary>
        /// <param name="vertices"></param>
        /// <param name="faces"></param>
        public NavMesh(List<double[]> vertices, List<List<int>> faces) {
            this.vertices = vertices;
            this.faces = faces;
        }

        /// <summary>
        /// Creates an empty NavMesh object.
        /// </summary>
        /// <returns>A NavMesh with 0 vertices and faces.</returns>
        public static NavMesh EmptyMesh() {
            return new NavMesh(new List<double[]> { }, new List<List<int>> { });
        }
    }
    // END ROOM SCHEMA

    public class Info
    {
        /// <summary>
        /// Gets all floor levels in the project and their room info.
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static string GetFloors(UIApplication app)
        {
            var uiDoc = app.ActiveUIDocument;
            var doc = uiDoc.Document;
            FilteredElementCollector flrCollect = new FilteredElementCollector(doc);
            var flrs = flrCollect.OfClass(typeof(Level));
            LevelList lvlist = new LevelList();
            // Get all rooms first them assign them to the correct floor
            List<RoomInfo> lvlrooms = new List<RoomInfo>();
            Debug.WriteLine("Getting Rooms!");
            RoomList rms = GetRooms(app);
            Debug.WriteLine(rms.Rooms.Count.ToString() + " Rooms registered");
            Dictionary<string, List<RoomInfo>> indxRms = new Dictionary<string, List<RoomInfo>>();
            foreach (RoomInfo rm in rms.Rooms)
            {
                if(!indxRms.ContainsKey(rm.level))
                {
                    indxRms[rm.level] = new List<RoomInfo>();
                }
                indxRms[rm.level].Add(rm);
            }
            foreach (Level flr in flrs)
            {
                lvlist.Floors.Add(new FloorInfo(flr.UniqueId, flr.Name, indxRms[flr.UniqueId]));
            }
            string jsonst = JsonSerializer.Serialize(lvlist);
            Debug.WriteLine(jsonst);
            return jsonst;
        }

        /// <summary>
        /// Gets all relevant room data as a list of room data.
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static RoomList GetRooms(UIApplication app)
        {
            var doc = app.ActiveUIDocument.Document;
            FilteredElementCollector rmCollect = new FilteredElementCollector(doc);
            var rms = rmCollect.OfClass(typeof(SpatialElement));
            RoomList rmlist = new RoomList();
            foreach (Room rm in rms)
            {
                // Get all info first
                string id = rm.UniqueId;
                string name = rm.Name;
                string lvl = rm.Level.UniqueId;
                List<List<List<double[]>>> verts = GetRoomLines(rm);
                Debug.WriteLine("\tObtained Room Lines for " + rm.Name + ".");
                NavMesh nav_mesh = GetNavMesh(rm);
                Debug.WriteLine("\tObtained NavMesh for " + rm.Name + ".");
                List<double[]> exts = GetExtinguishers(app, rm);
                Debug.Write("\tObtained Extinguishers for " + rm.Name);
                rmlist.Rooms.Add(new RoomInfo(id, name, lvl, verts, nav_mesh, exts, rm.Area));
            }
            return rmlist;
        }

        public static List<FamilySymbol> getExtinguisherSymbols(UIApplication app) {
            var doc = app.ActiveUIDocument.Document;
            List<FamilySymbol> outlist = new List<FamilySymbol>();
            FilteredElementCollector fc = new FilteredElementCollector(doc);//.OfClass(typeof(FamilySymbol));
            fc.OfCategory(BuiltInCategory.OST_FireAlarmDevices);
            fc.OfClass(typeof(FamilySymbol));
            foreach (FamilySymbol fs in fc)
            {
                if (!(fs.FamilyName.ToUpper().Contains("EXTINGUISHER"))) { continue;  }
                outlist.Add(fs);
            }
            return outlist;
        }

        /// <summary>
        /// Gets extinguishers inside a room.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="room"></param>
        /// <returns></returns>
        public static List<double[]> GetExtinguishers(UIApplication app, Room room)
        {
            List<double[]> coords = new List<double[]> { };
            var doc = app.ActiveUIDocument.Document;
            FilteredElementCollector excollect = new FilteredElementCollector(doc);//.OfClass(typeof(FamilyInstance));
            excollect.OfCategory(BuiltInCategory.OST_FireAlarmDevices);
            excollect.OfClass(typeof(FamilyInstance));
            foreach (FamilyInstance fitem in excollect)
            {
                ElementId typeId = fitem.GetTypeId();
                if (typeId.IntegerValue == -1) { continue; }
                if (fitem.Room == null) { continue; }
                Element fele = doc.GetElement(typeId);
                string familyName = fele.get_Parameter(BuiltInParameter.ALL_MODEL_FAMILY_NAME).AsString();
                // Skip families that are not extinguishers
                if (!(familyName.ToUpper().Contains("EXTINGUISHER"))) { continue; }
                if (!(fitem.Room.Id == room.Id)) { continue; }
                List<XYZ> loc = new List<XYZ>();
                LocationPoint lp = fitem.Location as LocationPoint;
                loc.Add(lp.Point);
                coords.Add(new double[] { Utilities.mm(loc[0].X), Utilities.mm(loc[0].Y) });
            }
            return coords;
        }

        /// <summary>
        /// TODO Get doors to render. For scoring extinguisher placements.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="room"></param>
        /// <returns></returns>
        public static List<double[]> GetDoors(UIApplication app, Room room)
        {
            return new List<double[]> { };
        }
        
        /// <summary>
        /// Returns navmesh for a current Room
        /// </summary>
        /// <param name="room"></param>
        /// <returns></returns>
        public static NavMesh GetNavMesh(Room room)
        {
            // Get .Geometry of the Room element
            // Extract X,Y of each vertices and put them into a list, ignoring those with duplicate X, Y coords
            // loop through face list and discard facelists for which indices cant be found in above list
            GeometryElement rm_geom = room.get_Geometry(new Options());
            List<NavMesh> meshes = new List<NavMesh> { };
            foreach (GeometryObject geom in rm_geom)
            {
                if (!Utilities.isSolid(geom)) { continue; }
                meshes.Add(Utilities.toMesh(geom));
            }
            //if (meshes.Count() == 0) { return NavMesh() };
            return meshes[0];
        }
        
        /// <summary>
        /// Example:
        /// [
        ///   [ // 0th is the main large boundary
        ///     [
        ///       [0,1], [1,2]
        ///     ],
        ///     [
        ///     [1,2], [3,4]
        ///     ]
        ///   ],
        ///   [ // 1 onwards are obstacles
        ///       ....
        ///   ]
        /// ]
        /// </summary>
        /// <param name="rm"></param>
        /// <returns></returns>
        public static List<List<List<double[]>>> GetRoomLines(Room rm)
        {
            IList<IList<BoundarySegment>> segments = rm.GetBoundarySegments(new SpatialElementBoundaryOptions());
            if (segments == null) { return new List<List<List<double[]>>> { }; } // Skip unbounded rooms
            List<List<List<double[]>>> loops = new List<List<List<double[]>>> { };
            foreach (IList<BoundarySegment> lbseg in segments)
            {
                List<List<double[]>> lines = new List<List<double[]>>();
                foreach (BoundarySegment bseg in lbseg)
                {
                    List<double[]> coords = new List<double[]>();
                    coords.Add(new double[]{
                        Utilities.mm(bseg.GetCurve().GetEndPoint(0).X)
                        ,Utilities.mm(bseg.GetCurve().GetEndPoint(0).Y)
                        ,Utilities.mm(bseg.GetCurve().GetEndPoint(0).Z)
                    });

                    // Line End Point
                    coords.Add(new double[]{
                        Utilities.mm(bseg.GetCurve().GetEndPoint(1).X)
                        ,Utilities.mm(bseg.GetCurve().GetEndPoint(1).Y)
                        ,Utilities.mm(bseg.GetCurve().GetEndPoint(1).Z)
                    });
                    lines.Add(coords);
                }
                loops.Add(lines);
            }
            return loops;
        }
    }
}
